local ffi = require("ffi")
local C = ffi.C

local widgets

local mapMenu

local external = {
    maxGroup = 3, -- Maximum number of groups.
    cycleCounter = 0, -- Counter for cycle through groups.
    lastChecksums = {}, -- Store checksums of last sent results for change detection
};

local request = require("djfhe.http.request")
local method = 'POST'
local apiUrl = "http://" .. host .. ":" .. port .. "/api/data"



local function init ()
    package.path = package.path .. ";extensions/mycu_external_app/ui/?.lua";
    widgets = require("widgets")

    mapMenu = Helper.getMenu("MapMenu")

    -- Main event
    RegisterEvent("externalapp.getMessages", external.send)

    -- Reputations and Professions mod event triggered after all available guild missions offers are created AFTER the player clicks on the "Connect to the Guild Network" button
    RegisterEvent("kProfs.guildNetwork_onLoaded", external.send)
end

---
--- Send data to external app server
---
function external.send (_, param)
    local payload = external.fetchData()

    request.new(method)
           :setUrl(apiUrl)
           :setBody(payload)
           :send(
            function(response, err)
                if err then
                    DebugError("Error occured while sending data to External App Server: " .. tostring(err))
                end
            end
    )
end

---
--- Fetch data from widgets
---
function external.fetchData()
    local payload = {
        time = C.GetCurrentGameTime()
    }
    external.cycleCounter = external.cycleCounter + 1

    -- Determine which group to process (1,2,3 and then repeat)
    local widgetGroupToProcess = external.cycleCounter % external.maxGroup + 1

    for key, widget in pairs(widgets) do
        for _, group in ipairs(widget.groups) do
            -- Process only the widgets that belong to the current group
            if group == widgetGroupToProcess then
                local output = require(widget.path) -- this will be cached after first load
                local result = output.handle()
                if result ~= nil then
                    local exclusions = output.hashExclusions or {}
                    -- Check if result has changed since last time
                    if external.hasResultChanged(key, result, exclusions) then
                        payload[key] = result
                        -- Update stored checksum
                        external.lastChecksums[key] = external.generateChecksum(result, exclusions)
                    end
                end
                break
            end
        end
    end

    return external.removeUnsupportedTypes(payload)
end

---
--- Remove unsupported types
---
function external.removeUnsupportedTypes(value)
    local elementType = type(value)

    if elementType == "cname" or elementType == "userdata" or elementType == "cdata" then
        value = nil
    end

    if elementType == "table" then
        for k, v in pairs(value) do
            value[k] = external.removeUnsupportedTypes(v)
        end
    end

    return value
end

---
--- Check if result has changed since last time
---
function external.hasResultChanged(key, newResult, exclusions)
    local lastChecksum = external.lastChecksums[key]

    -- If no previous checksum exists, consider it changed
    if lastChecksum == nil then
        return true
    end

    -- Compare checksums with exclusions
    exclusions = exclusions or {}
    local newChecksum = external.generateChecksum(newResult, exclusions)
    return lastChecksum ~= newChecksum
end

---
--- Generate a simple checksum for any value
---
function external.generateChecksum(value, exclusions)
    exclusions = exclusions or {}
    return external.hashValue(value, 0, exclusions)
end

---
--- Hash a value recursively with exclusions support
---
function external.hashValue(value, hash, exclusions)
    local valueType = type(value)
    exclusions = exclusions or {}

    if valueType == "nil" then
        return external.hashString("nil", hash)
    elseif valueType == "boolean" then
        return external.hashString(tostring(value), hash)
    elseif valueType == "number" then
        return external.hashString(tostring(value), hash)
    elseif valueType == "string" then
        return external.hashString(value, hash)
    elseif valueType == "table" then
        -- Sort keys for consistent hashing
        local keys = {}
        for k in pairs(value) do
            table.insert(keys, k)
        end
        table.sort(keys, function(a, b)
            return tostring(a) < tostring(b)
        end)

        -- Hash each key-value pair, excluding specified properties
        for _, k in ipairs(keys) do
            if not external.isExcluded(k, exclusions) then
                hash = external.hashValue(k, hash, exclusions)
                hash = external.hashValue(value[k], hash, exclusions)
            end
        end
        return hash
    else
        -- For other types, just hash the type name
        return external.hashString(valueType, hash)
    end
end

---
--- Check if a property should be excluded from hashing
---
function external.isExcluded(property, exclusions)
    for _, excluded in ipairs(exclusions) do
        if property == excluded then
            return true
        end
    end
    return false
end

---
--- Simple string hashing function (djb2 algorithm)
---
function external.hashString(str, hash)
    hash = hash or 5381 -- djb2 initial value

    for i = 1, #str do
        local byte = string.byte(str, i)
        hash = ((hash * 33) + byte) % 4294967296
    end

    return hash
end

init()