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
    this.pass_storage = chrome.storage.local;
    this.status = null;
    this.save_btn = null;
    this.opts = null;
    this.values = {};
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
	},
	"number": function(elem) {
		return elem.value;
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
	},
	"number": function(elem, val) {
		elem.value = val;
	}
    }
};

OptionsManager.prototype.get = function(name) {
    var ret = null;

    if (typeof this.values[name] !== "undefined") {
	ret = this.values[name];
    }

    return ret;
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

OptionsManager.prototype.savePart = function(pass) {
    var i = 0, data = {}, storage;

	if (pass) {
	storage = this.pass_storage;
    } else {
	storage = this.storage;
    }

    if (this.opts !== null) {
	for (i = this.opts.length - 1; i >= 0; --i) {
		if ((pass && (this.getElemType(this.opts[i]) === "password" || this.getElemType(this.opts[i]) === "text"))
		|| (!pass && this.getElemType(this.opts[i]) !== "password" && this.getElemType(this.opts[i]) !== "text"))  {
		data[this.opts[i].id] = this.getElemValue(this.opts[i]);
		this.values[this.opts[i].id] = data[this.opts[i].id];
	    }
	}
	storage.set(data, (function(elem) {
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

OptionsManager.prototype.save = function() {
    this.savePart(true);
	this.savePart(false);
};

OptionsManager.prototype.restore = function() {
    var i, el, cb = function(elem) {
        return function(items) {
            for (i in items) {
                el = document.getElementById(i);
                if (el !== null) {
		    elem.values[i] = items[i];
                    elem.setElemValue(el, items[i]);
                }
            }
        };
    };

    this.storage.get(null, cb(this));
    this.pass_storage.get(null, cb(this));
};

OptionsManager.prototype.getElemType = function(elem) {
    return elem.getAttribute('type');
};

OptionsManager.prototype.getElemValue = function(elem) {
    var val = null, type = this.getElemType(elem);

    if (typeof this.types.get[type] !== "undefined") {
	val = this.types.get[type](elem);
    }

    return val;
};

OptionsManager.prototype.setElemValue = function(elem, val) {
    var type = elem.getAttribute('type');

    if (typeof this.types.set[type] !== "undefined") {
	this.types.set[type](elem, val);
    }
};

