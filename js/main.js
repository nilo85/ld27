(function (document, window, Math, undefined) {
	'use strict';

	$(document).ready(function () {
		var game = new Game();

		game.loadLevel(0);
		game.start();
	});

})(document, window, Math);