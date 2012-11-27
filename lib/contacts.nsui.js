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
    var li = null, login = null, close = null;

    if (typeof this.contacts[name] === "undefined") {
	li = document.createElement("li");
	login = document.createElement("span");
	close = document.createElement("span");
	close.classList.add("remove");
	login.innerHTML = name;
	close.innerHTML = "x";
	li.appendChild(login);
	li.appendChild(close);
	li.addEventListener("dblclick", function() {
	    var nel = $cs.ui.addNewTab(name);

	    $cs.ui.hideAllTabs();
	    nel.show();
	});
	close.addEventListener("click", (function(elem) {
	    return function() {
		elem.rmContact(name);
	    };
	})(this));
	this.contacts[name] = li;
	this.save();
	this.lst.appendChild(li);
    }
};

ContactList.prototype.rmContact = function(name) {
    console.log('removing ' + name + 'from contacts');
    for (var i = this.lst.children.length - 1; i >= 0; --i) {
	if (this.lst.children[i].children[0].innerHTML === name) {
	    console.log('deleted');
	    this.lst.removeChild(this.lst.children[i]);
	    break ;
	}
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
