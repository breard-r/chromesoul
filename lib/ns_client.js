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
    this.state = "actif";
    this.allowed_statuses =  ["actif", "away", "idle", "lock"];
    this.is_connected = false;
    this.socket = null;
    this.actions = {};

    this.actions.ping = {};
    this.actions.ping.is = function(msg) {
	return msg.substr(0, 5) === "ping ";
    };
    this.actions.ping.act = (function(elem) {
	return function(msg) {
	    chrome.socket.write(elem.socket, str2ab(msg), function(w_inf) {});
	};
    })(this);

    this.actions.msg = {};
    this.actions.msg.exp = /user_cmd (\d+):user:.*?:(.*?)@(.*?):.*?:(.*?):(.*?) \| msg ([^ ]*)/;
    this.actions.msg.is = (function(exp) {
	return function(msg) {
	    return exp.exec(msg) !== null;
	};
    })(this.actions.msg.exp);
    this.actions.msg.act = (function(elem) {
	return function(msg) {
	    var mo = {};

	    mch = elem.actions.msg.exp.exec(msg);
	    if (mch !== null) {
		mo.socket = mch[1];
		mo.login = mch[2];
		mo.host = mch[3];
		mo.location = elem.msgDecode(mch[4]);
		mo.group = mch[5];
		mo.message = elem.msgDecode(mch[6]);

		$cs.ui.addContentToTab(mo.login, mo);
            }
	};
    })(this);
};

NsClient.prototype.replacePairs = function(str, pairs) {
    for (var i in pairs) {
	if (pairs.hasOwnProperty(i)) {
	    str = str.replace(pairs[i], i);
	}
    }
    return str;
}

NsClient.prototype.msgDecode = function(msg) {
    return this.replacePairs(unescape(msg), {
	"@": /%40/g,
	"*": /%2A/g,
	"/": /%2F/g,
	"+": /%2B/g
    });
};

NsClient.prototype.msgEncode = function(msg) {
    return this.replacePairs(escape(msg), {
	"%40": /@/g,
	"%2A": /\*/g,
	"%2F": /\//g,
	"%2B": /\+/g,
    });
};

NsClient.prototype.connect = function() {
    var login, pwd_socks;

    if (!this.is_connected) {
	login = $cs.opts.get('login');
	pwd_socks = $cs.opts.get('pwd_socks');
	if (login !== null && pwd_socks !== null) {
            chrome.socket.create('tcp', {}, (function(elem) {
		return function(sock_inf) {
		    elem.socket = sock_inf.socketId;
		    chrome.socket.connect(elem.socket, "ns-server.epita.fr", 4242, function(res) {
			chrome.socket.read(elem.socket, null, function(rd_inf) {
			    if (rd_inf.resultCode > 0) {
				var data = ab2str(rd_inf.data).split(' '),
				auth = "ext_user_log ";
				auth += login + " ";
				auth += hex_md5(data[2] + "-" + data[3] + "/" + data[4] + pwd_socks) + " ";
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
		};
	    })(this));
	}
    }
};

NsClient.prototype.disconnect = function() {
    if (this.is_connected) {
	chrome.socket.disconnect(this.socket);
	this.is_connected = false;
	console.info("disconnected");
	this.updateStatus();
    }
};

NsClient.prototype.daemonize = function() {
    if (this.is_connected) {
	chrome.socket.read(this.socket, (function(elem) {
            return function(rd_inf) {
		if (rd_inf.resultCode > 0) {
                    var at, data = ab2str(rd_inf.data);

                    for (at in elem.actions) {
			if (elem.actions[at].is(data)) {
                            elem.actions[at].act(data);
                            break ;
			}
                    }
                    elem.daemonize();
		} else {
                    /*
                     * A read error is the only way to know if the remote peer has disconnected.
                     * See <http://developer.chrome.com/apps/socket.html> for more informations.
		     */
                    elem.disconnect();
                    console.info('connection lost, reconnecting...');
		}
            };
	})(this));
    } else {
	console.error("unable to daemonize: not connected");
    }
};

NsClient.prototype.sendMessage = function(to, message) {
    var msg = "user_cmd msg_user " + to + " msg " + this.msgEncode(message) + "\n";

    chrome.socket.write(this.socket, str2ab(msg), function(w_inf) {});
};

NsClient.prototype.updateStatus = function() {
    var status = "disconnected", status_msg = "";

    if (this.is_connected) {
	status_msg = "user_cmd state ";
	status = this.state;
	status_msg += this.state + ":";
	status_msg += Math.round(new Date().getTime() / 1000) + "\n";
	chrome.socket.write(this.socket, str2ab(status_msg), function(w_inf) {});
    }
    $cs.ui.onUserStatusChange(status);
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
    var status_update = function(elem) {
	return function() {
	    elem.updateStatus();
	};
    },
    connect = function(elem) {
	return function() {
	    if (!elem.is_connected) {
		elem.connect();
	    }
	};
    };

    status_update(this).apply();
    setTimeout(connect(this), 500);
    setInterval(connect(this), 10000);
    setInterval(status_update(this), 600000);
};
