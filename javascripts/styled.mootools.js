

//////////////////////////
//
// Styled.js
// 
// Created: June 2012 by Boris Cherny (borischerny.com)
// License: None, modify and distribute as you want :)
// 
//////////////////////////

;(function Styled() {
	
	var showArrow = true;
	var elements = $$('.styled');
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
		var oo 		= i.getElements('option');
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
		
		var selected = i.getSelected()[0];
		var menu = Styled.selects[n] = new Element('span', {
			'class': 'select ' + i.className,
			id: i.id ? i.id + '_styled' : '',
			html: '<a class="head" href="#">' + (value === 'img' ? '<img alt="" src="' + selected.value + '" />' : '') + selected.innerHTML + (showArrow ? '<span class="arrow"></span></a>' : '') + html
		}).inject(parent);

		// position the replacements, inject into document
		
		var nodes = menu.childNodes;
		var head = nodes[0];
		var ul = $(nodes[1]);

		menu.setStyles({
			left: (iStyle = i.style).left,
			top: iStyle.top
		});
		setMenuWidth(menu);

		// if menu will be vertically cut off by the viewport, position it above the toggler instead of below
		
		var H = ul.offsetHeight;
		var T = i.offsetTop;
		if (window.innerHeight + yOffset() < H + T) {
			ul.style.top = -(H + i.offsetHeight - 1) + 'px';
		}

		// add events for menu items (via bubbling)
		menu.addEvents({
			click: function(event) {
				event.stop();

				var a = event.target;

				if (a.tagName === 'A' && !a.hasClass('head')) {

					// remove .cur class from other items
					this.getElements('.cur').removeClass('cur');

					// add .cur class to this item
					a.addClass('cur');

					// change select selected
					i.selectedIndex = ul.getElements('a').indexOf(a);

					// set new text
					head.firstChild.nodeValue = a.innerHTML;

					// hide menu (window.click event is stopped)
					hideSelects();

					// resize menu (IE6 can't handle this with just CSS)
					setMenuWidth(menu);

					// fire real select's change event
					i.fireEvent('change');

					// prevent IE from putting a dotted outline around the clicked link
					a.blur();
				}
			},
			mouseover: function() {
				this.addClass('hover');
			},
			mouseout: function() {
				this.removeClass('hover');
			}
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

		var one = A || document;
		var two = window;

		return typeof two.pageYOffset === 'number'
			? two.pageYOffset
			: one.documentElement.scrollTop;
	}
	
	function hideSelects() {
		if (n = Styled.selects.length) {
			while (n--) (s = Styled.selects[n]).removeClass('hover');
		}
	}

})();