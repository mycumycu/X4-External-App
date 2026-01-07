local ffi = require("ffi")
local C = ffi.C

local output = {}

function output.handle()

    local missionOfferCategories = {
        { category = "plot", },
        { category = "guild", },
        { category = "coalition", },
        { category = "other", },
    }

    local totalMissionOfferList = {}
    for _, entry in ipairs(missionOfferCategories) do
        totalMissionOfferList[entry.category] = {}
    end

    local missionOfferList, missionOfferIDs = {}, {}
    Helper.ffiVLA(missionOfferList, "uint64_t", C.GetNumCurrentMissionOffers, C.GetCurrentMissionOffers, true)
    for i, id in ipairs(missionOfferList) do
        missionOfferIDs[tostring(id)] = i
    end

    for _, entry in ipairs(missionOfferCategories) do
        if entry.category == "guild" then
            for i, data in ipairs(totalMissionOfferList[entry.category]) do
                for j = #data.missions, 1, -1 do
                    if missionOfferIDs[data.missions[j].ID] then
                        missionOfferIDs[totalMissionOfferList[entry.category][i].missions[j].ID] = nil
                    else
                        if not totalMissionOfferList[entry.category][i].missions[j].accepted then
                            totalMissionOfferList[entry.category][i].missions[j].expired = true
                        end
                    end
                end
            end
        else
            for i = #totalMissionOfferList[entry.category], 1, -1 do
                if missionOfferIDs[totalMissionOfferList[entry.category][i].ID] then
                    missionOfferIDs[totalMissionOfferList[entry.category][i].ID] = nil
                else
                    if not totalMissionOfferList[entry.category][i].accepted then
                        totalMissionOfferList[entry.category][i].expired = true
                    end
                end
            end
        end
    end

    for id in pairs(missionOfferIDs) do
        local name, description, difficulty, threadtype, maintype, subtype, subtypename, faction, reward, rewardtext, briefingobjectives, activebriefingstep, briefingmissions, oppfaction, licence, missiontime, duration, _, _, _, _, actor = GetMissionOfferDetails(ConvertStringToLuaID(id))
        local missionGroup = C.GetMissionGroupDetails2(ConvertStringTo64Bit(id))
        local groupID, groupName = ffi.string(missionGroup.id), ffi.string(missionGroup.name)

        local factionDetails = C.GetFactionDetails(faction)
        local factionName = ffi.string(factionDetails.factionName)

        if maintype ~= "tutorial" then
            local entry = {
                ["name"] = name,
                ["description"] = description,
                ["difficulty"] = difficulty,
                ["duration"] = duration,
                ["missionGroup"] = { id = groupID, name = groupName },
                ["threadtype"] = threadtype,
                ["type"] = subtype,
                ["factionname"] = factionName or "",
                ["oppfaction"] = oppfaction or "",
                ["licence"] = licence,
                ["reward"] = reward,
                ["rewardtext"] = rewardtext,
                ["activebriefingstep"] = activebriefingstep,
                ["missiontime"] = missiontime,
                ["briefingobjectives"] = briefingobjectives,
                ["ID"] = id,
                ["subMissions"] = {},
            }

            if entry.missionGroup.id ~= "" then
                local index = 0
                for i, data in ipairs(totalMissionOfferList["guild"]) do
                    if data.id == entry.missionGroup.id then
                        index = i
                        break
                    end
                end
                if index ~= 0 then
                    table.insert(totalMissionOfferList["guild"][index].missions, entry)
                else
                    table.insert(totalMissionOfferList["guild"], { id = entry.missionGroup.id, name = entry.missionGroup.name, missions = { entry } })
                end
            else
                if maintype == "plot" then
                    table.insert(totalMissionOfferList["plot"], entry or 0)
                elseif onlinechapter ~= "" then
                    table.insert(totalMissionOfferList["coalition"], entry)
                else
                    table.insert(totalMissionOfferList["other"], entry)
                end
            end
        end
    end

    table.sort(totalMissionOfferList["guild"], Helper.sortName)
    for _, entry in ipairs(totalMissionOfferList["guild"]) do
        table.sort(entry.missions, output.missionOfferSorter)
    end
    table.sort(totalMissionOfferList["plot"], output.missionOfferSorter)
    table.sort(totalMissionOfferList["coalition"], output.missionOfferSorter)
    table.sort(totalMissionOfferList["other"], output.missionOfferSorter)

    return totalMissionOfferList
end

function output.missionOfferSorter(a, b)
    if a.name == b.name then
        return a.ID > b.ID
    end
    return a.name < b.name
end

return output