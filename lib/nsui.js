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
    this.focus = false;
};

Nsui.prototype.setReconnect = function(func) {
    document.getElementById("user-status").addEventListener("click", func, false);
};

Nsui.prototype.onUserStatusChange = function(new_status) {
    var el = document.getElementById("user-status-img");

    if (el !== null) {
	if (new_status !== "disconnected") {
	    el.src = 'img/status/me-connected.png';
	} else {
	    el.src = 'img/status/me-disconnected.png';
	}
	el.alt = new_status;
	el.title = new_status;
    }
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
    }
};

Nsui.prototype.hideAllTabs = function() {
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
    if (this.tab_lst.length <= 1) {
	tab.show();
    } else if (!tab.isCurrent()) {
	tab.setActive();
    }

    return tab;
};

Nsui.prototype.addContentToTab = function(tab_name, content) {
    var tab = null;

    if ($cs.opts.get("enable_msg")) {
	tab = this.addNewTab(tab_name);
	tab.appendMessage(content);

	if (!this.focus && typeof content.login !== "undefined" && content.login !== null && $cs.opts.get("enable_notif")) {
	    $cs.avatars.get(content.login, function(url) {
		var notif = webkitNotifications.createNotification(
		    url,
		    content.login,
		    content.message.substr(0, 24)
		);
		notif.onclick = function() {
		    window.focus();
		    this.cancel();
		};
		notif.show();
		setTimeout(function() {
		    notif.cancel();
		}, 5000);
	    });
	}
    }
};

Nsui.prototype.formatInteger = function(num, len) {
    num = "" + num;
    while (num.length < len) {
        num = "0" + num;
    }

    return num;
};

Nsui.prototype.formatMessage = function(msg) {
    var dt = new Date(), fmt = "";

    fmt += '<span class="chat-timestamp">' + this.formatInteger(dt.getHours(), 2) + ':' + this.formatInteger(dt.getMinutes(), 2) + ':' + this.formatInteger(dt.getSeconds(), 2) + '</span><div class="chat-message-body">';

    if (typeof msg.login !== "undefined" && msg.login !== null) {
	fmt += '<span class="spk-oth">' + msg.login + ': </span>';
    } else {
	fmt += '<span class="spk-me">' + document.getElementById('login').value + ': </span>';
    }

    fmt += this.sanitizeText(msg.message) + '</div>';

    return fmt;
};

Nsui.prototype.sanitizeText = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

Nsui.prototype.showContent = function(part_id) {
    var i, ctn_lst = ["config-pannel", "chat-pannel", "pre-conf-pannel"];

    for (i = ctn_lst.length - 1; i>= 0; --i) {
	if (ctn_lst[i] === part_id) {
	    document.getElementById(ctn_lst[i]).style.display = "block";
	} else {
	    document.getElementById(ctn_lst[i]).style.display = "none";
	}
    }
};

Nsui.prototype.switchContent = function(part_id, part_id_to) {
    if (document.getElementById(part_id).style.display !== "block") {
	this.showContent(part_id);
    } else {
	this.showContent(part_id_to);
    }
}

Nsui.prototype.init = function() {
    window.onfocus = (function(elem) {
	return function() {
	    elem.focus = true;
	};
    })(this);
    window.onblur = (function(elem) {
	return function() {
	    elem.focus = false;
	};
    })(this);

    document.getElementById("settings-btn").addEventListener("click", (function(elem) {
	return function() {
	    elem.switchContent("config-pannel", "chat-pannel");
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

    this.showContent("chat-pannel");
    setTimeout(function() {
	if ($cs.opts.get("login") === null || $cs.opts.get("pwd_socks") === null) {
	    $cs.ui.showContent("pre-conf-pannel");
	}
    }, 600);
};
