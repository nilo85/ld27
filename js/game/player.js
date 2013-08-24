var Player,
	RNG;

(function (RNG, Math, document){
	'use strict';
	
	Player = function () {

		this.position =  {
			x: 0,
			y: 0
		}

		this.container = undefined;
		this.create();
	};

	Player.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'player';
		},

		reset: function () {

		},

		setPosition: function (x, y) {
			this.position = {x: x, y: y};
			this.update();
		},

		update: function () {
			this.container.style.webkitTransform = 'translate3d(' + this.position.x + 'px, ' + (-this.position.y) + 'px, 0)'
		}
	}

})(RNG, Math, document);