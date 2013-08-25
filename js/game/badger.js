var globals,
	Badger;

(function () {
	'use strict';

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
			this.container.style.webkitAnimationDelay = this.container.style.animationDelay = this.delay + 's'; 
			this.update();
		},

		update: function () {
			this.container.style.webkitTransform = this.container.style.transform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}	
	};

})();