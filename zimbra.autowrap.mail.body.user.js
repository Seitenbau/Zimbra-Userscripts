// ==UserScript==
// @name           Zimbra webclient improvement: wrap plain text mails automatically
// @namespace      http://thomas-rosenau.de
// @description    Add a button to the “new mail” area that toggles a basic auto-wrap. Note that the implementation is not very sophisticated, so there are limitations when you insert or remove words in the middle of the text.
// @include        INSERT.URL.HERE
// @version        4
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

    // config
    var whitelist = /^(>|\||http)/; // lines that shall not be wrapped
    var maxLength = 72;


    // poll for mail area field
    var searchAreas = function () {
        var areas = document.querySelectorAll('textarea.ZmHtmlEditorTextArea');
        areas = [].slice.call(areas);
        areas.forEach(function (area) {
            if (area._pimped) {
                return;
            }
            pimpArea(area);
        });
    };

    // pimp one given text area to add autowrap
    var pimpArea = function (area) {
        area._pimped = true;
        area._active = true;
        // do the actual wrapping
        var doWrap = function (e) {
            if (!area._active) {
                return;
            }
            var text = area.value.split('\n');
            var result = [];
            var found = false;
            text.forEach(function (line) {
                do {
                    var splitIndex = getSplitIndex(line);
                    if (splitIndex > 0) {
                        found = true;
                        result.push(line.substr(0, splitIndex));
                        line = line.substr(splitIndex).replace(/^ +/, '');
                    } else {
                        result.push(line);
                        break;
                    }
                } while (line.length);
            });
            if (found) {
                var start = area.selectionStart;
                var end = area.selectionEnd;
                area.value = result.join('\n');
                area.setSelectionRange(start, end);
            }
        };
        // wrap on keyUp
        area.addEventListener('keyup', doWrap, false);
        // add toggle button
        var button = document.createElement('button');
        button.innerHTML = 'wrap@' + maxLength;
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.right = '0';
        button.style.marginRight = '4px';
        button.style.marginTop = '4px';
        button.style.borderStyle = 'inset';
        button.addEventListener('click', function(e) {
            area._active = !area._active;
            button.style.borderStyle = area._active ? 'inset' : '';
            if (area._active) {
                doWrap();
            }
        }, false);
        area.parentNode.appendChild(button);
    };

    // helper, determines the wrapping position of one line
    var getSplitIndex = function (line) {
        if (line.length <= maxLength || whitelist.test(line)) {
            return -1;
        }
        var unindentedLine = line.replace(/^ +/, '');
        if (unindentedLine.indexOf(' ') == -1) {
            return -1;
        }
        var trimmedLine = line.substr(0, maxLength + 1);
        var unindentedTrimmedLine = trimmedLine.replace(/^ +/, '');
        var indentation = trimmedLine.length - unindentedTrimmedLine.length;
        if (unindentedTrimmedLine.indexOf(' ') == -1) {
            return unindentedLine.indexOf(' ') + indentation;
        }
        return unindentedTrimmedLine.lastIndexOf(' ') + indentation;
    };

    // inject CSS
    var createStyles = function () {
        var getTextWidth = function (length) {
            var div = document.createElement('div');
            div.className = 'ZmHtmlEditor';
            div.innerHTML = '<div class="ZmHtmlEditorTextArea">' + new Array(length + 1).join('X') + '</div>';
            div.style.position = 'fixed';
            div.style.top = '-1000em';
            div.style.padding = '0';
            div.style.border = '0';
            div.style.margin = '0';
            div2 = div.firstChild;
            div2.style.padding = '0';
            div2.style.border = '0';
            div2.style.margin = '0';
            document.body.appendChild(div);
            var result = getComputedStyle(div).width;
            document.body.removeChild(div);
            return result;
        };
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML =
            '.ZmHtmlEditor::before {' +
                'color: #ddd;' +
                'display: block;' +
                'width: 100%;' +
                'height: 100%;' +
                'position: absolute;' +
                'border-left: 1px dashed #ddd;' +
                'margin-top: 4px;' +
                'margin-left: 4.5px;' +
                'pointer-events: none;' +
                '/*text-indent: -6px;*/' +
                'background: rgba(0, 0, 0, .01);' +
                'top: 0;' +
                'left: ' + getTextWidth(maxLength) + ';' +
                'content: "' + maxLength +'";' +
            '}' +
            '.ZmHtmlEditor {' +
                'position: relative !important;' +
            '}' +
            '.ZmHtmlEditor > .mceEditor {' +
                'position: relative;' +
                'z-index: 1;' +
            '}';
        document.head.appendChild(style);
    };

    // main
    createStyles();
    window.setInterval(searchAreas, 100);
})();
