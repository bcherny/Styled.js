//////////////////////////
//
// Styled.js
// 
// Created: June 2012 by Boris Cherny (borischerny.com)
// License: Modify and distribute as you wish!
// 
//////////////////////////

;(function Styled() {
	
	var showArrow = true;
	var elements = $('.styled');
	var Styled = {
		selects: []
	};

	//////////////////////////
	// loop through + style <select>'s
	//////////////////////////

	for (n = 0, c = elements.length; n < c; n++) {
			
		var i = elements[n];
		var parent = i.parentNode;
		var value	= '';

		if (i.isStyled) return false; // don't style if it's already styled!

		// get options
		if (options = i.getAttribute('title')) {

			i.title = '';

			for (opts = options.split(';'), n = opts.length, k = 0; k < n; k++) {
				var parts = opts[k].split(':');
				switch (parts[0]) {
					case 'value':
						value = parts[1];
						break;
				}
			}
		}

		// build option list
		
		var html 	= '<ul>';
		var oo 		= $('option', i);
		var oo_arr 	= [];
		
		if (m = oo.length) {
			var k = 0;
			while (k < m) {
				var opt = oo[k++];
				var val = (value === 'img' ? '<img alt="" src="' + opt.value + '" />' : '') + opt.innerHTML;
				var className = opt.selected || k === m ? ' class="' + (opt.selected ? 'cur ' : '') + (k === m ? 'last ' : '') + '"' : '';
				oo_arr.push('<li><a href="#"' + className + '>' + val + '</a></li>');
			}
		}
		
		html += oo_arr.join('') + '</ul>';
		
		// add replacement element to page
		
		var selected = getSelected(i);
		var className = 'select ' + i.className;
		var id = i.id ? ' id="' + i.id + '_styled"' : '';
		var innerHTML = '<a class="head" href="#">' + (value === 'img' ? '<img alt="" src="' + selected.value + '" />' : '') + selected.innerHTML + (showArrow ? '<span class="arrow"></span></a>' : '') + html;

		Styled.selects[n] = menu = document.createElement('span');
			menu.className = className;
			menu.id = id;
			menu.innerHTML = innerHTML;
		parent.appendChild(menu);

		// position the replacements, inject into document
		var nodes = menu.childNodes;
		var head = nodes[0];
		var ul = nodes[1];

		(mStyle = menu.style).left = (iStyle = i.style).left;
		mStyle.top = iStyle.top;
		setMenuWidth(menu);

		// if menu will be vertically cut off by the viewport, position it above the toggler instead of below
		var H = ul.offsetHeight;
		var T = i.offsetTop;
		if (window.innerHeight + yOffset() < H + T) {
			ul.style.top = -(H + i.offsetHeight - 1) + 'px';
		}

		// add events for menu items (via bubbling)
		addEvent(menu, 'click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var a = e.target;

			if (a.tagName === 'A' && a.className !== 'head') {
				
				// remove .cur class from other items
				var curs = $('.cur', this);
				for (n=curs.length; n--;) curs[n].className = curs[n].originalClassName || '';

				// add .cur class to this item
				if (!a.originalClassName) a.originalClassName = a.className;
				a.className += ' cur';

				// change select selected
				i.selectedIndex = index($('a', ul), a);

				// set new text
				head.firstChild.nodeValue = a.innerHTML;

				// hide menu (window.click event is stopped)
				hideSelects();

				// resize menu (IE6 can't handle this with just CSS)
				setMenuWidth(menu);

				// fire real select's change event
				fireEvent(i, 'change');

				// prevent IE from putting a dotted outline around the clicked link
				a.blur();
			}
		});
		addEvent(menu, 'mouseover', function() {
			if (!this.originalClassName) this.originalClassName = this.className;
			this.className += ' hover';
		});
		addEvent(menu, 'mouseout', function() {
			this.className = this.originalClassName;
		});

		// set styled flag
		i.isStyled = 1;

		// hide it
		i.style.visibility = 'hidden';
	}

	//////////////////////////
	// helper functions
	//////////////////////////

	function setMenuWidth(menu) {
		menu.childNodes[1].style.width = menu.offsetWidth + 'px';
	}

	function yOffset(A) {
		if (typeof A === 'undefined') A = document;
		var B = window;

		return typeof B.pageYOffset === 'number'
			? B.pageYOffset
			: A.documentElement.scrollTop;
	}
	
	function hideSelects() {
		if (n = Styled.selects.length) {
			while (n--) (s = Styled.selects[n]).className = s.originalClassName;
		}
	}

	// generic shorthand functions

	function getSelected(element) {
		if (element.tagName === 'SELECT') {
			return element.options[element.selectedIndex];
		}
	}

	function $(selector, context) {
		var ctx = context || document, sel, what;
		switch (selector.charAt(0)) {
			case '#':
				return ctx.getElementById(selector.slice(1)); break;
			case '.':
				return getByClassName(selector.slice(1), ctx); break;
			default:
				return ctx.getElementsByTagName(selector);
		}
	}

	// IE polyfills

	function getByClassName(selector, context) {
		var ctx = context || document;
		if (typeof ctx.getElementsByClassName === 'function') return ctx.getElementsByClassName(selector);
		selector = " " + selector + " ";
		var a = [], els = ctx.getElementsByTagName("*");
		for (var i = 0, j = els.length; i<j; i++) {
			if ((" "+els.item(i).className+" ").indexOf(selector) !== -1) a.push(els.item(i));
		}
		return a;
	}

	function index(array, what) {
		if (typeof array.indexOf === 'function') return array.indexOf(what);
		var i = this.length;
		if (i < 0) i = 0;
		for (var n = this.length; i<n; i++)
			if (i in this && this[i] === what)
				return i;
		return -1;
	}

	// written by Dean Edwards, 2005
	// with input from Tino Zijdel, Matthias Miller, Diego Perini
	// http://dean.edwards.name/weblog/2005/10/add-event/

	function addEvent(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		}
		else {
			// assign each event handler a unique ID
			if (!handler.$$guid) handler.$$guid = addEvent.guid++;
			// create a hash table of event types for the element
			if (!element.events) element.events = {};
			// create a hash table of event handlers for each element/event pair
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				// store the existing event handler (if there is one)
				if (element["on" + type]) {
					handlers[0] = element["on" + type];
				}
			}
			// store the event handler in the hash table
			handlers[handler.$$guid] = handler;
			// assign a global event handler to do all the work
			element["on" + type] = handleEvent;
		}
	}

	// a counter used to create unique IDs
	addEvent.guid = 1;

	function removeEvent(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else {
			// delete the event handler from the hash table
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		}
	}

	function handleEvent(event) {
		var returnValue = true;
		// grab the event object (IE uses a global event object)
		event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
		// get a reference to the hash table of event handlers
		var handlers = this.events[event.type];
		// execute each event handler
		for (var i in handlers) {
			this.$$handleEvent = handlers[i];
			if (this.$$handleEvent(event) === false) {
				returnValue = false;
			}
		}
		return returnValue;
	}

	function fixEvent(event) {
		// add W3C standard event methods
		event.preventDefault = fixEvent.preventDefault;
		event.stopPropagation = fixEvent.stopPropagation;
		if (!('target' in event) && event.srcElement) event.target = event.srcElement;
		return event;
	}

	fixEvent.preventDefault = function() {
		this.returnValue = false;
	};
	fixEvent.stopPropagation = function() {
		this.cancelBubble = true;
	};

	// from http://jehiah.cz/a/firing-javascript-events-properly

	function fireEvent(element, event){
		if (document.createEventObject) {
			// dispatch for IE
			var evt = document.createEventObject();
			return element.fireEvent('on'+event,evt);
		}
		else {
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, true, true ); // event type,bubbling,cancelable
			return !element.dispatchEvent(evt);
		}
	}

})();