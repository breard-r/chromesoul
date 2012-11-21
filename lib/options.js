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

OptionsManager.prototype.types = {
    "get": {
	"text": function(elem) {
	    return elem.value;
	},
	"password": function(elem) {
	    return elem.value;
	},
	"checkbox": function(elem) {
	    return elem.checked;
	}
    },
    "set": {
	"text": function(elem, val) {
	    elem.value = val;
	},
	"password": function(elem, val) {
	    elem.value = val;
	},
	"checkbox": function(elem, val) {
	    if (!val) {
		elem.removeAttribute('checked');
	    } else {
		elem.setAttribute('checked');
	    }
	}
    }
};

OptionsManager.prototype.init = function() {
    this.status = document.getElementById("status");
    this.save_btn = document.getElementById("save");
    this.opts = document.getElementsByClassName("opt");

    this.restore();

    if (this.save !== null) {
	this.save_btn.addEventListener("click", (function(elem) {
	    return function() {
		elem.save();
	    };
	})(this));
    }
};

OptionsManager.prototype.save = function() {
    var i = 0, data = {};

    if (this.opts !== null) {
	for (i = this.opts.length - 1; i >= 0; --i) {
	    data[this.opts[i].id] = this.getElemValue(this.opts[i]);
	}
	this.storage.set(data, (function(elem) {
            return function () {
		if (elem !== null) {
                    elem.innerHTML = "Options saved.";
                    setTimeout(function() {
			elem.innerHTML = "";
                    }, 3000);
		}
            };
	})(this.status));
    }
};

OptionsManager.prototype.restore = function() {
    var i, el;

    this.storage.get(null, (function(elem) {
        return function(items) {
            for (i in items) {
                el = document.getElementById(i);
                if (el !== null) {
                    elem.setElemValue(el, items[i]);
                }
            }
        };
    })(this));
};

OptionsManager.prototype.getElemValue = function(elem) {
    var val = null, type = elem.getAttribute('type');

    if (typeof this.types.get[type] !== "undefined") {
	val = this.types.get[type](elem);
    }

    return this.encrypt(val);
};

OptionsManager.prototype.setElemValue = function(elem, val) {
    var type = elem.getAttribute('type');

    if (typeof this.types.set[type] !== "undefined") {
	this.types.set[type](elem, this.decrypt(val));
    }
};

OptionsManager.prototype.encrypt = function(value) {
    return value;
};

OptionsManager.prototype.decrypt = function(value) {
    return value;
};
