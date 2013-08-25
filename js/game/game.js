var globals,
	Game,
	Level,
	Player,
	RNG;

(function ($, window, document, undefined) {
	'use strict';

	var levels = [
		{name: 'Level 1', seed: 'level1', easiness: 5},
		{name: 'Level 2', seed: 'level2', easiness: 4.5},
		{name: 'Level 3', seed: 'level3', easiness: 4},
		{name: 'Level 4', seed: 'level4', easiness: 3.5},
		{name: 'Level 5', seed: 'level5', easiness: 3},
		{name: 'Level 6', seed: 'level6', easiness: 2.5},
		{name: 'Level 7', seed: 'level7', easiness: 2},
		{name: 'Level 8', seed: 'level8', easiness: 1.5},
		{name: 'Level 9', seed: 'level9', easiness: 1}
		
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
				this.level.stop();
				this.container.removeChild(this.level.container);
				this.level = undefined;
			}
		},

		loadLevel: function (level) {
			var game = this;

			this.unloadLevel();
			this.level = new Level(levels[level].seed, levels[level].easiness);

			this.level.setCompleteCallback(function (score) {
				game.onComplete(level, score)
			});

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

		onComplete: function (level) {
			var nextLevel = level + 1;

			this.loadLevel(nextLevel);
			this.start();
		}

	};

})(jQuery, window, document);