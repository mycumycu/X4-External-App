local ffi = require("ffi")
local C = ffi.C

local output = {}

function output.handle()
    local playersector = C.GetContextByClass(C.GetPlayerID(), "sector", false)
    local sectorownerFaction = GetComponentData(ConvertStringTo64Bit(tostring(playersector)), "owner");
    local data = {
        name = ffi.string(C.GetPlayerName());
        factionname = ffi.string(C.GetPlayerFactionName(true));
        credits = GetPlayerMoney();
        sectorname = ffi.string(C.GetComponentName(playersector));
        sectorowner = GetFactionData(sectorownerFaction, "shortname")
    }

    return data;
end

return output