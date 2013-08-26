var globals,
	Goal;

(function (document, Modernizr, undefined) {
	'use strict';

	var transformProp = Modernizr.prefixed('transform');

	Goal = function (x, y) {
		this.container = undefined;
		this.position = {x: x, y: y};
		this.create();
	};

	Goal.prototype = {
		create: function() {
			this.container = document.createElement('div');
			this.container.className = 'goal';						
			this.update();
		},

		update: function () {
			this.container.style[transformProp] = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}
	};

})(document, Modernizr);