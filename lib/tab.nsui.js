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

var Tab = function(name) {
    this.name = this.filterName(name);
    this.chat_input = null;
    this.wr_lst = document.getElementById("tab-lst");
    this.wr_body = document.getElementById("tab-body-wrapper");
    this.buff_len = 1000;
    this.history_index = 0;
    this.history = [];
	$cs.opts.restore();
    this.initListElement();
    this.initBodyElement();
};

Tab.prototype.filterName = function(name) {
    return name.replace(/[^a-z0-9\-_]/g, "").replace(/^[0-9]/g, "_");
};

Tab.prototype.initListElement = function() {
    var inner = document.createElement("span"), close = document.createElement("img");

    close.src = "img/delcontact.png";
    close.alt = "x";
    close.title = "Close tab";
    close.classList.add("close-tab");
    inner.innerHTML = this.name;
    this.el_lst = document.createElement("li");
    inner.addEventListener("click", (function(elem) {
        return function() {
            elem.show();
        };
    })(this), false);
    close.addEventListener("click", (function(elem) {
        return function() {
            elem.close();
        };
    })(this), false);
    this.el_lst.addEventListener("dblclick", (function(elem) {
        return function() {
            elem.close();
        };
    })(this), false);

    this.el_lst.appendChild(inner);
    this.el_lst.appendChild(close);
    this.wr_lst.appendChild(this.el_lst);
};

Tab.prototype.initBodyElement = function() {
    var chat_input_w = document.createElement("div");
	
    this.chat_input = document.createElement("input");
    this.chat_input.placeholder = "Some text here...";
	
    this.chat_log = document.createElement("p");
    this.chat_log.classList.add("chat-log");
	this.chat_log.style.fontSize = $cs.opts.values["chat-size"] + "px";
	
    this.el_body = document.createElement("div");
    this.el_body.classList.add("tab-body"); 
    this.el_body.id = this.name;
    this.el_body.style.display = "none";
	
    chat_input_w.classList.add("chat-input-wrapper");
	
    this.chat_input.classList.add("chat-input");
    this.chat_input.setAttribute("type", "text");
    this.chat_input.addEventListener("keyup", (function(elem) {
	return function(event) {
	    var key_submit = 13, key_up = 38, key_down = 40;

	    if (event.keyCode === key_submit && this.value != "") {
		var msg = this.value;
		this.value = "";

		if (typeof $cs.client !== "undefined" && $cs.opts.get("enable_msg")) {
		    $cs.client.speak(elem.name, msg);
		    $cs.ui.addContentToTab(elem.name, {"message": msg});
		} else {
		    console.error("chromesoul client not found");
		}
	    } else if (event.keyCode === key_up) {
		if (elem.history_index < elem.history.length) {
		    elem.history_index++;
		    this.value = elem.history[elem.history.length - elem.history_index];
		}
	    } else if (event.keyCode === key_down) {
		if (elem.history_index > 0) {
		    elem.history_index--;
		    if (elem.history_index > 0) {
			this.value = elem.history[elem.history.length - elem.history_index];
		    } else {
			this.value = "";
		    }
		}
	    }
	};
    })(this), false);

    chat_input_w.appendChild(this.chat_input);
    this.el_body.appendChild(this.chat_log);
    this.el_body.appendChild(chat_input_w);
    this.wr_body.appendChild(this.el_body);
};

Tab.prototype.close = function() {
    if (typeof this.closeHandler !== "undefined") {
	this.closeHandler();
    }
    this.wr_body.removeChild(this.el_body);
    this.wr_lst.removeChild(this.el_lst);
};

Tab.prototype.hide = function() {
    this.el_lst.classList.remove("tab-current");
    this.el_body.style.display = "none";
};

Tab.prototype.show = function() {
	this.options.restore();
    if (typeof this.showHandler !== "undefined") {
	this.showHandler();
    }
    this.el_lst.classList.remove("tab-active");
    this.el_lst.classList.add("tab-current");
    this.el_body.style.display = "block";
	$cs.opts.restore()
    this.chat_log.scrollTop = 42000;
	this.chat_log.style.fontSize = $cs.opts.values["chat-size"] + "px";
    this.chat_input.focus();
};

Tab.prototype.isCurrent = function() {
    return this.el_lst.classList.contains("tab-current");
};

Tab.prototype.setActive = function() {
    this.el_lst.classList.add("tab-active");
}

Tab.prototype.flushText = function() {
    while (this.chat_log.children.length > this.buff_len) {
	this.chat_log.removeChild(this.chat_log.children[0]);
    }
    while (this.history.length > this.buff_len) {
	this.history.shift();
    }
};

Tab.prototype.appendMessage = function(msg) {
    this.history_index = 0;
    this.chat_log.innerHTML += '<div class="chat-message">' + $cs.ui.formatMessage(msg) + '</div>';
	
    if (!(typeof msg.login !== "undefined" && msg.login !== null)) {
	this.history.push(msg.message);
    }
    this.flushText();
    this.chat_log.scrollTop = 42 * this.buff_len;
};
