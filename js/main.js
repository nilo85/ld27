(function (window, Math, undefined) {
	'use strict';

	$(function () {
		var game = new Game();

		game.loadLevel(1);

		game.start();
	});

})(window, Math);