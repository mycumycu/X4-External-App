export default class Helper {
    static disableContextMenu () {
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    }

    static formatTime (seconds) {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    }

}


