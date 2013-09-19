var globals,
	Level,
	Player,
	Platform;

(function (RNG, Math, Number, document, window, Modernizr, undefined){
	'use strict';


	var	FLOOR_Z = 0,
		TREE_Z = 0,
		ADRENALIN_Z = 10,
		BADGER_Z = 10,
		BOMB_Z = 10,
		GOAL_Z = 10,
		PLAYER_Z = 10,
		BACKGROUND_1_Z = -100,
		BACKGROUND_2_Z = -200,
		BACKGROUND_3_Z = -300

	Level = function (seed, easiness, name) {
		
		this.easiness = easiness;
		this.name = name;

		this.rng = new RNG(seed);

		this.renderer = undefined;
		this.camera = undefined;
		this.scene = undefined;

		this.player = undefined;
		this.bomb = undefined;
		this.goal = undefined;
		
		this.bombTimeLeft = undefined;
		this.adrenalinTimeLeft = undefined;
		this.messageTimeLeft = undefined;

		this.score = undefined;
		this.intervalId = undefined;
		this.hasFailed = undefined;

		this.width = this.calculateLevelWidth();

		this.createContainer();

//		this.createHud();

		this.background3 = this.createPlatform(this.width, BACKGROUND_3_Z, 'background3', this.rng.uniform(), 650);
		this.background2 = this.createPlatform(this.width, BACKGROUND_2_Z, 'background2', this.rng.uniform(), 600);
		this.background1 = this.createPlatform(this.width, BACKGROUND_1_Z, 'background1', this.rng.uniform(), 550);
		this.floor = this.createPlatform(this.width, FLOOR_Z, 'floor', this.rng.uniform(), 500);

		this.trees = this.createTrees();		
	
		this.adrenalinShots = this.createAdrenalinShots();
		this.badgers = this.createBadgers();
		
		this.createPlayer();
		this.createBomb();
		
		this.createGoal();

		this.height = Math.max(Math.max(Math.max(this.floor.height, this.background1.height), this.background2.height), this.background3.height);
/*		

		this.levelContainer.style.height = this.height + 'px';
		this.levelContainer.style.width = this.width + 'px';
*/

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

				// DUMMY RANDOM TO PRESERVE SEED
				this.rng.uniform();

				adrenalin = new Adrenalin(x, y, ADRENALIN_Z);
				this.scene.add(adrenalin.mesh);

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

				badger = new Badger(x, y, BADGER_Z, this.rng.uniform());
				this.scene.add(badger.mesh);

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

				tree = new Tree(x, y, TREE_Z);
				
				this.scene.add(tree.mesh);

				trees.push(tree);

				x+= this.rng.random(globals.SCREEN_WIDTH / 3, globals.SCREEN_WIDTH * 2);
			}

			return trees;
		},

		createBomb: function () {
			var bombX = globals.SCREEN_WIDTH,
				bombY = this.getY(bombX, Number.MAX_VALUE);

			this.bomb = new Bomb(bombX, bombY, BOMB_Z);
			this.scene.add(this.bomb.mesh);
		},

		createGoal: function () {
			var goalX = this.width - globals.SCREEN_WIDTH,
				goalY = this.getY(goalX, Number.MAX_VALUE);

			this.goal = new Goal(goalX, goalY, GOAL_Z);
			this.scene.add(this.goal.mesh);
		},

		createContainer: function () {
			this.container = document.createElement('div');
			this.container.className = 'viewport';

			this.renderer = new THREE.WebGLRenderer({
				antialias : true
			});
			this.renderer.setClearColorHex( 0xbcccff, 1 );
	
			this.renderer.setSize(globals.SCREEN_WIDTH, globals.SCREEN_HEIGHT);

			this.camera = new THREE.PerspectiveCamera(
				45, globals.SCREEN_WIDTH / globals.SCREEN_HEIGHT,
				0.1, 10000);
			this.camera.position.z = 800;
			this.camera.position.y = 0;
			this.camera.position.x = 0;


			this.scene = new THREE.Scene();

			this.container.appendChild(this.renderer.domElement);
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

		createPlayer: function () {
			this.player = new Player(0, 0, PLAYER_Z);
			this.scene.add(this.player.mesh);
		},

		reset: function () {
			var startX = globals.SCREEN_WIDTH * 1.2;

			this.player.reset();
			this.player.setPosition(startX, this.getY(startX, Number.MAX_VALUE), PLAYER_Z);			
			this.bombTimeLeft = globals.START_TIME;
			this.adrenalinTimeLeft = 0;
			this.messageTimeLeft = 0;
		

			this.score = 0;
			this.hasFailed = false;
		},

		showMessage: function (message) {
			return;
			// TODO
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

		createPlatform: function (width, z, type, seed, baseHeight) {
			var platform = new Platform(width, z, type, seed, baseHeight);

			this.scene.add(platform.mesh);

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
				//this.container.className = 'viewport exploaded';
				level.fail('You did not reach the safe zone before the bomb exploaded, please try it again, but this time, please HURRY UP!', 2000);
				return;
			}

			if (this.isPlayerCollidingWithBadger()) {
				level.fail('You ran into an angry rabies badger, avoid them!');
				return;
			}

			this.updatePlayer(deltaTime);

			this.consumeCollidingAdrenalin();
/*
			this.updateClock(deltaTime);
			this.updateAdrenalin(deltaTime);
*/
			this.updateCamera(deltaTime);

			this.renderer.render(this.scene, this.camera);
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
					this.scene.remove(adrenalin.mesh);

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

		updateCamera: function (deltaTime) {
			
			var centerX,
				minX,
				maxX,
				minY,
				maxY,
				groundY;

			this.camera.position.y = this.player.position.y;
			this.camera.position.x = this.player.position.x;


			return;

			centerX = this.player.position.x;
			groundY = this.getY(centerX, Number.MAX_VALUE);

			maxX = centerX - globals.SCREEN_WIDTH / 4;
			minX = centerX - globals.SCREEN_WIDTH / 2;

			this.camera.position.x = Math.min(maxX, this.camera.position.x);
			this.camera.position.x = Math.max(minX, this.camera.position.x);

			minY = this.player.position.y + globals.SCREEN_HEIGHT / 3;
			maxY = this.player.position.y + globals.SCREEN_HEIGHT / 1.33;

			this.camera.position.y = Math.max(minY, this.camera.position.y);
			this.camera.position.y = Math.min(maxY, this.camera.position.y);

		}


	}

})(RNG, Math, Number, document, window, Modernizr);