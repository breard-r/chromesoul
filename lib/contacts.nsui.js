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

var ContactList = function() {
    this.storage = chrome.storage.sync;
    this.contacts = {};
    this.lst = document.getElementById("contact-lst");
};

ContactList.prototype.addContact = function(name) {
    var el = null;

    if (typeof this.contacts[name] === "undefined") {
	el = document.createElement("li");
	el.innerHTML = name;
	el.addEventListener("dblclick", function() {
	    var nel = $cs.ui.addNewTab(this.innerHTML);

	    $cs.ui.hideAllTabs();
	    nel.show();
	});
	this.contacts[name] = el;
	this.save();
	this.lst.appendChild(el);
    }
};

ContactList.prototype.save = function() {
    var i, data = {"contact_list": []};

    for (i in this.contacts) {
	if (this.contacts.hasOwnProperty(i)) {
	    data.contact_list.push(i);
	}
    }
    data.contact_list.sort();
    this.storage.set(data, function() {});
};

ContactList.prototype.restore = function() {
    this.storage.get("contact_list", (function(elem) {
        return function(items) {
	    elem.contacts = {};
	    elem.lst.innerHTML = "";
	    if (typeof items.contact_list !== "undefined") {
		for (i = items.contact_list.length - 1; i >= 0; --i) {
		    elem.addContact(items.contact_list[i]);
		}
	    }
        };
    })(this));
};

ContactList.prototype.init = function() {
    var add_btn = document.getElementById("add-contact");

    this.restore();
    this.save();
    add_btn.addEventListener("keyup", function(event) {
	if (event.keyCode == 13 && this.value != "") {
	    $cs.contacts.addContact(this.value);
	    this.value = "";
	}
    });
};
