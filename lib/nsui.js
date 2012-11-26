//
// Copyright (c) 2012 Rodolphe Breard
// 
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//

var Nsui = function() {
    this.tab_lst = [];
};

Nsui.prototype.setReconnect = function(func) {
    document.getElementById("reconnect").addEventListener("click", func, false);
};

Nsui.prototype.createTab = function(name) {
    var tab = new Tab(name);

    tab.hide();
    this.tab_lst.push(tab);
    return tab;
};

Nsui.prototype.deleteTab = function(tab) {
    var new_tab = this.getNextTab(tab.name);

    this.tab_lst = this.tab_lst.filter(function(element, index, array) {
	return tab.name !== element.name;
    });

    if (new_tab !== null) {
	new_tab.show();
    } else {
	document.getElementById("configuration").style.display = "block";
    }
};

Nsui.prototype.hideAllTabs = function() {
    document.getElementById("configuration").style.display = "none";
    for (i = this.tab_lst.length - 1; i >= 0; --i) {
	this.tab_lst[i].hide();
    }
};

Nsui.prototype.getTabByName = function(name) {
    var i, ret = null;

    for (i = this.tab_lst.length - 1; i >= 0; --i) {
	if (this.tab_lst[i].name === name) {
	    ret = this.tab_lst[i];
	    break ;
	}
    }

    return ret;
}

Nsui.prototype.getNextTab = function(current_name) {
    var i, prev = null;

    for (i = this.tab_lst.length - 1; i >= 0; --i) {
	if (this.tab_lst[i].name === current_name) {
	    if (prev === null && typeof this.tab_lst[i - 1] !== "undefined") {
		prev = this.tab_lst[i - 1];
	    }
	    break ;
	}
	prev = this.tab_lst[i];
    }

    return prev;
}

Nsui.prototype.addNewTab = function(tab_name) {
    var tab = this.getTabByName(tab_name);

    if (tab === null) {
	tab = this.createTab(tab_name);
    }
    if (!tab.isCurrent()) {
	tab.setActive();
    }

    return tab;
};

Nsui.prototype.addContentToTab = function(tab_name, content) {
    var tab = this.addNewTab(tab_name);
    tab.appendText(this.formatMessage(content));
};

Nsui.prototype.formatMessage = function(msg) {
    var fmt = "";

    if (typeof msg.login !== "undefined" && msg.login !== null) {
	fmt += '<span class="spk-oth">' + msg.login + ': </span>';
    } else {
	fmt += '<span class="spk-me">' + document.getElementById('login').value + ': </span>';
    }

    msg.message = msg.message.replace("<", "&lt;");
    msg.message = msg.message.replace(">", "&gt;");
    fmt += msg.message;

    fmt += '<br>';

    return fmt;
};

Nsui.prototype.init = function() {
    document.getElementById("tab-config").addEventListener("click", (function(elem) {
	return function() {
            for (var i = elem.tab_lst.length - 1; i >= 0; --i) {
		elem.tab_lst[i].hide();
            }
            this.classList.add("tab-current");
            document.getElementById("configuration").style.display = "block";
	};
    })(this), false);

    Tab.prototype.closeHandler = (function(elem) {
        return function() {
            elem.deleteTab(this);
        };
    })(this);

    Tab.prototype.showHandler = (function(elem) {
        return function() {
	    elem.hideAllTabs();
        };
    })(this);

    if (typeof $cs.client !== "undefined") {
	NsClient.prototype.msgHandler = (function(elem) {
	    return function(msg) {
		elem.addContentToTab(msg.login, msg);
	    };
	})(this);
    }
};
