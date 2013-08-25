var globals,
	Bomb;
(function (document, undefined) {
	'use strict';

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
			if(this.exploaded) {
				this.container.style.webkitTransform = this.container.style.transform = '';
				return;
			}

			this.container.style.webkitTransform = this.container.style.transform = 'translate3d(' + this.position.x + 'px, ' + -this.position.y + 'px, 0px)';
		},

		explode: function () {
			this.exploaded = true;

			this.container.style.left = this.position.x - 320 + 'px';
			this.container.style.top = -this.position.y + 320 + 'px';


			this.container.className= 'bomb exploaded';
			
			this.update();

		}

	};

})(document);