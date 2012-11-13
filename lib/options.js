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

var OptionsManager = function() {
    this.storage = chrome.storage.sync;
    this.status = null;
    this.save_btn = null;
    this.opts = null;
};

OptionsManager.prototype.init = function() {
    var saveOpts = function(elem) {
	return function() {
	    elem.save();
	};
    };

    this.status = document.getElementById("status");
    this.save_btn = document.getElementById("save");
    this.opts = document.getElementsByClassName("opt");

    this.restore();

    if (this.save !== null) {
	this.save_btn.addEventListener("click", saveOpts(this));
    }
};

OptionsManager.prototype.save = function() {
    var i = 0,
    data = {},
    notif = function(elem) {
	return function () {
	    if (elem !== null) {
		elem.innerHTML = "Options saved.";
		setTimeout(function() {
		    elem.innerHTML = "";
		}, 3000);
	    }
	};
    };

    if (this.opts !== null) {
	for (i = this.opts.length - 1; i >= 0; --i) {
	    data[this.opts[i].id] = this.encrypt(this.opts[i].value);
	}
	this.storage.set(data, notif(this.status));
    }
};

OptionsManager.prototype.restore = function() {
    var i,
    el,
    rst = function(elem) {
	return function(items) {
	    for (i in items) {
		el = document.getElementById(i);
		if (el !== null) {
		    el.value = elem.decrypt(items[i]);
		}
	    }
	};
    };

    this.storage.get(null, rst(this));
};

OptionsManager.prototype.encrypt = function(value) {
    return value;
};

OptionsManager.prototype.decrypt = function(value) {
    return value;
};

var opt_mgr = new OptionsManager();
opt_mgr.init();