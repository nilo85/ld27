var globals,
	Adrenalin;

(function () {
	'use strict';


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
			this.container.style.webkitTransform = this.container.style.transform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		}


	};

})();