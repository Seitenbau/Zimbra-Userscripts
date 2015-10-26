// ==UserScript==
// @name           Zimbra webclient improvement: Context menu fix for Firefox
// @namespace      http://thomas-rosenau.de
// @description    Certain Add-ons like All-in-One-Gestures cause Zimbra's contextmenu to break. This user script should fix that. Do not install if your context menu works.
// @include        INSERT.URL.HERE
// @version        2
// ==/UserScript==


(function (main) {
    if (window == window.top && !document.querySelector('.LoginScreen')) {
        // http://stackoverflow.com/a/5006952/27862
        var script = document.createElement('script');
        script.textContent = 'try{(' + main + ')();}catch(e){console.log(e);}';
        document.body.appendChild(script).parentNode.removeChild(script);
    }
})(function () {

    var contextmenuHandler = function (evt) {
        //console.log('contextmenu', arguments, evt._handled);
        if (evt._handled) {
            return;
        }
        evt._handled = true;
        ['mousedown', 'mouseup'].forEach(function (type) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent(type, evt.bubbles, evt.cancelable, evt.view, evt.detail, evt.screenX, evt.screenY, evt.clientX, evt.clientY, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, evt.button, evt.relatedTarget);
            evt.target.dispatchEvent(event);
        });
    };

    document.body.addEventListener('contextmenu', contextmenuHandler, false);
    DwtControl.__HANDLER[DwtEvent.ONCONTEXTMENU] = DwtControl.__contextMenuHdlr = contextmenuHandler;

})();
