var Game,
	Level,
	Player,
	RNG;

(function ($, window, document, undefined) {
	'use strict';

	Game = function () {

		this.container = undefined;

		this.player = undefined;
		this.level = undefined;

		this.create();
	};

	Game.prototype = {

		create: function () {
			var game = this;

			this.container = document.createElement('div');
			this.container.className = 'game';
			document.body.appendChild(this.container);

			this.rescale();
			$(window).resize(function () {
				game.rescale();
			});
		},

		unloadLevel: function () {
			if(this.level !== undefined) {
				this.container.removeChild(this.level.container);
				this.level = undefined;
			}
		},

		loadLevel: function (seed) {
			this.unloadLevel();
			this.level = new Level(seed, this.scale);

			this.container.appendChild(this.level.container);
		},

		start: function () {
			if(this.level !== undefined) {
				this.level.reset();
				this.level.start();
			}
		},

		stop: function () {
			if(this.level !== undefined) {
				this.level.stop();
			}
		},

		rescale: function () {
			var scale = window.innerWidth / 320;
			this.container.style.webkitTransform = 'scale3d(' + scale + ', ' + scale + ', 1)';
		},


	};

})(jQuery, window, document);