(function (window, Math, undefined) {
	'use strict';

	$(function () {
		var game = new Game();

		game.loadLevel('level' + Math.random());

		game.start();
	});

})(window, Math);