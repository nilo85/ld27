var globals,
	Game,
	Level,
	Player,
	RNG;

(function ($, window, document, undefined) {
	'use strict';

	var levels = [
		{seed: 'level1', easiness: 2.0},
		{seed: 'level2', easiness: 1.9},
		{seed: 'level3', easiness: 1.8},
		{seed: 'level4', easiness: 1.7},
		{seed: 'level5', easiness: 1.6},
		{seed: 'level6', easiness: 1.5},
		{seed: 'level7', easiness: 1.4},
		{seed: 'level8', easiness: 1.3},
		{seed: 'level9', easiness: 1.2},
		{seed: 'level10', easiness: 1.1},
		{seed: 'level11', easiness: 1.0},
		
	];

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

		},

		unloadLevel: function () {
			if(this.level !== undefined) {
				this.container.removeChild(this.level.container);
				this.level = undefined;
			}
		},

		loadLevel: function (level) {
			this.unloadLevel();
			this.level = new Level(levels[level].seed, levels[level].easiness);

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



	};

})(jQuery, window, document);