/*
    Define available widgets
    key: {
        widgetName: human friendly name
        componentName: component name
        gameDataKey: data key from gameData object (returned from LUA)
    }
 */
export default {
    playerProfile: {
        widgetName: 'Player profile',
        componentName: 'player-profile',
        gameDataKey: 'player',
    },
    activeMission: {
        widgetName: 'Active mission',
        componentName: 'active-mission',
        gameDataKey: 'activeMissions',
    },
    missionOffers: {
        widgetName: 'Mission offers',
        componentName: 'mission-offers',
        gameDataKey: 'missionOffers',
    },
    logbook: {
        widgetName: 'Logbook',
        componentName: 'logbook',
        gameDataKey: 'logbook',
    },
}