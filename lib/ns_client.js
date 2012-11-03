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
    this.socket = null;
    this.verbose = false;
};

NsClient.prototype.connect = function() {
    var cnt = function(elem) {
	return function(infos) {
	    if (typeof infos.login !== "undefined" && typeof infos.pwd_socks !== "undefined") {
		if (elem.verbose)
		    console.log('creating socket...');
		chrome.socket.create('tcp', {}, function(sock_inf) {
		    if (elem.verbose)
			console.log('socket created, id: ' + sock_inf.socketId);
		    elem.socket = sock_inf.socketId;
		    chrome.socket.connect(elem.socket, "ns-server.epita.fr", 4242, function(res) {
			if (elem.verbose)
			    console.log('connected to server');
			chrome.socket.read(elem.socket, null, function(rd_inf) {
			    if (rd_inf.resultCode > 0) {
				if (elem.verbose)
				    console.log(ab2str(rd_inf.data));
				var data = ab2str(rd_inf.data).split(' '),
				auth = "ext_user_log ";
				auth += infos.login + " ";
				auth += hex_md5(data[2] + "-" + data[3] + "/" + data[4] + infos.pwd_socks) + " ";
				auth += "chromesoul chromesoul\n";
				chrome.socket.write(elem.socket, str2ab("auth_ag ext_user none none\n"), function(w_inf) {
				    chrome.socket.read(elem.socket, null, function(rd_inf) {
					if (rd_inf.resultCode > 0) {
					    chrome.socket.write(elem.socket, str2ab(auth), function(w_inf) {
						chrome.socket.read(elem.socket, null, function(rd_inf) {
						    if (rd_inf.resultCode > 0) {
							elem.is_connected = true;
							console.info("connected to the netsoul server");
							elem.updateStatus();
							elem.daemonize();
						    }
						});
					    });
					}
				    });
				});
			    }
			});
		    });
		});
	    }
	};
    };

    if (!this.is_connected) {
	this.storage.get(null, cnt(this));
    } else {
	console.warn("already connected");
    }
};

NsClient.prototype.disconnect = function() {
    if (this.is_connected) {
	chrome.socket.disconnect(this.socket);
	this.is_connected = false;
	console.info("disconnected");
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.daemonize = function() {
    var dm = function(elem) {
	return function(rd_inf) {
	    if (rd_inf.resultCode > 0) {
		var data = ab2str(rd_inf.data);

		if (elem.verbose)
		    console.log("recv: " + data);

		if (data.substr(0, 5) === "ping ") {
		    chrome.socket.write(elem.socket, rd_inf.data, function(w_inf) {
			if (elem.verbose)
			    console.log("sent: " + data);
			chrome.socket.read(elem.socket, null, this);
		    });
		}
	    }
	};
    };

    if (this.is_connected) {
	chrome.socket.read(this.socket, null, dm(this));
    } else {
	console.warn("not connected");
    }
};

NsClient.prototype.updateStatus = function() {
    if (this.is_connected) {
	var status_msg = "user_cmd state ";
	status_msg += this.state + ":";
	status_msg += Math.round(new Date().getTime() / 1000) + "\n";
	chrome.socket.write(this.socket, str2ab(status_msg), function(w_inf) {});
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
    setInterval(con(this), 10000);
    setInterval(upd(this), 600000);
};
