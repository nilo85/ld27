var Level,
	Player,
	Platform;

(function (RNG, Math, Number, document, window, undefined){
	'use strict';

	var KEYBOARD_MAPPING = {
		MOVE_LEFT: 37,
		MOVE_RIGHT: 39,
		JUMP: 32
	};

	Level = function (seed, scale) {

		this.rng = new RNG(seed);

		this.container = undefined;
		this.player = undefined;



		this.createContainer();

		this.floor = this.createPlatform('floor', this.rng.uniform());
		this.background = this.createPlatform('background', this.rng.uniform());


		this.createPlayer();

		this.container.style.height = Math.max(this.floor.height, this.background.height) + 'px';

		this.reset();



	};

	Level.prototype =  {


		createContainer: function () {
			this.container = document.createElement('div');
			this.container.className = 'level';
		},

		createPlayer: function () {
			this.player = new Player();
			this.container.appendChild(this.player.container);
		},

		reset: function () {
			var startX = this.rng.random(50,200);

			this.player.reset();
			this.player.setPosition(startX, this.getY(startX, Number.MAX_VALUE) + 200);			
		},

		getY: function (x, fromY) {
			var	y = Number.MIN_VALUE,
				floorY = this.floor.getY(x);

			if (floorY !== undefined && floorY <= fromY) {
				y = Math.max(y, floorY);
			}

			return  y;
		},

		createPlatform: function (type, seed) {
			var platform = new Platform(type, seed);
			this.container.appendChild(platform.container);

			return platform;
		},


		start: function () {
			var level = this;

			this.stop();

			window.addEventListener();
			window.setInterval(function () {
				level.update();
			}, 33);
			this.registerKeyListeners();
		},

		stop: function() {
			if(this.intervalId !== undefined) {
				window.clearInterval(this.intervalId);
				this.intervalId = undefined;
			}
			this.unregisterKeyListeners();

		},

		registerKeyListeners: function () {
			var pressedKeys = this.pressedKeys = {};

			this.unregisterKeyListeners();

			this.onKeyDownListener = function (event) {
				pressedKeys[event.keyCode] = true;
			};

			this.onKeyUpListener = function (event) {
				delete pressedKeys[event.keyCode];
			};


			window.addEventListener('keydown', this.onKeyDownListener);
			window.addEventListener('keyup', this.onKeyUpListener);

		},
		unregisterKeyListeners: function () {
			if(this.onKeyDownListener !== undefined) {
				window.removeEventListener('keydown', this.onKeyDownListener);
			}
			if(this.onKeyUpListener !== undefined) {
				window.removeEventListener('keyup', this.onKeyUpListener);
			}
		},


		update: function() {


			//this.player.setPosition(this.rng.random(0,100), 0)
		}

	}

})(RNG, Math, Number, document, window);