var globals,
	Level,
	Player,
	Platform;

(function (RNG, Math, Number, document, window, undefined){
	'use strict';
var counter = 0;
	Level = function (seed, easiness) {
		
		this.easiness = easiness;

		this.rng = new RNG(seed);

		this.container = undefined;
		this.levelContainer = undefined;
		this.hudContainer = undefined;

		this.hudClock = undefined; 
		this.hudRunBubble = undefined; 

		this.player = undefined;
		this.bomb = undefined;
		this.goal = undefined;
		this.timeMultiplier = undefined;
		this.timeLeft = undefined;
		this.score = undefined;
		this.viewportPosition = undefined;
		this.intervalId = undefined;

		this.width = this.calculateLevelWidth();

		this.createContainer();
		this.createSky();
		this.createLevelContainer();
		this.createHud();

		this.background3 = this.createPlatform(this.width, 'background3', this.rng.uniform(), 650);
		this.background2 = this.createPlatform(this.width, 'background2', this.rng.uniform(), 600);
		this.background1 = this.createPlatform(this.width, 'background1', this.rng.uniform(), 550);
		this.floor = this.createPlatform(this.width, 'floor', this.rng.uniform(), 500);
		
		this.trees = this.createTrees();		
		
		this.createPlayer();
		this.badgers = this.createBadgers();
		this.createBomb();
		
		this.createGoal();

		this.height = Math.max(Math.max(Math.max(this.floor.height, this.background1.height), this.background2.height), this.background3.height);
		
		this.levelContainer.style.height = this.height + 'px';
		this.levelContainer.style.width = this.width + 'px';

		this.onComplete = undefined;
		this.onFailure = undefined;

		this.reset();



	};

	Level.prototype =  {

		setCompleteCallback: function (callback) {
			this.onComplete = callback;
		},

		setFailureCallback: function (callback) {
			this.onFailure = callback;
		},

		calculateLevelWidth: function () {
			var possibleWidth = globals.RUN_SPEED * globals.START_TIME;

			return (possibleWidth / this.easiness) + (globals.SCREEN_WIDTH*2);
		},

		createBadgers: function () {
			var badgers = [],
				badger,
				offset = globals.SCREEN_WIDTH * 1.4,
				y,
				x = this.rng.random(offset, offset + (globals.SCREEN_WIDTH * this.easiness/4));	

			while (x < this.width - offset) {

				y = this.getY(x, Number.MAX_VALUE);

				badger = new Badger(x, y, this.rng.uniform());
				this.levelContainer.appendChild(badger.container);

				badgers.push(badger);

				x += this.rng.random((globals.SCREEN_WIDTH/10) * this.easiness, (globals.SCREEN_WIDTH/2) * this.easiness);	
			}

			return badgers;
		},

		createTrees: function () {
			var	trees = [],
				tree,
				y,
				x = this.rng.random(globals.SCREEN_WIDTH / 3, globals.SCREEN_WIDTH * 2);

			while (x < this.width) {

				y = this.getY(x, Number.MAX_VALUE);

				tree = new Tree(x, y);
				this.levelContainer.insertBefore(tree.container, this.floor.container);
				trees.push(tree);

				x+= this.rng.random(globals.SCREEN_WIDTH / 3, globals.SCREEN_WIDTH * 2);
			}

			return trees;
		},

		createBomb: function () {
			var bombX = globals.SCREEN_WIDTH,
				bombY = this.getY(bombX, Number.MAX_VALUE);

			this.bomb = new Bomb(bombX, bombY);
			this.levelContainer.appendChild(this.bomb.container);
		},

		createGoal: function () {
			var goalX = this.width - globals.SCREEN_WIDTH,
				goalY = this.getY(goalX, Number.MAX_VALUE);

			this.goal = new Goal(goalX, goalY);
			this.levelContainer.appendChild(this.goal.container);
		},

		createContainer: function () {
			this.container = document.createElement('div');
			this.container.className = 'viewport';


		},

		createLevelContainer: function () {
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

			this.hudRunBubble = document.createElement('div');
			this.hudRunBubble.className = 'runBubble';
			this.hudContainer.appendChild(this.hudRunBubble);

		},

		createSky: function () {
			this.sky = document.createElement('div');
			this.sky.className = 'sky';
			this.container.appendChild(this.sky);
		},

		createPlayer: function () {
			this.player = new Player();
			this.levelContainer.appendChild(this.player.container);
		},

		reset: function () {
			var startX = globals.SCREEN_WIDTH * 1.2;

			this.player.reset();
			this.player.setPosition(startX, this.getY(startX, Number.MAX_VALUE));			
			this.timeMultiplier = 1;
			this.timeLeft = globals.START_TIME;
			this.viewportPosition = {x: 0, y: 0};
			this.score = 0;
		},

		getY: function (x, fromY) {
			var	y = Number.MIN_VALUE,
				floorY = this.floor.getY(x);

			if (floorY !== undefined && floorY <= fromY) {
				y = Math.max(y, floorY);
			}

			return  y;
		},

		createPlatform: function (width, type, seed, baseHeight) {
			var platform = new Platform(width, type, seed, baseHeight);
			this.levelContainer.appendChild(platform.container, baseHeight);

			return platform;
		},


		start: function () {
			var level = this;

			this.stop();

			this.intervalId = window.setInterval(function () {
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

		complete: function () {
			this.stop();
			if (this.onComplete !== undefined) {
				this.onComplete(this.score);
			}
		},

		fail: function (message) {
			this.stop();
			if (this.onFailure !== undefined) {
				this.onFailure(this.score, message);
			}
		},


		update: function() {
			var prevTime = this.time || Date.now(),
				deltaTime,
				level = this;

			this.time = Date.now();
			
			deltaTime = (this.time - prevTime) * this.timeMultiplier;

			this.timeLeft -= deltaTime;

			if(this.hudRunBubble !== undefined && this.timeLeft < globals.START_TIME - 500) {
				this.hudContainer.removeChild(this.hudRunBubble);
				this.hudRunBubble = undefined;
			}

			if(this.player.position.x === this.goal.position.x) {
				this.complete();
				return;
			}

			if(this.timeLeft < 0) {
				this.bomb.explode();
				window.setTimeout(function () {
					level.fail('The bomb exploaded on you! You need to be faster.');
				}, 4000);
				return;
			}

			if (this.isPlayerCollidingWithBadger()) {
				level.fail('You ran into an angry badger, avoid them!');
				return;
			}

			this.updatePlayer(deltaTime);
			this.updateClock(deltaTime);
			this.updateLevelTranslation(deltaTime);


		},

		isPlayerCollidingWithBadger: function () {
			var i,
				badger,
				badgetHitboxHeight = 32,
				badgetHitboxWidth = 32;


			for (i = 0; i < this.badgers.length; i++) {
				badger = this.badgers[i];

				if(this.timeLeft < 100) {
					debugger;
				}

				if(
					badger.position.y + badgetHitboxHeight >= this.player.position.y &&
					badger.position.y <= this.player.position.y &&

					badger.position.x - (badgetHitboxWidth/2)  <= this.player.position.x &&
					badger.position.x + (badgetHitboxWidth/2)  >= this.player.position.x  ) {

					return true;
				}

			}
			return false;
		},

		updatePlayer: function (deltaTime) {
			this.player.update(this, deltaTime, {
				MOVE_LEFT: 	this.pressedKeys[globals.KEYBOARD_MAPPING.MOVE_LEFT],
				MOVE_RIGHT: this.pressedKeys[globals.KEYBOARD_MAPPING.MOVE_RIGHT],
				JUMP:  		this.pressedKeys[globals.KEYBOARD_MAPPING.JUMP]
			});
		},

		updateClock: function (deltaTime) {
			this.hudClock.innerHTML = (this.timeLeft/1000).toFixed(1);			
		},

		updateLevelTranslation: function (deltaTime) {
			
			var centerX,
				minX,
				maxX,
				minY,
				maxY,
				groundY;

			centerX = this.player.position.x;
			groundY = this.getY(centerX, Number.MAX_VALUE);

			maxX = centerX - globals.SCREEN_WIDTH / 4;
			minX = centerX - globals.SCREEN_WIDTH / 2;

			this.viewportPosition.x = Math.min(maxX, this.viewportPosition.x);
			this.viewportPosition.x = Math.max(minX, this.viewportPosition.x);

			maxY = this.player.position.y - globals.SCREEN_HEIGHT / 3;
			minY = this.player.position.y - globals.SCREEN_HEIGHT / 1.33;

			this.viewportPosition.y = Math.max(minY, this.viewportPosition.y);
			this.viewportPosition.y = Math.min(maxY, this.viewportPosition.y);


			this.levelContainer.style.webkitTransform = this.levelContainer.style.transform = 'translate3d(' + -this.viewportPosition.x.toFixed(2) + 'px, ' + this.viewportPosition.y.toFixed(2) + 'px, 0px)';			
		}

	}

})(RNG, Math, Number, document, window);