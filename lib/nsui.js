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
};

Nsui.prototype.scroll_down = function(elem) {
    var logs = document.getElementsByClassName('chat-log');
    for (var i = logs.length - 1; i >= 0; --i) {
	logs[i].scrollTop = 42000;
    }
};

Nsui.prototype.set_current = function(tab_name) {
    var tabs = document.getElementById('tab-lst').children;
    for (var i = tabs.length - 1; i >= 0; --i) {
	if (tabs[i].innerHTML === tab_name) {
	    tabs[i].classList.remove('tab-active');
	    tabs[i].classList.add('tab-current');
	} else {
	    tabs[i].classList.remove('tab-current');
	}
    }
};

Nsui.prototype.show_tab = function(tab_name) {
    var tabs = document.getElementById('tab-body-wrapper').children;
    for (var i = tabs.length - 1; i >= 0; --i) {
	tabs[i].style.display = 'none';
    }
    document.getElementById(tab_name).style.display = 'block';
    this.set_current(tab_name);
    this.scroll_down();
};

Nsui.prototype.init = function() {
    var tab_body, tab_lst = document.getElementById('tab-lst').children;

    this.show_tab('configuration');
    for (var i = tab_lst.length - 1; i >= 0; --i) {
	tab_body = document.getElementById(tab_lst[i].innerHTML);
	tab_lst[i].addEventListener('click', function() {
	    show_tab(this.innerHTML);
	}, false);
    }
};

Nsui.prototype.setReconnect = function(func) {
    document.getElementById('reconnect').addEventListener('click', func, false);
};
