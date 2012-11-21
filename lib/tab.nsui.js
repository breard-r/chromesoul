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
    this.wr_lst = document.getElementById("tab-lst");
    this.wr_body = document.getElementById("tab-body-wrapper");
    this.initListElement();
    this.initBodyElement();
};

Tab.prototype.filterName = function(name) {
    // TODO: enforce an id compliant name
    return name;
};

Tab.prototype.initListElement = function() {
    var inner = document.createElement("span"),
    evt_click = function(elem) {
	return function() {
	    elem.show();
	};
    },
    evt_dblclick = function(elem) {
	return function() {
	    elem.close();
	};
    };

    inner.innerHTML = this.name;
    this.el_lst = document.createElement("li");
    this.el_lst.addEventListener("click", (function(elem) {
        return function() {
            elem.show();
        };
    })(this), false);
    this.el_lst.addEventListener("dblclick", (function(elem) {
        return function() {
            elem.close();
        };
    })(this), false);

    this.el_lst.appendChild(inner);
    this.wr_lst.appendChild(this.el_lst);
};

Tab.prototype.initBodyElement = function() {
    var chat_input = document.createElement("input"),
    chat_input_w = document.createElement("div");

    this.chat_log = document.createElement("pre");
    this.chat_log.classList.add("chat-log");
    this.el_body = document.createElement("div");
    this.el_body.classList.add("tab-body");
    this.el_body.id = this.name;
    this.el_body.style.display = "none";
    chat_input_w.classList.add("chat-input-wrapper");
    chat_input.classList.add("chat-input");
    chat_input.setAttribute("type", "text");

    chat_input_w.appendChild(chat_input);
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
    if (typeof this.showHandler !== "undefined") {
	this.showHandler();
    }
    this.el_lst.classList.remove("tab-active");
    this.el_lst.classList.add("tab-current");
    this.el_body.style.display = "block";
    this.chat_log.scrollTop = 42000;
};

Tab.prototype.isCurrent = function() {
    return this.el_lst.classList.contains("tab-current");
};

Tab.prototype.setActive = function() {
    this.el_lst.classList.add("tab-active");
}

Tab.prototype.appendText = function(text) {
    // TODO: flush text
    this.chat_log.innerHTML += text;
};
