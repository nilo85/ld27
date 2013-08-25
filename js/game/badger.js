var globals,
	Badger;

(function () {
	'use strict';

	Badger = function (x, y, rotation) {
		this.container = undefined;
		this.position = {x: x, y: y, rotation: rotation};

		this.create();

	};

	Badger.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'badger';
			this.update();
		},

		update: function () {
			this.container.style.webkitTransform = this.container.style.transform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px) rotateZ(' + this.position.rotation + 'deg)';
		}	
	};

})();