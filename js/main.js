(function (document, window, Math, undefined) {
	'use strict';

	$(document).ready(function () {
		var game = new Game();

		game.loadLevel(1);

		game.start();
	});

})(document, window, Math);