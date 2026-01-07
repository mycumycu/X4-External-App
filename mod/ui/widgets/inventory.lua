-- Inventory widget reporter
-- Returns best-effort player/ship metadata and normalized inventory array

local ffi = require("ffi")
local C = ffi.C

local output = {
    -- Properties to exclude from hash calculation (frequently changing non-essential data)
    hashExclusions = { "currentGameTime" }
}

local function normalize_inventory(raw)
    local out = {}
    if not raw or type(raw) ~= "table" then return out end

    local isArray = false
    for k, _ in pairs(raw) do
        if type(k) == "number" then isArray = true; break end
    end

    if isArray then
        for _, entry in ipairs(raw) do
            if type(entry) == "table" then
                local id = entry.id or entry.ware or entry[1]
                local count = entry.count or entry.amount or entry[2] or 0
                if id then table.insert(out, { id = tostring(id), count = tonumber(count) or 0 }) end
            end
        end
    else
        for k, v in pairs(raw) do
            if type(k) == "string" then
                table.insert(out, { id = tostring(k), count = tonumber(v) or 0 })
            end
        end
    end

    return out
end

function output.handle()
    local data = {}

    local rawInv = GetPlayerInventory()

    data.inventory = rawInv

    return data
end

return output
