// ==UserScript==
// @name           Zimbra webclient improvement: hide folder column inside folder
// @namespace      http://thomas-rosenau.de
// @description    When browsing mails, hide the "folder" column when the list view shows a single folder's contents only
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
