// ==UserScript==
// @name           Zimbra webclient improvement: Auto Show Full Mail
// @namespace      http://thomas-rosenau.de
// @description    Always show full mail in Zimbra web client, never fragmentize (Prevent message “This message is too large to display properly”)
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

    // define callback function
    var cb = function () {
        appCtxt.set(ZmSetting.MAX_MESSAGE_SIZE, -1>>>1);
    };
    // wait for mail package to be loaded
    AjxDispatcher.addPackageLoadFunction('MailCore', new AjxCallback(cb));

})();
