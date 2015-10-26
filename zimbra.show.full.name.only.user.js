// ==UserScript==
// @name        Zimbra webclient improvement: Show Full Name and Full Name only
// @namespace   http://thomas-rosenau.de
// @description Hide company name when showing mail senders and receipients
// @include     INSERT.URL.HERE
// @version     1
// @grant       none
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
    AjxDispatcher.addPackageLoadFunction('ContactsCore', function () {
        ZmContact.prototype.getFullName = function (html) {
            var fullNameHtml = null;
            if (!this._fullName || html) {
                var fullName = this.getAttr(ZmContact.X_fullName); // present if GAL contact
                //if (fullName) {
                if (false) {
                    this._fullName = (fullName instanceof Array) ? fullName[0] : fullName;
                } else {
                    this._fullName = this.getFullNameForDisplay(false);
                }

                if (html) {
                    fullNameHtml = this.getFullNameForDisplay(html);
                }
            }

            // as a last resort, set it to fileAs
            if (!this._fullName) {
                this._fullName = this.getFileAs();
            }

            return fullNameHtml || this._fullName;
        };
    });
});
