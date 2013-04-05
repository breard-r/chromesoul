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

var TxtSocket = function() {
    this.socket_id = null;
    this.buffer = '';
    this.onError = function(infos) {};
};

TxtSocket.prototype.connect = function(host, port, callback) {
    chrome.socket.create('tcp', {}, (function(elem) {
	return function(inf) {
	    elem.socket_id = inf.socketId;
	    chrome.socket.connect(elem.socket_id, host, port, callback);
	};
    })(this));
};

TxtSocket.prototype.disconnect = function() {
    if (this.socket_id !== null) {
	chrome.socket.disconnect(this.socket_id);
	chrome.socket.destroy(this.socket_id);
    }
};

TxtSocket.prototype.read = function(callback) {
    var tmp = '', offset = this.buffer.indexOf("\n");

    if (offset === -1) {
	chrome.socket.read(this.socket_id, (function(elem) {
	    return function(rd_inf) {
		if (rd_inf.resultCode > 0) {
		    elem.buffer += elem.ab2str(rd_inf.data);
		    elem.read(callback);
		} else {
		    elem.throwError({code: rd_inf.resultCode});
		}
	    };
	})(this));
    } else {
	tmp = this.buffer.substr(0, offset);
	this.buffer = this.buffer.substr(offset + 1);
	callback(tmp);
    }
};

TxtSocket.prototype.write = function(str, callback) {
    chrome.socket.write(this.socket_id, this.str2ab(str), (function(elem) {
	return function(w_inf) {
	    if (w_inf.bytesWritten >= 0) {
		callback(w_inf);
	    } else {
		elem.throwError({code: w_inf.bytesWritten});
	    }
	};
    })(this));
};

TxtSocket.prototype.throwError = function(infos) {
    console.error('socket error ' + infos.code + ', shutting it down');
    this.disconnect();
    this.onError(infos);
};

TxtSocket.prototype.ab2str = function(buff) {
    return String.fromCharCode.apply(null, new Uint8Array(buff));
};

TxtSocket.prototype.str2ab = function(str) {
    var i = 0, buff = new ArrayBuffer(str.length), buff_v = new Uint8Array(buff);

    for (i = str.length - 1; i >= 0; --i) {
	buff_v[i] = str.charCodeAt(i);
    }

    return buff;
}
