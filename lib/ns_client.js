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
    this.host = 'ns-server.epita.fr';
    this.port = 4242;
    this.default_status = 'actif';
    this.status_disconnected = 'disconnected';
    this.actions_enabled = ['ping', 'msg', 'status', 'login_out', 'who'];

    this.action = {};
    this.action.ping = function(client, str) {
	if (str.substr(0, 5) !== 'ping ') {
	    return false;
	}

	client.socket.write(str, function(inf) {});
	return true;
    };

    this.action.msg = (function(elem) {
	return function(client, str) {
	    var mo = {}, mch = /user_cmd (\d+):user:.*?:(.*?)@(.*?):.*?:(.*?):(.*?) \| msg ([^ ]*)/.exec(str);

	    if (mch === null) {
		return false;
	    }

	    mo.socket = mch[1];
	    mo.login = mch[2];
	    mo.host = mch[3];
	    mo.location = elem.msgDecode(mch[4]);
	    mo.group = mch[5];
	    mo.message = elem.msgDecode(mch[6]);

	    $cs.ui.addContentToTab(mo.login, mo); // TODO: FIX ME!

	    return true;
	};
    })(this);

    this.action.status = (function(elem) {
	return function(client, str) {
	    var mch = /user_cmd (\d+):user:.*?:(.*?)@(.*?):.*?:(.*?):(.*?) \| state ([^ ]*):(\d+)/.exec(str);

	    if (mch === null) {
		return false;
	    }

	    $cs.contacts.changeContactStatus(mch[2], elem.msgDecode(mch[6])); // TODO: FIX ME!

	    return true;
	};
    })(this);

    this.action.login_out = function(client, str) {
	var status = null, mch = /user_cmd (\d+):user:.*?:(.*?)@(.*?):.*?:(.*?):(.*?) \| (login|logout)/.exec(str);

	if (mch === null) {
	    return false;
	}

	if (mch[6] === 'login') {
	    status = 'actif';
	}

	$cs.contacts.changeContactStatus(mch[2], status); // TODO: FIX ME!

	return true;
    };

    this.action.who = (function(elem) {
        return function(client, str) {
	    var mch = /user_cmd (\d+):user:.*?:(.*?)@(.*?):.*?:(.*?):(.*?) \| who (\d+) (.*?) (.*?) (\d+) (\d+) (\d+) (\d+) (.*?) (.*?) (.*?) (.*?):(.*) (.*)/.exec(str);

	    if (mch === null) {
		return false;
	    }

	    $cs.contacts.changeContactStatus(mch[7], elem.msgDecode(mch[16])); // TODO: FIX ME!

	    return true;
	};
    })(this);
};

NsClient.prototype.connect = function(client, callback) {
    var login, pwd_socks;

    if (!client.is_connected) {
	login = $cs.opts.get('login');
	pwd_socks = $cs.opts.get('pwd_socks');
	if (login !== null && pwd_socks !== null) {
	    client.socket.read(function(data) {
		var auth = '';

		data = data.split(' ');
		auth = 'ext_user_log ';
		auth += login + ' ';
		auth += hex_md5(data[2] + '-' + data[3] + '/' + data[4] + pwd_socks) + ' ';
		auth += 'chromesoul chromesoul\n';
		client.socket.write('auth_ag ext_user none none\n', function(inf) {
		    client.socket.read(function(data) {
			client.socket.write(auth, function(inf) {
			    client.socket.read(function(data) {
				if (data === 'rep 002 -- cmd end') {
				    client.is_connected = true;
				    console.info('connected to the netsoul server');
				} else {
				    console.error('authentication failure');
				}
				callback();
			    });
			});
		    });
		});
	    });
	} else {
	    callback();
	}
    } else {
	callback();
    }
};

NsClient.prototype.disconnect = function(client) {
    var msg = 'user_cmd msg_user exit\n';
    client.socket.write(msg, function() {
	client.socket.disconnect();
    });
};

NsClient.prototype.changeStatus = function(client) {
    if (client.is_connected) {
	status_msg = 'user_cmd state ';
	status_msg += this.msgEncode(client.status) + ':';
	status_msg += Math.round(new Date().getTime() / 1000) + '\n';
	client.socket.write(status_msg, function(inf) {
	    $cs.ui.onUserStatusChange(client.status);
	});
    } else {
	$cs.ui.onUserStatusChange(client.status);
    }
};

NsClient.prototype.recv = function(client, data) {
    for (var i = this.actions_enabled.length - 1; i >= 0; --i) {
	if (this.action[this.actions_enabled[i]](client, data)) {
	    break;
	}
    }
};

NsClient.prototype.speak = function(client, to, msg) {
    msg = 'user_cmd msg_user ' + to + ' msg ' + this.msgEncode(msg) + '\n';
    client.socket.write(msg, function(inf) {});
};

NsClient.prototype.addContact = function(client, lst) {
    var msg = 'user_cmd watch_log_user {' + lst.join(',') + '}\n';

    client.socket.write(msg, function(inf) {
	var msg = 'user_cmd who {' + lst.join(',') + '}\n';
	client.socket.write(msg, function(inf) {});
    });
};

NsClient.prototype.rmContact = function(client, name) {
    // TODO
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
	'@': /%40/g,
	'*': /%2A/g,
	'/': /%2F/g,
	'+': /%2B/g
    });
};

NsClient.prototype.msgEncode = function(msg) {
    return this.replacePairs(escape(msg), {
	'%40': /@/g,
	'%2A': /\*/g,
	'%2F': /\//g,
	'%2B': /\+/g,
    });
};
