// ==UserScript==
// @name           Zimbra webclient improvement: hide folder column inside folder
// @namespace      http://thomas-rosenau.de
// @description    When browsing mails, hide the "folder" column when the list view shows a single folder's contents only
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

    var cssTpl = '#zl__TV-main td:nth-child({{index}}), #zl__TV-main div:nth-child({{index}}) {display: none;}';

    // hide coumn
    var hide = function (column) {
        var index = [].slice.call(column.parentNode.childNodes).indexOf(column);
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = cssTpl.replace(/\{\{index}}/g, index + 1);
        document.head.appendChild(style);
        };

    // poll for load
    var id = window.setInterval(function poll() {
        var column = document.querySelector('#zl__TV-main .ZmMsgListColFolder');
        if (column) {
            hide(column);
            window.clearInterval(id);
        }
    }, 100);

})();
