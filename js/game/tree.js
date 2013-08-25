var globals,
	Tree;

(function (document, undefined) {
	'use strict';

	Tree = function (x, y) {
		this.container = undefined;
		this.position = {x: x, y: y};

		this.create();
	};

	Tree.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'tree';
			this.update();
		},

		update: function () {
			this.container.style.webkitTransform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}
	};

})(document);