// ==UserScript==
// @name           Zimbra webclient improvement: More space!
// @namespace      http://thomas-rosenau.de
// @description    Removes titlebar and the "Tag" and "Search" shortcuts
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

    var removeSeachAndTags = function () {
        var removeIds = [
            'main_Mail-parent-SEARCH',
            'main_Mail-parent-TAG',
            'main_Contacts-parent-SEARCH',
            'main_Contacts-parent-TAG',
            'main_Calendar-parent-SEARCH',
            'main_Calendar-parent-TAG',
            'main_Tasks-parent-SEARCH',
            'main_Tasks-parent-TAG'
        ];

        var style = document.createElement('style');
        style.type = 'text/css';
        var content = '';
        removeIds.forEach(function (id) {
            content += '#' + id + '{display:none;}';
        });
        style.innerHTML = content;
        document.head.appendChild(style);
    };

    var moveSeachBar = function () {
        var td = document.createElement('td');
        td.id = 'sbsearch';
        td.style.paddingRight = '10px';
        td.appendChild(document.getElementById('skin_container_search'));
        var div = document.createElement('div');
        div.className = 'divider';
        td.appendChild(div);
        var btnEl = document.getElementById('skin_spacing_global_buttons');
        btnEl.parentNode.insertBefore(td, btnEl);
    };

    var triggerResize = function () {
        var t = DwtControl.fromElementId(window._dwtShellId);
        var e = DwtShell.controlEvent;
        e.reset();
        e.oldWidth = t._currWinSize.x;
        e.oldHeight = t._currWinSize.y;
        t.notifyListeners(DwtEvent.CONTROL, e)
    };

    var moveUser = function () {
        var td = document.createElement('td');
        td.appendChild(document.getElementById('skin_userAndQuota'));
        td.appendChild(document.getElementById('skin_dropMenu'));
        var btnEl = document.getElementById('skin_spacing_global_buttons');
        btnEl.parentNode.insertBefore(td, btnEl);
    };

    removeSeachAndTags();

    var intervalId = window.setInterval(function () {
        var toolbar = document.querySelector('#skin_spacing_top_row tr');
        if (!toolbar) {
            return;
        }
        window.clearInterval(intervalId);
        moveSeachBar();
        moveUser();
        toolbar.parentNode.removeChild(toolbar);
        triggerResize();
    });

})();
