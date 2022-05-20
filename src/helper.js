export default class Helper {
    static disableContextMenu(){
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    }
}


