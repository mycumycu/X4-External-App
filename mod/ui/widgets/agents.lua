local ffi = require("ffi")
local C = ffi.C

-- FFI setup for diplomacy data (copied from original diplomacy menu)
ffi.cdef[[
	typedef uint64_t OperationID;
		typedef struct {
			const char* id;
			const char* category;
			const char* paramtype;
			const char* name;
			const char* desc;
			const char* shortdesc;
			const char* iconid;
			const char* imageid;
			const char* rewardtext;
			const char* successtext;
			const char* failuretext;
			const char* agenttype;
			const char* agentexpname;
			const char* agentrisk;
			const char* giftwaretags;
			double duration;
			double cooldown;
			int32_t agentexp;
			int32_t successchance;
			int64_t price;
			int32_t influencerequirement;
			uint32_t exclusivefactionparamidx;
			uint32_t warecostscaleparamidx;
			uint32_t targetobjectparamidx;
			uint32_t numwarerequirements;
			bool unique;
			bool hidden;
			bool eventtrigger;
		} DiplomacyActionInfo;
	typedef struct {
		OperationID id;
		const char* actionid;
		UniverseID agentid;
		const char* agentname;
		const char* agentimageid;
		const char* agentresultstate;
		int32_t agentexp_negotiation;
		int32_t agentexp_espionage;
		const char* giftwareid;
		double starttime;
		double endtime;
		bool read;
		bool successful;
	} DiplomacyActionOperation;
	typedef struct {
		const char* rankname;
		const char* rankiconid;
		const char* exp_negotiation_name;
		const char* exp_espionage_name;
	} DiplomacyAgentAttributeData;
	typedef struct {
		const char* id;
		const char* name;
		const char* desc;
		const char* shortdesc;
		const char* iconid;
		const char* imageid;
		double duration;
		uint32_t numoptions;
	} DiplomacyEventInfo;
	typedef struct {
		OperationID id;
		OperationID sourceactionoperationid;
		const char* eventid;
		UniverseID agentid;
		const char* agentname;
		const char* agentimageid;
		const char* agentresultstate;
		int32_t agentexp_negotiation;
		int32_t agentexp_espionage;
		const char* faction;
		const char* otherfaction;
		const char* option;
		const char* outcome;
		double starttime;
		bool read;
		int32_t startrelation;
	} DiplomacyEventOperation;
	typedef struct {
		const char* id;
		const char* name;
		const char* desc;
		const char* result;
		const char* conclusion;
		const char* agentrisk;
		int32_t successchance;
		float relationchange;
		int64_t price;
		int32_t influencerequirement;
		int32_t menuposition;
		uint32_t numwarerequirements;
	} DiplomacyEventOptionInfo;

	uint32_t GetNumDiplomacyAgents();
	uint32_t GetDiplomacyAgents(UniverseID* result, uint32_t resultlen);
	DiplomacyAgentAttributeData GetDiplomacyAgentAttributeData(int32_t exp_negotiation, int32_t exp_espionage);
	UniverseID GetAgentDiplomacyShip(UniverseID npcid);
	const char* GetAgentOriginalOwner(UniverseID npcid);

	uint32_t GetNumDiplomacyActions();
	uint32_t GetDiplomacyActions(DiplomacyActionInfo* result, uint32_t resultlen);
	uint32_t GetNumDiplomacyActionOperations(bool active);
	uint32_t GetDiplomacyActionOperations(DiplomacyActionOperation* result, uint32_t resultlen, bool active);

	uint32_t GetNumDiplomacyEvents();
	uint32_t GetDiplomacyEvents(DiplomacyEventInfo* result, uint32_t resultlen);
	uint32_t GetDiplomacyEventOptions(DiplomacyEventOptionInfo* result, uint32_t resultlen, const char* eventid);
	uint32_t GetNumDiplomacyEventOperations(bool active);
	uint32_t GetDiplomacyEventOperations(DiplomacyEventOperation* result, uint32_t resultlen, bool active);
	int32_t GetDiplomacyEventOptionChance(OperationID eventoperationid, const char* optionid, const char* selectedoptionid);

	double GetCurrentGameTime(void);
]]

local output = {
    -- Exclude dynamic time fields from hash; external app can compute time left using endTime and global time
    hashExclusions = { "timeLeftSeconds", "timeLeftText" }
}

local function getSuccessText(successChance)
    if successChance == 0 then
        return ReadText(1001, 12865)
    elseif successChance <= 33 then
        return ReadText(1001, 12866)
    elseif successChance <= 66 then
        return ReadText(1001, 12867)
    elseif successChance <= 99 then
        return ReadText(1001, 12868)
    else
        return ReadText(1001, 12869)
    end
end

