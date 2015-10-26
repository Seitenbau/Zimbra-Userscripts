// ==UserScript==
// @name           Zimbra webclient improvement: cleanup subject field
// @namespace      http://thomas-rosenau.de
// @description    Clean subject field from non-RFC German prefixes like "Aw:", "WG:" when replying
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

    // Zimbra can handle this internally, just needs a little help with the German language
    var id = setInterval(function () {
        if (window.ZmMailMsg && ZmMailMsg.SUBJ_PREFIX_RE) {
            ZmMailMsg.SUBJ_PREFIX_RE = /^\s*(Re|Fwd?|AW|WG|Antwort|Re\[\d+\]):\s*/gi;
            clearInterval(id);
        }
    }, 100);

})();
