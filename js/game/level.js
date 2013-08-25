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
		this.levelContainer = undefined;
		this.hudContainer = undefined;

		this.hudClock = undefined; 

		this.player = undefined;
		this.timeMultiplier = undefined;
		this.timeLeft = undefined;

		this.width = this.rng.random(320*10,320*40);

		this.createContainers();

		this.createHud();

		this.floor = this.createPlatform(this.width, 'floor', this.rng.uniform());
		this.background = this.createPlatform(this.width, 'background', this.rng.uniform());


		this.createPlayer();

		this.height = Math.max(this.floor.height, this.background.height);
		
		this.levelContainer.style.height = this.height + 'px';
		this.levelContainer.style.width = this.width + 'px';

		this.reset();



	};

	Level.prototype =  {


		createContainers: function () {
			this.container = document.createElement('div');
			this.container.className = 'viewport';

			this.levelContainer = document.createElement('div');
			this.levelContainer.className = 'level';
			this.container.appendChild(this.levelContainer);

		},

		createHud: function () {
			this.hudContainer = document.createElement('div');
			this.hudContainer.className = 'hud';
			this.container.appendChild(this.hudContainer);


			this.hudClock = document.createElement('div');
			this.hudClock.className = 'clock';
			this.hudContainer.appendChild(this.hudClock);
		},

		createPlayer: function () {
			this.player = new Player();
			this.levelContainer.appendChild(this.player.container);
		},

		reset: function () {
			var startX = this.rng.random(50,200);

			this.player.reset();
			this.player.setPosition(startX, this.getY(startX, Number.MAX_VALUE));			
			this.timeMultiplier = 1;
			this.timeLeft = 10000;
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
			this.levelContainer.appendChild(platform.container);

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
			var prevTime = this.time || Date.now(),
				deltaTime;

			this.time = Date.now();
			
			deltaTime = (this.time - prevTime) * this.timeMultiplier;

			this.timeLeft -= deltaTime;

			if(this.timeLeft < 0) {
				this.reset();
				return;
			}


			this.updatePlayer(deltaTime);
			this.updateClock(deltaTime);
			this.updateLevelTranslation(deltaTime);

			//this.player.setPosition(this.rng.random(0,100), 0)
		},

		updatePlayer: function (deltaTime) {
			this.player.update(this, deltaTime, {
				MOVE_LEFT: this.pressedKeys[KEYBOARD_MAPPING.MOVE_LEFT],
				MOVE_RIGHT: this.pressedKeys[KEYBOARD_MAPPING.MOVE_RIGHT],
				JUMP:  this.pressedKeys[KEYBOARD_MAPPING.JUMP]
			});
		},

		updateClock: function (deltaTime) {
			this.hudClock.innerHTML = (this.timeLeft/1000).toFixed(1);			
		},

		updateLevelTranslation: function (deltaTime) {
			this.levelContainer.style.webkitTransform = 'translate3d(' + (-this.player.position.x + 160) + 'px, ' + (this.player.position.y-this.height + 170) + 'px, 0px)';			
		}

	}

})(RNG, Math, Number, document, window);