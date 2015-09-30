// ==UserScript==
// @name        Zimbra webclient improvement: Sender addresses
// @namespace   http://thomas-rosenau.de
// @description Add a context menu entry to folders that provides a list of all mail sender addresses from that folder
// @include     INSERT.URL.HERE
// @version     1
// @grant       none
// ==/UserScript==


(function (main) {
    if (window == window.top && !document.querySelector('.LoginScreen')) {
        // http://stackoverflow.com/a/5006952/27862
        var script = document.createElement('script');
        script.textContent = 'try{(' + main + ')();}catch(e){console.log(e);}';
        document.body.appendChild(script).parentNode.removeChild(script);
    }
})(function () {


    var pagesize = 1000; // server-side limit == 1000

    var zimbraOpKey = 'SOME_UID' + +new Date();

    // i18n
    ZmMsg.showSenderAddresses = 'List sender addresses';

    // register export operation
    ZmOperation.registerOp(zimbraOpKey, {
        textKey: 'showSenderAddresses',
        image: 'DuplicateCOS' // well, the icon is appropriate
    });

    // add export operation to tree context menu
    ZmFolderTreeController.prototype._getActionMenuOps = (function (original) {
        var actionMenuOps = null;
        return function () {
            if (!actionMenuOps) {
                actionMenuOps = original();
                actionMenuOps.push(zimbraOpKey);

                // we also register the operation listener here, since it's too late to modify the constructor function
                this._listeners[zimbraOpKey] = (function (evt) {
                    var searchTerm = this._getActionedOrganizer(evt).createQuery();
                    runSearch(searchTerm, function (addresses) {
                        display(addresses.join(','), 'Sender addresses from ' + searchTerm.replace(/^[^:]+:/, ''));
                    });
                }).bind(this);
            }
            return actionMenuOps;
        };
    })(ZmFolderTreeController.prototype._getActionMenuOps);

    // do not hide context menu entry in system folders
    ZmFolderTreeController.prototype.resetOperations = (function (original) {
        return function (parent, type, id) {
            original.apply(this, arguments);
            parent.enable(zimbraOpKey, true);
        };
    })(ZmFolderTreeController.prototype.resetOperations);


    // search emails in folder
    // @param {string} searchTerm
    // @param {function} callback
    var runSearch = function (searchTerm, callback) {
        var page = 0;
        var addresses = [];

        // internal callback for search
        // @param {ZmCsfeResult} result
        var cb = function (result) {
            var response = result.getResponse();
            response.getResults().getVector().foreach(function (msg) {
                var sender = msg.getMsgSender(); // 'foo@bar.baz'
                // var sender = msg.getAddress(AjxEmailAddress.FROM).toString(); // '"John Doe" <foo@bar.baz>'
                if (sender && addresses.indexOf(sender) < 0) {
                    addresses.push(sender);
                }
            });
            if (response.getAttribute('more')) {
                // paginate
                page++;
                request(cb);
            } else {
                // pagination done
                callback(addresses);
            }
        };

        // do search request
        var request = function (callback) {
            if (!callback.isAjxCallback) {
                callback = new AjxCallback(callback);
            }
            appCtxt.getSearchController().search(new ZmSearch({
                searchFor: ZmId.SEARCH_MAIL,
                query: searchTerm,
                offset: page * pagesize,
                limit: pagesize,
                callback: callback,
                noRender: true,
                noUpdateOverview: true,
                skipUpdateSearchToolbar: true
            }));
        };

        request(cb);
    };

    // display a string in a dialog box
    // @param {String} str
    // @param {String} title
    var display = function (str, title) {
        var dialog = new DwtDialog({
            parent: appCtxt.getShell(),
            title: title,
            standardButtons: [DwtDialog.DISMISS_BUTTON]
        });
        dialog.setContent('<textarea cols="60" rows="10">' + str + '</textarea>');
        var area = dialog._getContentDiv().firstChild;
        area.addEventListener('focus', function () {
            area.select();
        }, false);
        dialog.popup();
        area.focus();
    };
});