local function buildActionsById()
    local actionsById = {}
    local count = C.GetNumDiplomacyActions()

    if count > 0 then
        local buffer = ffi.new("DiplomacyActionInfo[?]", count)
        count = C.GetDiplomacyActions(buffer, count)

        for index = 0, count - 1 do
            local id = ffi.string(buffer[index].id)
            local paramType = ffi.string(buffer[index].paramtype)

            actionsById[id] = {
                id = id,
                name = ffi.string(buffer[index].name),
                rewardText = ffi.string(buffer[index].rewardtext),
                agentRisk = ffi.string(buffer[index].agentrisk),
                successChance = buffer[index].successchance,
                paramType = paramType,
                targetObjectParamIndex = buffer[index].targetobjectparamidx,
            }
        end
    end

    return actionsById
end

local function buildActionOperationsByAgent()
    local operationsByAgent = {}
    local count = C.GetNumDiplomacyActionOperations(true)

    if count > 0 then
        local buffer = ffi.new("DiplomacyActionOperation[?]", count)
        count = C.GetDiplomacyActionOperations(buffer, count, true)

        for index = 0, count - 1 do
            local agentId = buffer[index].agentid
            local agentKey = tostring(agentId)
            operationsByAgent[agentKey] = {
                id = buffer[index].id,
                actionId = ffi.string(buffer[index].actionid),
                agentId = agentId,
                startTime = buffer[index].starttime,
                endTime = buffer[index].endtime,
            }
        end
    end

    return operationsByAgent
end

local function buildEventsById()
    local eventsById = {}
    local count = C.GetNumDiplomacyEvents()

    if count > 0 then
        local buffer = ffi.new("DiplomacyEventInfo[?]", count)
        count = C.GetDiplomacyEvents(buffer, count)

        for index = 0, count - 1 do
            local id = ffi.string(buffer[index].id)
            eventsById[id] = {
                id = id,
                name = ffi.string(buffer[index].name),
                duration = buffer[index].duration,
                numOptions = buffer[index].numoptions,
                options = {},
            }
        end
    end

    for _, event in pairs(eventsById) do
        if event.numOptions > 0 then
            local buffer = ffi.new("DiplomacyEventOptionInfo[?]", event.numOptions)
            local optionCount = C.GetDiplomacyEventOptions(buffer, event.numOptions, event.id)

            for index = 0, optionCount - 1 do
                table.insert(event.options, {
                    id = ffi.string(buffer[index].id),
                    name = ffi.string(buffer[index].name),
                    result = ffi.string(buffer[index].result),
                    agentRisk = ffi.string(buffer[index].agentrisk),
                })
            end
        end
    end

    return eventsById
end

local function buildEventOperationsByAgent(eventsById)
    local operationsByAgent = {}
    local count = C.GetNumDiplomacyEventOperations(true)

    if count > 0 then
        local buffer = ffi.new("DiplomacyEventOperation[?]", count)
        count = C.GetDiplomacyEventOperations(buffer, count, true)

        for index = 0, count - 1 do
            local eventId = ffi.string(buffer[index].eventid)
            local event = eventsById[eventId]

            if event then
                local agentId = buffer[index].agentid
                local agentKey = tostring(agentId)
                local startTime = buffer[index].starttime
                local endTime = startTime + event.duration

                operationsByAgent[agentKey] = {
                    id = buffer[index].id,
                    eventId = eventId,
                    agentId = agentId,
                    optionId = ffi.string(buffer[index].option),
                    startTime = startTime,
                    endTime = endTime,
                }
            end
        end
    end

    return operationsByAgent
end

local function attachActionMission(agentData, actionOperation, actionsById, currentGameTime)
    local action = actionsById[actionOperation.actionId]

    if not action then
        return
    end

    local target

    if GetDiplomaticActionTargetParameters and GetDiplomaticActionOperationParamValues then
        local actionDefinitionId = action.id or actionOperation.actionId
        local targets = GetDiplomaticActionTargetParameters(actionDefinitionId)

        if targets and action.targetObjectParamIndex and (action.targetObjectParamIndex > 0) then
            local targetEntry = targets[action.targetObjectParamIndex]

            if targetEntry and (targetEntry.type == "object") then
                local operationParameters = GetDiplomaticActionOperationParamValues(tonumber(actionOperation.id))

                if operationParameters then
                    local selectedTarget = operationParameters[targetEntry.name]

                    if selectedTarget then
                        if type(selectedTarget) ~= "string" then
                            local stationLuaId = ConvertStringToLuaID(tostring(selectedTarget))
                            target = GetComponentData(stationLuaId, "name")
                        else
                            target = selectedTarget
                        end
                    end
                end
            end
        end
    end

    local remainingSeconds = actionOperation.endTime - currentGameTime
    if remainingSeconds < 0 then
        remainingSeconds = 0
    end

    local timeFormat = (remainingSeconds < 3600) and ReadText(1001, 209) or ReadText(1001, 207)

    agentData.currentMission = {
        type = "action",
        name = action.name,
        likelihoodOfSuccess = getSuccessText(action.successChance),
        successChance = action.successChance,
        riskToAgent = action.agentRisk,
        rewards = action.rewardText,
        target = target,
        startTime = actionOperation.startTime,
        endTime = actionOperation.endTime,
        timeLeftSeconds = remainingSeconds,
        timeLeftText = ConvertTimeString(remainingSeconds, timeFormat),
    }
