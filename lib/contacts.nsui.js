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
    this.contacts = {}; // {<name>: {name: <string>, li: <DOM element>, img: <DOM element>, avatar: <url>}}
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

ContactList.prototype.addContact = function(name) {
    var infos = {}, li = null, login = null, close = null;

    if (typeof this.contacts[name] === "undefined") {
	infos = {
	    "name": name,
	    "li": null,
	    "avatar": null
	};

	li = document.createElement("li");
	$cs.avatars.get(infos.name, function(url) {
	    li.style.backgroundImage = "url('" + url + "')";
	});
	img = document.createElement("img");
	this.setImageStatus(img, "offline");
	login = document.createElement("span");
	close = document.createElement("span");
	close.classList.add("remove");
	login.innerHTML = name;
	close.innerHTML = '<img src="img/delcontact.png" alt="x" title="delete contact">';
	li.appendChild(img);
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
	infos.img = img;
	this.contacts[name] = infos;
	this.save();
	this.insertContact(infos);
    }
    $cs.client.addContact(name);
};

ContactList.prototype.rmContact = function(name) {
    if (typeof this.contacts[name] !== "undefined") {
	this.lst.removeChild(this.contacts[name].li);
	delete this.contacts[name];
	this.save();
    }
};

ContactList.prototype.setImageStatus = function(img, status) {
    var status_list = {'default' : 'img/status/contact-connected.png',

		       'offline': 'img/status/contact-disconnected.png',
		       'disconnected': 'img/status/contact-disconnected.png',
		       'deconnecte': 'img/status/contact-disconnected.png',
		       'deco': 'img/status/contact-disconnected.png',
		       'hidden': 'img/status/contact-disconnected.png',
		       'cache': 'img/status/contact-disconnected.png',

		       'away': 'img/status/contact-away.png',
		       'inactif': 'img/status/contact-away.png',
		       'absent': 'img/status/contact-away.png',
		       'idle': 'img/status/contact-away.png',

		       'dnd': 'img/status/contact-dnd.png',
		       'occuped': 'img/status/contact-dnd.png',
		       'npd': 'img/status/contact-dnd.png',
		       'occupe': 'img/status/contact-dnd.png'
		      };

    if (status_list.hasOwnProperty(status)) {
	img.src = status_list[status];
    } else {
	img.src = status_list.default;
    }
    img.alt = status;
    img.title = status;
};

ContactList.prototype.changeContactStatus = function(name, status) {
    if (typeof this.contacts[name] !== "undefined") {
	this.setImageStatus(this.contacts[name].img, status);
	console.log(name + ' changed his status to ' + status);
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
