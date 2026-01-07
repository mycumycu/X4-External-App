local ffi = require("ffi")
local C = ffi.C

local output = {}

local function findTech(ftable, tech)
    for i, mainentry in ipairs(ftable) do
        for col, columnentry in ipairs(mainentry) do
            for j, techentry in ipairs(columnentry) do
                if techentry.tech == tech then
                    return i, col, j
                end
            end
        end
    end
end

function output.handle()
    local data = {
        name = nil,
        description = nil,
        researchtime = nil,
        precursors = {},
        resources = {},
        percentageCompleted = nil,
    }

    local techTree = {}
    local currentResearch = {}
    local researchModules = {}

    local stationhqlist = {}
    Helper.ffiVLA(stationhqlist, "UniverseID", C.GetNumHQs, C.GetHQs, "player")

    for i = 1, #stationhqlist do
        Helper.ffiVLA(researchModules, "UniverseID", C.GetNumResearchModules, C.GetResearchModules, stationhqlist[i])
        -- trigger a production update to ensure any completed research items have been added to the player research database
        C.UpdateProduction(stationhqlist[i], false)
    end

    for _, module in ipairs(researchModules) do
        local module64 = ConvertStringTo64Bit(tostring(module))
        local proddata = GetProductionModuleData(module64)
        if (proddata.state == "producing") or (proddata.state == "waitingforresources") then
            currentResearch[proddata.blueprintware] = module
        end
    end

    -- Get all research wares from the WareDB.
    local numTechs = C.GetNumWares("", true, "", "hidden")
    local rawTechlist = ffi.new("const char*[?]", numTechs)
    local tempTechlist = {}
    numTechs = C.GetWares(rawTechlist, numTechs, "", true, "", "hidden")
    for i = 0, numTechs - 1 do
        local tech = ffi.string(rawTechlist[i])
        if IsKnownItem("researchables", tech) then
            table.insert(tempTechlist, tech)
        end
    end
    -- NB: don't really need to sort at this point, but will help the entries in the menu stay consistent.
    table.sort(tempTechlist, Helper.sortWareSortOrder)

    -- print("searching for wares without precursor")
    for i = #tempTechlist, 1, -1 do
        local techprecursors, sortorder = GetWareData(tempTechlist[i], "researchprecursors", "sortorder")
        if #techprecursors == 0 then
            if not GetWareData(tempTechlist[i], "ismissiononly") then
                local state_completed = C.HasResearched(tempTechlist[i])
                table.insert(techTree, { [1] = { [1] = { tech = tempTechlist[i], sortorder = sortorder, completed = state_completed } } })
            end
            table.remove(tempTechlist, i)
        else
            local hasonlymissionprecursors = true
            for i, precursor in ipairs(techprecursors) do
                if not GetWareData(precursor, "ismissiononly") then
                    hasonlymissionprecursors = false
                    break
                end
            end
            if hasonlymissionprecursors then
                -- print("found with only mission precursors" .. temptechlist[i])
                local state_completed = C.HasResearched(tempTechlist[i])
                table.insert(techTree, { [1] = { [1] = { tech = tempTechlist[i], sortorder = sortorder, completed = state_completed } } })
                table.remove(tempTechlist, i)
            end
        end
    end

    local loopcounter = 0
    local idx = 1
    while #tempTechlist > 0 do
        local techprecursors, sortorder = GetWareData(tempTechlist[idx], "researchprecursors", "sortorder")
        local precursordata = {}
        local smallestMainIdx, foundPrecusorCol
        -- try to find all precusors in existing data
        for i, precursor in ipairs(techprecursors) do
            local mainIdx, precursorCol = findTech(techTree, precursor)
            if mainIdx and ((not smallestMainIdx) or (smallestMainIdx > mainIdx)) then
                smallestMainIdx = mainIdx
                foundPrecusorCol = precursorCol
            end
            precursordata[i] = { mainIdx = mainIdx, precursorCol = precursorCol }
        end
        -- sort so that highest index comes first - important for deletion order and keeping smallestMainIdx valid

        if smallestMainIdx then
            -- fix wares without precursors that there wrongly placed in different main entries
            for i, entry in ipairs(precursordata) do
                if entry.mainIdx and (entry.mainIdx ~= smallestMainIdx) then
                    for col, columndata in ipairs(techTree[entry.mainIdx]) do
                        for techidx, techentry in ipairs(columndata) do
                            if (techTree[smallestMainIdx][col] ~= nil) then
                                table.insert(techTree[smallestMainIdx][col], techentry)
                            end
                        end
                    end
                    table.remove(techTree, entry.mainIdx)
                end
            end

            -- add this tech to the tree and remove it from the list
            local state_completed = C.HasResearched(tempTechlist[idx])
            if techTree[smallestMainIdx][foundPrecusorCol + 1] then
                table.insert(techTree[smallestMainIdx][foundPrecusorCol + 1], { tech = tempTechlist[idx], sortorder = sortorder, completed = state_completed })
            else
                techTree[smallestMainIdx][foundPrecusorCol + 1] = { [1] = { tech = tempTechlist[idx], sortorder = sortorder, completed = state_completed } }
            end
            table.remove(tempTechlist, idx)
        end

        if idx >= #tempTechlist then
            loopcounter = loopcounter + 1
            idx = 1
        else
            idx = idx + 1
        end
        if loopcounter > 100 then
            DebugError("Infinite loop detected - aborting.")
            break
        end
    end

    for i, mainentry in ipairs(techTree) do
        lastsortorder = mainentry[1][1].sortorder

        local maxRows = 0
        for col, columnentry in ipairs(mainentry) do
            maxRows = math.max(maxRows, #columnentry)

            for j, techentry in ipairs(columnentry) do
                local percentageCompleted = 0

                if techentry.completed then
                    percentageCompleted = 100
                elseif currentResearch[techentry.tech] then
                    local proddata = GetProductionModuleData(ConvertStringTo64Bit(tostring(currentResearch[techentry.tech])))
                    percentageCompleted = Helper.round(math.max(0, currentResearch[techentry.tech] and (GetProductionModuleData(ConvertStringTo64Bit(tostring(currentResearch[techentry.tech]))).cycleprogress or 0) or 100))

                    local researchName = GetWareData(techentry.tech, "name")
                    local description, researchtime = GetWareData(techentry.tech, "description", "researchtime")

                    data.name = researchName
                    data.description = description
                    data.researchtime = ConvertTimeString(researchtime)
                    data.percentageCompleted = percentageCompleted

                    if proddata.state == "waitingforresources" then

                        local resources, precursors = GetWareData(techentry.tech, "resources", "researchprecursors")

                        -- mission precursors
                        local hasmissionprecursors = false
                        for i, precursor in ipairs(precursors) do
                            if GetWareData(precursor, "ismissiononly") and (not C.HasResearched(precursor)) then
                                hasmissionprecursors = true
                                break
                            end
                        end
                        if (#precursors > 0) and hasmissionprecursors then
                            for i, precursor in ipairs(precursors) do
                                local name, ismissiononly = GetWareData(precursor, "name", "ismissiononly")
                                if ismissiononly and (not C.HasResearched(precursor)) then

                                    table.insert(data.precursors, {
                                        name = name,
                                    })
                                end
                            end
                        end

                        -- resources
                        if #resources > 0 then
                            for _, resourcedata in ipairs(resources) do
                                local resourceName = GetWareData(resourcedata.ware, "name")
                                local currentAmount = C.GetAmountOfWareAvailable(resourcedata.ware, currentResearch[techentry.tech])
                                local totalAmount = resourcedata.amount

                                table.insert(data.resources, {
                                    name = resourceName,
                                    currentAmount = currentAmount,
                                    totalAmount = totalAmount,
                                })
                            end
                        end
                    end
                end
            end
        end
    end

    return data
end

return output