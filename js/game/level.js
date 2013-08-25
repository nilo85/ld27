var globals,
	Level,
	Player,
	Platform;

(function (RNG, Math, Number, document, window, undefined){
	'use strict';

	Level = function (seed, easiness, name) {
		
		this.easiness = easiness;
		this.name = name;

		this.rng = new RNG(seed);

		this.container = undefined;
		this.levelContainer = undefined;
		this.hudContainer = undefined;

		this.hudClock = undefined; 
		this.hudClockLevel = undefined;
		this.hudClockLevelBar = undefined;

		this.hudAdrenalinLevel = undefined;
		this.hudAdrenalinLevelBar = undefined;
		this.hudAdrenalinLevelBarProgress = undefined;

		this.hudMessage = undefined; 

		this.player = undefined;
		this.bomb = undefined;
		this.goal = undefined;
		
		this.bombTimeLeft = undefined;
		this.adrenalinTimeLeft = undefined;
		this.messageTimeLeft = undefined;

		this.score = undefined;
		this.viewportPosition = undefined;
		this.intervalId = undefined;
		this.hasFailed = undefined;

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
		this.adrenalinShots = this.createAdrenalinShots();
		
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

			return (possibleWidth / this.easiness * 2) + (globals.SCREEN_WIDTH*2);
		},

		createAdrenalinShots: function () {
			var adrenalinShots = [],
				adrenalin,
				offset = globals.SCREEN_WIDTH * 1.4,
				y,
				x = this.rng.random(offset, offset + (globals.SCREEN_WIDTH * 2));	

			while (x < this.width - offset) {

				y = this.getY(x, Number.MAX_VALUE) + this.rng.random(10, 200);

				adrenalin = new Adrenalin(x, y, this.rng.uniform());
				this.levelContainer.appendChild(adrenalin.container);

				adrenalinShots.push(adrenalin);

				x += this.rng.random(globals.SCREEN_WIDTH * 2, globals.SCREEN_WIDTH * 8);	
			}

			return adrenalinShots;
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

			this.hudClockLevel = document.createElement('div');
			this.hudClock.appendChild(this.hudClockLevel);

			this.hudClockLevelBar = document.createElement('div');
			this.hudClockLevel.appendChild(this.hudClockLevelBar);

			this.hudAdrenalinLevel = document.createElement('div');
			this.hudAdrenalinLevel.className = 'adrenalin-level';
			this.hudContainer.appendChild(this.hudAdrenalinLevel);

			this.hudAdrenalinLevelBar = document.createElement('div');
			this.hudAdrenalinLevel.appendChild(this.hudAdrenalinLevelBar);

			this.hudAdrenalinLevelBarProgress = document.createElement('div');
			this.hudAdrenalinLevelBar.appendChild(this.hudAdrenalinLevelBarProgress);

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
			this.bombTimeLeft = globals.START_TIME;
			this.adrenalinTimeLeft = 0;
			this.messageTimeLeft = 0;
		
			this.viewportPosition = {x: 0, y: 0};
			this.score = 0;
			this.hasFailed = false;
		},

		showMessage: function (message) {
			this.hideMessage();

			this.messageTimeLeft = globals.MESSAGE_TIME;

			this.hudMessage = document.createElement('div');
			this.hudMessage.className = 'message';
			this.hudMessage.appendChild(document.createTextNode(message));
			this.hudContainer.appendChild(this.hudMessage);

		},

		hideMessage: function () {
			if (this.hudMessage !== undefined) {
				this.hudContainer.removeChild(this.hudMessage);
				this.hudMessage = undefined;
			}
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

			this.showMessage(this.name + ': RUN!!!');
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

		fail: function (message, delay) {
			var level = this;

			this.hasFailed = true;
			if(delay !== undefined) {
				window.setTimeout(function () {
					level.fail(message);
				}, delay);
				return;
			}

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
			


			deltaTime = (this.time - prevTime);

			if (this.adrenalinTimeLeft > 0) {
				deltaTime /= 2;
			}

			this.bombTimeLeft -= deltaTime;
			this.adrenalinTimeLeft -= deltaTime;
			this.messageTimeLeft -= deltaTime;

			if (this.adrenalinTimeLeft < 0) {
				this.adrenalinTimeLeft = 0;
			}

			if (this.hudMessage !== undefined && this.messageTimeLeft < 0) {
				this.hideMessage();
			}

			if (this.hasFailed) {
				return;
			}

		
			if(this.player.position.x === this.goal.position.x) {
				this.complete();
				return;
			}

			if(this.bombTimeLeft < 0) {
				this.container.className = 'viewport exploaded';
				level.fail('You did not reach the safe zone before the bomb exploaded, please try it again, but this time, please HURRY UP!', 2000);
				return;
			}

			if (this.isPlayerCollidingWithBadger()) {
				level.fail('You ran into an angry rabies badger, avoid them!');
				return;
			}

			this.updatePlayer(deltaTime);

			this.consumeCollidingAdrenalin();

			this.updateClock(deltaTime);
			this.updateAdrenalin(deltaTime);
			this.updateLevelTranslation(deltaTime);


		},

		consumeCollidingAdrenalin: function () {
			var i,
				adrenalin,
				hitboxWidth = 53,
				hitboxHeight = 68;

			for (i = 0; i < this.adrenalinShots.length; i++) {
				adrenalin = this.adrenalinShots[i];

				if(
					adrenalin.position.x - (hitboxWidth/2)  <= this.player.position.x &&
					adrenalin.position.x + (hitboxWidth/2)  >= this.player.position.x &&

					adrenalin.position.y >= this.player.position.y &&
					adrenalin.position.y - hitboxHeight <= this.player.position.y) {

					this.adrenalinTimeLeft = globals.ADRENALIN_TIME;

					this.adrenalinShots.splice(i, 1);
					this.levelContainer.removeChild(adrenalin.container);

					this.showMessage('Adrenalin makes time slow and movement fast, gravity is untouched, YEAHAA!');

					return;
				}

			}	
		},

		isPlayerCollidingWithBadger: function () {
			var i,
				badger,
				badgetHitboxHeight = 32,
				badgetHitboxWidth = 32;


			for (i = 0; i < this.badgers.length; i++) {
				badger = this.badgers[i];

				if(
					badger.position.x - (badgetHitboxWidth/2)  <= this.player.position.x &&
					badger.position.x + (badgetHitboxWidth/2)  >= this.player.position.x &&

					badger.position.y + badgetHitboxHeight >= this.player.position.y &&
					badger.position.y <= this.player.position.y) {

					return true;
				}

			}
			return false;
		},

		updatePlayer: function (deltaTime) {
			this.player.update(this, deltaTime, this.adrenalinTimeLeft > 0, {
				MOVE_LEFT: 	this.pressedKeys[globals.KEYBOARD_MAPPING.MOVE_LEFT],
				MOVE_RIGHT: this.pressedKeys[globals.KEYBOARD_MAPPING.MOVE_RIGHT],
				JUMP:  		this.pressedKeys[globals.KEYBOARD_MAPPING.JUMP]
			});
		},

		updateClock: function (deltaTime) {
			this.hudClockLevelBar.style.width = (this.bombTimeLeft / globals.START_TIME * 100).toFixed(0) + '%';			
		},
		updateAdrenalin: function (deltaTime) {
			this.hudAdrenalinLevelBarProgress.style.width = (this.adrenalinTimeLeft / globals.ADRENALIN_TIME * 100).toFixed(0) + '%';			
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