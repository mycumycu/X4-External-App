package.path = package.path .. ";extensions/mycu_verbose_transaction_log/ui/?.lua";

local ffi = require("ffi")
local C = ffi.C
local verboseTransactionLogInstalled, verboseTransactionLog = pcall(require, "verbose_transaction_log")

local output = {
    -- Properties to exclude from hash calculation (frequently changing non-essential data)
    hashExclusions = { "time" },
    -- Store the last check state for comparison
    lastTransactionCount = nil,
    lastMostRecentTime = nil
}

function output.handle()
    local endtime = C.GetCurrentGameTime()
    local starttime = math.max(0, endtime - 3600) -- just last hour
    local maxEntries = 100 -- but no more than that

    local container = C.GetPlayerID()
    local n = C.GetNumTransactionLog(container, starttime, endtime)

    -- If no entries, return nil
    if n == 0 then
        return nil
    end

    -- Get a few recent entries to find the most recent one
    local checkCount = math.min(5, n) -- Check up to 5 entries to find the most recent
    local recentBuf = ffi.new("TransactionLogEntry[?]", checkCount)
    local recentNumCheck = C.GetNumTransactionLog(container, starttime, endtime)
    local recentN = C.GetTransactionLog(recentBuf, math.min(checkCount, recentNumCheck), container, starttime, endtime)

    if recentN == 0 then
        return nil
    end

    -- Find the most recent entry (highest time)
    local mostRecentEntry = recentBuf[0]
    for i = 1, recentN - 1 do
        if recentBuf[i].time > mostRecentEntry.time then
            mostRecentEntry = recentBuf[i]
        end
    end

    local currentMostRecentTime = mostRecentEntry.time

    -- Check if we should skip the update
    if output.lastTransactionCount and output.lastMostRecentTime then
        -- If transaction count is the same AND most recent time is the same, skip update
        if n == output.lastTransactionCount and currentMostRecentTime == output.lastMostRecentTime then
            return nil
        end
    end

    -- Changes detected, fetch all entries
    n = C.GetNumTransactionLog(container, starttime, endtime)
    local buf = ffi.new("TransactionLogEntry[?]", n)
    n = C.GetTransactionLog(buf, n, container, starttime, endtime)

    local data = {}

    for i = 0, n - 1 do
        local partnername = ffi.string(buf[i].partnername)

        local entry = {
            entryid = ConvertStringTo64Bit(tostring(buf[i].entryid)),
            time = buf[i].time,
            money = tonumber(buf[i].money) / 100,
            eventtypename = ffi.string(buf[i].eventtypename),
            partner = buf[i].partnerid,
            partnername = (partnername ~= "") and (partnername .. " (" .. ffi.string(buf[i].partneridcode) .. ")") or "",
            buyer = buf[i].buyerid,
            seller = buf[i].sellerid,
            ware = ffi.string(buf[i].ware),
            amount = buf[i].amount,
            price = tonumber(buf[i].price) / 100,
            description = "",
        }

        if (entry.buyer ~= 0) and (entry.seller ~= 0) then
            if entry.seller == container then
                entry.description = string.format(ReadText(1001, 7780), ffi.string(C.GetComponentName(entry.seller)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.seller)) .. ")", entry.amount, GetWareData(entry.ware, "name"), ffi.string(C.GetComponentName(entry.buyer)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.buyer)) .. ")", ConvertMoneyString(Helper.round(entry.price, 2), true, true, 0, true) .. " " .. ReadText(1001, 101))
            else
                entry.description = string.format(ReadText(1001, 7770), ffi.string(C.GetComponentName(entry.buyer)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.buyer)) .. ")", entry.amount, GetWareData(entry.ware, "name"), ffi.string(C.GetComponentName(entry.seller)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.seller)) .. ")", ConvertMoneyString(Helper.round(entry.price, 2), true, true, 0, true) .. " " .. ReadText(1001, 101))
            end
        elseif entry.buyer ~= 0 then
            entry.description = string.format(ReadText(1001, 7772), ffi.string(C.GetComponentName(entry.buyer)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.buyer)) .. ")", entry.amount, GetWareData(entry.ware, "name"), ConvertMoneyString(Helper.round(entry.price, 2), true, true, 0, true) .. " " .. ReadText(1001, 101))
        elseif entry.seller ~= 0 then
            entry.description = string.format(ReadText(1001, 7771), ffi.string(C.GetComponentName(entry.seller)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.seller)) .. ")", entry.amount, GetWareData(entry.ware, "name"), ConvertMoneyString(Helper.round(entry.price, 2), true, true, 0, true) .. " " .. ReadText(1001, 101))
        elseif entry.ware ~= "" then
            entry.description = entry.amount .. ReadText(1001, 42) .. " " .. GetWareData(entry.ware, "name") .. " - " .. ConvertMoneyString(entry.price, false, true, 0, true) .. " " .. ReadText(1001, 101)
        end
        if entry.partner ~= 0 then
            entry.partnername = ffi.string(C.GetComponentName(entry.partner)) .. " (" .. ffi.string(C.GetObjectIDCode(entry.partner)) .. ")"
            entry.destroyedpartner = not C.IsComponentOperational(entry.partner)
        else
            entry.destroyedpartner = entry.partnername ~= ""
        end
        if entry.eventtype == "trade" then
            if entry.seller and (entry.seller == container) then
                entry.eventtypename = ReadText(1001, 7781)
            elseif entry.buyer and (entry.buyer == container) then
                entry.eventtypename = ReadText(1001, 7782)
            end
        elseif entry.eventtype == "sellship" then
            if entry.partnername ~= "" then
                entry.eventtypename = ReadText(1001, 7783)
            else
                entry.eventtypename = entry.eventtypename .. ReadText(1001, 120) .. " " .. entry.partnername
                entry.partnername = ""
            end
        end

        if (verboseTransactionLogInstalled) then
            -- if verbose transaction mod is enabled - add verbose description
            verboseTransactionLog.boot()
            entry = verboseTransactionLog.setEntryDescription(entry)
        end

        table.insert(data, entry)
    end

    -- Sort in reverse order, from the most recent to the oldest
    table.sort(data, function(a, b)
        return a.time > b.time
    end)

    -- Store the current state for next comparison
    output.lastTransactionCount = n
    -- Always use the currentMostRecentTime we calculated during the quick check
    output.lastMostRecentTime = currentMostRecentTime

    -- Return only the first maxEntries elements
    return table.move(data, 1, maxEntries, 1, {})
end

return output