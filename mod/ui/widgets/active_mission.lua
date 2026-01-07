local output = {}

function output.handle()
    local data = {}
    local mapMenu = Helper.getMenu("MapMenu")
    local missionBriefingMenu = Helper.getMenu("MissionBriefingMenu")

    local numMissions = GetNumMissions()

    for i = 1, numMissions do
        local entry = mapMenu.getMissionInfoHelper(i)

        if entry.active then
            local missionDetails = missionBriefingMenu.getMissionIDInfoHelper(ConvertIDTo64Bit(entry.ID))
            missionDetails.deliveryWares = nil
            missionDetails.briefingmissions = nil
            table.insert(data, missionDetails)
            break
        end
    end

    return data
end

return output