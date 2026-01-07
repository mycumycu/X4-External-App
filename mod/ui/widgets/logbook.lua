local output = {
    -- Properties to exclude from hash calculation (frequently changing non-essential data)
    hashExclusions = { "time" },
    -- Store the last fetched entry for comparison
    lastEntry = nil
}

function output.handle()
    local maxEntries = 100
    local logbookCategory = "all"
    local logbookNumEntries = GetNumLogbook(logbookCategory)

    -- If no entries, return nil
    if logbookNumEntries == 0 then
        return nil
    end

    -- Get only the most recent entry first for comparison
    local recentLogbook = GetLogbook(logbookNumEntries, 1, logbookCategory) or {}
    if #recentLogbook == 0 then
        return nil
    end

    local recentEntry = recentLogbook[1]

    -- Clean up the recent entry for comparison (same cleanup as before)
    local cleanEntry = {
        id = recentEntry.id,
        title = recentEntry.title,
        text = recentEntry.text,
        time = recentEntry.time,
        -- Add other relevant fields but exclude the ones we clean up
    }

    -- Compare with last entry (excluding time-based fields)
    if output.lastEntry and output.entriesEqual(cleanEntry, output.lastEntry) then
        -- No changes detected, return nil to skip update
        return nil
    end

    -- Changes detected, fetch all entries
    local numQuery = math.min(maxEntries, logbookNumEntries)
    local startIndex = math.max(1, logbookNumEntries - maxEntries + 1)
    local logbook = GetLogbook(startIndex, numQuery, logbookCategory) or {}

    local data = {}
    for i = #logbook, 1, -1 do
        local entry = logbook[i]
        entry.category = nil
        entry.entityname = nil
        entry.interaction = nil
        entry.interactionposition = nil
        entry.interactiontext = nil
        entry.interactioncomponent = nil

        table.insert(data, entry)
    end

    -- Store the most recent entry for next comparison
    output.lastEntry = cleanEntry

    return data
end

---
--- Compare two logbook entries for equality (excluding time-based fields)
---
function output.entriesEqual(entry1, entry2)
    if not entry1 or not entry2 then
        return false
    end

    -- Compare relevant fields (excluding time and passedtime)
    return entry1.id == entry2.id and
           entry1.title == entry2.title and
           entry1.text == entry2.text
end

return output