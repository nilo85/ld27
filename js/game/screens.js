var globals,
	GameOverScreen,
	GameCompletedScreen;

(function (document, window, undefined) {
	'use strict';

	GameOverScreen = function (message) {
		this.container = undefined;
		this.message = message;

		this.className = 'gameover';

		this.onComplete = undefined;

		this.create();
	};

	GameCompletedScreen = function (message) {
		this.container = undefined;
		this.message = message;

		this.className = 'gamecompleted';

		this.onComplete = undefined;

		this.create();
	};

	GameCompletedScreen.prototype = GameOverScreen.prototype = {
		create: function () {
			var thisScreen = this,
				keyUpListener = function () {
					console.log('keyup')
					window.removeEventListener('keyup', keyUpListener);
					if(thisScreen.onComplete !== undefined) {
						thisScreen.onComplete();
					}
				};

			this.container = document.createElement('div');
			this.container.className = this.className;
			


			this.container.appendChild(this.createTextDiv(this.message));
			this.container.appendChild(this.createTextDiv('Press any key to restart'));

			window.setTimeout(function () {
				window.addEventListener('keyup', keyUpListener);
			}, 200);
		},

		setCompleteCallback: function (callback) {
			this.onComplete = callback;
		},

		createTextDiv: function (text) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(text));
			return div;
		}
	};

})(document, window);