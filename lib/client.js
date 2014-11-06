//
// Copyright (c) 2013 Rodolphe Breard
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

var Client = function() {
    this.socket = null;
    this.is_connected = false;
    this.client = null;
    this.ui = null;
    this.status = null;
    this.contacts = [];
    this.waiting_contacts = [];
};

Client.prototype.createSocket = function() {
    if (this.socket === null) {
        this.socket = new TxtSocket();
        this.socket.onError = (function(elem) {
            return function() {
                elem.is_connected = false;
                elem.connect();
            };
        })(this);
    }
};

Client.prototype.connect = function() {
    if (!this.is_connected) {
        this.createSocket();
        this.socket.connect(this.client.host, this.client.port, (function(elem) {
            return function() {
                elem.client.connect(elem, function() {
                    if (elem.is_connected) {
                        elem.daemonize();
                        elem.changeStatus();
                        elem.addContact();
                    } else {
                        elem.disconnect();
                    }
                });
            };
        })(this));
    }
}

Client.prototype.disconnect = function() {
    if (this.is_connected) {
        this.is_connected = false;
        this.client.disconnect(this);
        this.socket.disconnect();
        this.socket = null;
    }
    this.changeStatus(this.client.status_disconnected);
};

Client.prototype.reconnect = function() {
    this.disconnect();
    this.connect();
};

Client.prototype.daemonize = function() {
    this.socket.read((function(elem) {
        return function(data) {
            elem.client.recv(elem, data);
            elem.daemonize();
        };
    })(this));
};

Client.prototype.changeStatus = function(status) {
    if (typeof status === 'undefined') {
        status = this.client.default_status;
    }
    if (status !== this.status) {
        this.status = status;
        this.updateStatus();
    }
};

Client.prototype.updateStatus = function() {
    if (this.status !== null) {
        this.client.changeStatus(this);
    }
};

Client.prototype.addContact = function(name) {
    if (typeof name !== 'undefined') {
        this.waiting_contacts.push(name);
    }
    if (this.is_connected) {
        var tmp = this.waiting_contacts;
        this.waiting_contacts = [];
        this.client.addContact(this, tmp);
    }
};

Client.prototype.rmContact = function(name) {
    if (this.is_connected) {
        this.client.rmContact(this, name);
    }
};

Client.prototype.speak = function(to, msg) {
    if (this.is_connected) {
        this.client.speak(this, to, msg);
    }
};

Client.prototype.init = function(client, ui) {
    this.client = client;
    this.ui = ui;

    this.connect();
    setInterval((function(elem) {
        return function() {
            elem.connect();
        };
    })(this), 10000);

    setInterval((function(elem) {
        return function() {
            elem.updateStatus();
        };
    })(this), 180000);
};
