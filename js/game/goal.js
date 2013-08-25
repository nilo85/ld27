var globals,
	Goal;

(function (document, undefined) {
	'use strict';

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
			this.container.style.webkitTransform = this.container.style.transform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}
	};

})(document);