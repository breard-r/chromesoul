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
    document.getElementById('reconnect').addEventListener('click', func, false);
};

Nsui.prototype.getWidgetByName = function(name) {
    var i, ret = null;

    for (i = this.tab_lst.length - 1; i >= 0; --i) {
	if (this.tab_lst[i].name === name) {
	    ret = this.tab_lst[i];
	    break ;
	}
    }

    return ret;
}

Nsui.prototype.registerTab = function(tab) {
    this.tab_lst.push(tab);
};

Nsui.prototype.unRegisterTab = function(tab) {
    this.tab_lst = this.tab_lst.filter(function(element, index, array) {
	return tab.name !== element.name;
    });
};

Nsui.prototype.init = function() {
    var sh = function(elem) {
	return function() {
	    for (var i = elem.tab_lst.length - 1; i >= 0; --i) {
		elem.tab_lst[i].hide();
	    }
	    this.classList.add('tab-current');
	    document.getElementById('configuration').style.display = 'block';
	};
    };

    document.getElementById('tab-config').addEventListener('click', sh(this), false);

    /*
    var i, t, tabs = ['guitto_f', 'cadore_s', 'baud_c', 'bastie_j'], onTabDelete = function(elem) {
	return function(tab) {
	    var n = tab.getNextTabName(), t = elem.getWidgetByName(tab.name);

	    if (t !== null) {
		elem.unRegisterTab(t);
	    }
	    if (n !== null) {
		n = elem.getWidgetByName(n);
		if (n !== null) {
		    n.show();
		}
	    } else {
		    document.getElementById('configuration').style.display = 'block';
	    }
	};
    };

    for (i = 0; i < tabs.length; i++) {
	t = new Tab(tabs[i]);
	this.registerTab(t);
	t.registerCloseHandler(onTabDelete(this));
	t.appendText(tabs[i] + ': Salut Rodolphe !');
	t.appendText(tabs[i] + ': Ça va ?');
    }
    */
};
