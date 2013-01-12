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
    this.contacts = {}; // {<name>: {name: <string>, li: <DOM element>, avatar: <url>}}
    this.lst = document.getElementById("contact-lst");
};

ContactList.prototype.insertContact = function(elem) {
    var i, next = null;

    for (i in this.contacts) {
	if (this.contacts.hasOwnProperty(i)) {
	    if (elem.name < this.contacts[i].name && (next === null || this.contacts[i].name < next.name)) {
		next = this.contacts[i];
	    }
	}
    }

    if (next !== null) {
	this.lst.insertBefore(elem.li, next.li);
    } else {
	this.lst.appendChild(elem.li);
    }
};

ContactList.prototype.getContactPic = function(elem, infos) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://www.epitech.eu/intra/photos/" + infos.name + ".jpg", true);
    xhr.responseType = "blob";
    xhr.onload = (function(el) {
	return function(e) {
	    if (e.target.status === 200) {
		infos.avatar = window.webkitURL.createObjectURL(this.response);
	    } else {
		infos.avatar= "img/default-avatar.jpg";
	    }

	    elem.style.backgroundImage = "url('" + infos.avatar + "')";
	};
    })(this);
    xhr.send();
}

ContactList.prototype.addContact = function(name) {
    var infos = {}, li = null, login = null, close = null;

    if (typeof this.contacts[name] === "undefined") {
	infos = {
	    "name": name,
	    "li": null,
	    "avatar": null
	};

	li = document.createElement("li");
	this.getContactPic(li, infos);
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

	infos.li = li;
	this.contacts[name] = infos;
	this.save();
	this.insertContact(infos);
    }
};

ContactList.prototype.rmContact = function(name) {
    if (typeof this.contacts[name] !== "undefined") {
	this.lst.removeChild(this.contacts[name].li);
	delete this.contacts[name];
	this.save();
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
