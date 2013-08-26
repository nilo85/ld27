var globals,
	Adrenalin;

(function (Modernizr) {
	'use strict';

	var transformProp = Modernizr.prefixed('transform');

	Adrenalin = function (x, y) {
		this.container = undefined;
		this.position = {x: x, y: y};

		this.exploaded = false;

		this.create();
	};

	Adrenalin.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'adrenalin';
			this.update();
		},

		update: function () {
			this.container.style[transformProp] = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}


	};

})(Modernizr);