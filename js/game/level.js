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

		this.width = this.rng.random(320*10,320*40);

		this.createContainer();

		this.floor = this.createPlatform(this.width, 'floor', this.rng.uniform());
		this.background = this.createPlatform(this.width, 'background', this.rng.uniform());


		this.createPlayer();

		this.height = Math.max(this.floor.height, this.background.height);
		
		this.container.style.height = this.height + 'px';
		this.container.style.width = this.width + 'px';

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

		createPlatform: function (width, type, seed) {
			var platform = new Platform(width, type, seed);
			this.container.appendChild(platform.container);

			return platform;
		},


		start: function () {
			var level = this;

			this.stop();

			window.addEventListener();
			window.setInterval(function () {
				level.update();
			}, 16);
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
			var prevTime = this.time || Date.now();

			this.time = Date.now();
			


			this.player.update(this, this.time - prevTime, {
				MOVE_LEFT: this.pressedKeys[KEYBOARD_MAPPING.MOVE_LEFT],
				MOVE_RIGHT: this.pressedKeys[KEYBOARD_MAPPING.MOVE_RIGHT],
				JUMP:  this.pressedKeys[KEYBOARD_MAPPING.JUMP]
			});

			this.container.style.webkitTransform = 'translate3d(' + (-this.player.position.x + 160) + 'px, ' + (this.player.position.y-this.height + 170) + 'px, 0px)';
			//this.player.setPosition(this.rng.random(0,100), 0)
		}

	}

})(RNG, Math, Number, document, window);