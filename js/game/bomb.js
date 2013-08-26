var globals,
	Bomb;
(function (document, Modernizr, undefined) {
	'use strict';

	var transformProp = Modernizr.prefixed('transform');

	Bomb = function (x, y) {
		this.container = undefined;
		this.position = {x: x, y: y};

		this.exploaded = false;

		this.create();
	};

	Bomb.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'bomb';
			this.update();
		},

		update: function () {
			this.container.style[transformProp] = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}


	};

})(document, Modernizr);