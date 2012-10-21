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

var NsClient = function() {
    this.storage = chrome.storage.sync;
    this.state = "actif";
    this.allowed_statuses =  ["actif", "away", "idle", "lock"];
    this.is_connected = false;
};

NsClient.prototype.connect = function() {
    var cnt = function(elem) {
	return function(infos) {
	    if (typeof infos.login !== "undefined" && typeof infos.pwd_socks !== "undefined") {
		elem.is_connected = true;
		console.info("connected to the netsoul server");
		elem.updateStatus();
	    }
	};
    };

    console.log('connecting...');
    if (!this.is_connected) {
	this.storage.get(null, cnt(this));
    } else {
	console.warn("already connected");
    }
};

NsClient.prototype.disconnect = function() {
    if (this.is_connected) {
	this.is_connected = false;
	console.info("disconnected");
	this.updateStatus();
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.updateStatus = function() {
    if (this.is_connected) {
	console.info("updating status");
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.recv = function() {
    if (this.is_connected) {
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.changeStatus = function(new_status) {
    if (this.is_connected) {
	if (this.allowed_statuses.indexOf(new_status) !== -1) {
	    this.status = new_status;
	} else {
	    console.warn("invalid status: " + new_status);
	}
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.init = function() {
    var upd = function(elem) {
	return function() {
	    if (elem.is_connected) {
		elem.updateStatus();
	    }
	};
    },
    con = function(elem) {
	return function() {
	    if (!elem.is_connected) {
		elem.connect();
	    }
	};
    };

    con(this).apply();
    setInterval(con(this), 60000);
    setInterval(upd(this), 600000);
};
