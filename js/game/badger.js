var globals,
	Badger;

(function (Modernizr) {
	'use strict';

	var transformProp = Modernizr.prefixed('transform'),
		animationDelayProp = Modernizr.prefixed('animationDelay');

	Badger = function (x, y, delay) {
		this.container = undefined;
		this.position = {x: x, y: y};
		this.delay = delay;

		this.create();

	};

	Badger.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'badger';
			this.container.style[animationDelayProp] = this.delay.toFixed(2) + 's'; 
			this.update();
		},

		update: function () {
			this.container.style[transformProp] = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}	
	};

})(Modernizr);