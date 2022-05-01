export default class WidgetHeightWorker {

    constructor() {
    }

    /**
     * @returns {string}
     */
    run($refs, widget) {

        const element = widget.$el;
        const maxHeight = widget.maxHeight;

        if ($refs['widgets'].length > 0) {
            let screenBottomMargin = 10;
            let elementTopMargin = 20
            let resizableElement = element.getElementsByClassName('resizable-element')[0];
            let minResizableHeight = resizableElement.dataset.minResizableHeight ?? 0;

            let widgetsStartY = this.getObjectTop($refs['widgets'][0].$el) - elementTopMargin;

            let resizableOuterHeight = element.offsetHeight - resizableElement.offsetHeight;
            let availableScreenHeight = this.getWindowHeight() - screenBottomMargin;

            let maxAvailableHeight = (availableScreenHeight - widgetsStartY) * (maxHeight / 100) - resizableOuterHeight - elementTopMargin;

            let resizableElementY = this.getObjectTop(element);
            let finalHeight = availableScreenHeight - resizableElementY - resizableOuterHeight

            resizableElement.style.height = Math.max(
                minResizableHeight,
                Math.min(maxAvailableHeight, finalHeight)
            ) + 'px'
        }
    }

    /**
     *
     */
    clear() {
        let resizableElements = document.getElementsByClassName('resizable-element');
        resizableElements.forEach(element => element.style.height = 'auto');
    }

    /**
     * @param percent
     * @returns {number}
     */
    getWindowHeight(percent = 100) {
        let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return (percent * h) / 100;
    }

    /**
     * @param {object} object
     */
    getObjectTop(object) {
        let offsets = object.getBoundingClientRect();
        return offsets.top;
    }

}