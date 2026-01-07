-- Application state is refreshed every second.
-- Each widget is assigned to one or many of the groups limited by maxGroup value.
-- Group number means in what call it should be executed.
-- So eg. widget assigned to groups { 1, 2, 3 } will be executed every second.
-- But widget assigned to group { 3 } will be executed only every third second.

return {
    playerProfile = {
        path = "widgets.player_profile",
        groups = { 1, 2, 3 },
    },
    missionOffers = {
        path = "widgets.mission_offers",
        groups = { 1 },
    },
    activeMission = {
        path = "widgets.active_mission",
        groups = { 1 },
    },
    currentResearch = {
        path = "widgets.current_research",
        groups = { 1 },
    },
    factions = {
        path = "widgets.factions",
        groups = { 1 },
    },
    transactionLog = {
        path = "widgets.transaction_log",
        groups = { 2 },
    },
    logbook = {
        path = "widgets.logbook",
        groups = { 3 },
    },
    agents = {
        path = "widgets.agents",
        groups = { 1, 2, 3 },
    },
    inventory = {
        path = "widgets.inventory",
        groups = { 3 },
    },
}