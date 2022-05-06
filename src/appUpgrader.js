import GlobalStore from "./globalStore";

export default class AppUpgrader {

    /**
     * Upgrade localstorage from version 2.0.0
     */
    static upgradeFromV200() {
        // remove unused key
        if (localStorage.getItem("appProfile") !== null) {
            localStorage.removeItem('appProfile');
        }

        // convert layout object to a new format
        let newLayout = [];
        let existingLayout = GlobalStore.state.layout;

        if (existingLayout.columns[0].widgets[0].hasOwnProperty('widgetName')) {
            // old layput detected - convert it
            newLayout = {
                limitHeight: existingLayout.limitHeight,
                showBreadCrumb: existingLayout.showBreadCrumb || true,
                columns: [],
            }
            existingLayout.columns.forEach((column, columnIndex) => {
                newLayout.columns[columnIndex] = {
                    width: column.width,
                    widgets: [],
                };
                column.widgets.forEach((widget, widgetIndex) => {
                    console.log(columnIndex, widgetIndex)
                    newLayout.columns[columnIndex].widgets[widgetIndex] = {
                        component: widget.componentName.replace(/-./g, x => x[1].toUpperCase()), // change from kebab-case to camelCase
                        maxHeight: widget.maxHeight,
                    }
                })
            })
            GlobalStore.commit('updateLayout', newLayout)
        }
    }
}