end

local function attachEventMission(agentData, eventOperation, eventsById, currentGameTime)
    local event = eventsById[eventOperation.eventId]

    if not event then
        return
    end

    local selectedOption

    if eventOperation.optionId ~= "" then
        for _, option in ipairs(event.options) do
            if option.id == eventOperation.optionId then
                selectedOption = option
                break
            end
        end
    end

    local missionName = event.name
    local missionRisk
    local missionRewards
    local successChance
    local successText

    if selectedOption then
        missionName = selectedOption.name
        missionRisk = selectedOption.agentRisk
        missionRewards = selectedOption.result

        local chance = C.GetDiplomacyEventOptionChance(eventOperation.id, selectedOption.id, selectedOption.id)
        successChance = chance
        successText = getSuccessText(chance)
    end

    local remainingSeconds = eventOperation.endTime - currentGameTime
    if remainingSeconds < 0 then
        remainingSeconds = 0
    end

    local timeFormat = (remainingSeconds < 3600) and ReadText(1001, 209) or ReadText(1001, 207)

    agentData.currentMission = {
        type = "event",
        name = missionName,
        likelihoodOfSuccess = successText,
        successChance = successChance,
        riskToAgent = missionRisk,
        rewards = missionRewards,
        startTime = eventOperation.startTime,
        endTime = eventOperation.endTime,
        timeLeftSeconds = remainingSeconds,
        timeLeftText = ConvertTimeString(remainingSeconds, timeFormat),
    }
end

function output.handle()
    local agentsData = {}

    local currentGameTime = C.GetCurrentGameTime()

    local actionsById = buildActionsById()
    local actionOperationsByAgent = buildActionOperationsByAgent()

    local eventsById = buildEventsById()
    local eventOperationsByAgent = buildEventOperationsByAgent(eventsById)

    local agentCount = C.GetNumDiplomacyAgents()

    if agentCount <= 0 then
        return agentsData
    end

    local agentBuffer = ffi.new("UniverseID[?]", agentCount)
    agentCount = C.GetDiplomacyAgents(agentBuffer, agentCount)

    for index = 0, agentCount - 1 do
        local agentId = agentBuffer[index]
        local agentLuaId = ConvertStringToLuaID(tostring(agentId))
        local agentKey = tostring(agentId)

        local expNegotiation = GetNPCBlackboard(agentLuaId, "$diplomacy_exp_negotiation") or 0
        local expEspionage = GetNPCBlackboard(agentLuaId, "$diplomacy_exp_espionage") or 0
        local attributes = C.GetDiplomacyAgentAttributeData(expNegotiation, expEspionage)

        local agentShipId = C.GetAgentDiplomacyShip(agentId)
        local shipName
        local shipPrestige

        if agentShipId ~= 0 then
            local shipLuaId = ConvertStringToLuaID(tostring(agentShipId))
            local componentName, _, _, prestigeName = GetComponentData(shipLuaId, "name", "icon", "idcode", "prestigename")
            shipName = componentName
            shipPrestige = prestigeName
        end

        local originFactionId = ffi.string(C.GetAgentOriginalOwner(agentId))
        local originFactionName = GetFactionData(originFactionId, "name")
        local originFactionNameShort = GetFactionData(originFactionId, "shortname")

        local isFemale = GetComponentData(agentLuaId, "isfemale")
        local agentIcon = GetComponentData(agentLuaId, "agenticon")

        local agentData = {
            id = agentId,
            name = ffi.string(C.GetComponentName(agentId)),
            rank = ffi.string(attributes.rankname),
            originFactionId = originFactionId,
            originFactionName = originFactionName,
            originFactionNameShort = originFactionNameShort,
            gender = isFemale and "female" or "male",
            icon = agentIcon,
            ship = {
                id = agentShipId,
                name = shipName,
                prestige = shipPrestige,
            },
            negotiationLevel = ffi.string(attributes.exp_negotiation_name),
            espionageLevel = ffi.string(attributes.exp_espionage_name),
        }

        local eventOperation = eventOperationsByAgent[agentKey]
        local actionOperation = actionOperationsByAgent[agentKey]

        if eventOperation then
            attachEventMission(agentData, eventOperation, eventsById, currentGameTime)
        elseif actionOperation then
            attachActionMission(agentData, actionOperation, actionsById, currentGameTime)
        end

        local agentOutput = {
            agent = {
                id = agentData.id,
                name = agentData.name,
                rank = agentData.rank,
                originFactionId = agentData.originFactionId,
                originFactionName = agentData.originFactionName,
                originFactionNameShort = agentData.originFactionNameShort,
                gender = agentData.gender,
                icon = agentData.icon,
                ship = agentData.ship,
                negotiationLevel = agentData.negotiationLevel,
                espionageLevel = agentData.espionageLevel,
            },
            currentMission = agentData.currentMission,
        }

        table.insert(agentsData, agentOutput)
    end

    return agentsData
end

return output

