// ==UserScript==
// @name           Zimbra webclient improvement: Auto Show Full Mail
// @namespace      http://thomas-rosenau.de
// @description    Always show full mail in Zimbra web client, never fragmentize (Prevent message “This message is too large to display properly”)
// @include        INSERT.URL.HERE
// @version        2
// ==/UserScript==

/*!
Copyright 2015 SEITENBAU GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
