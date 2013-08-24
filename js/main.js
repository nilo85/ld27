(function (window, Math, undefined) {
	'use strict';

	$(function () {
		var game = new Game();

		game.loadLevel('level1');

		game.start();
	});

})(window, Math);