var Player,
	RNG;

(function (RNG, Math, document){
	'use strict';
	
	Player = function () {

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
			// TODO: support other browsers
			this.container.style.webkitTransform = 'translate3d(-50%, -100%, 0) translate3d(' + x + 'px, ' + -y + 'px, 0)'
			this.container.style.transform = 'translate3d(-50%, -100%, 0) translate3d(' + x + 'px, ' + -y + 'px, 0)'
		}
	}

})(RNG, Math, document);