var globals,
	Player,
	RNG;

(function (RNG, Math, document, Number, Modernizr, undefined){
	'use strict';
	
	var transformProp = Modernizr.prefixed('transform');

	Player = function () {

		this.totalTime = 0;

		this.position =  {
			x: 0,
			y: 0
		},
		this.speed = {
			x: 0,
			y: 0
		}



		this.container = undefined;
		this.create();
	};

	Player.prototype = {
		create: function () {
			this.container = document.createElement('div');
			this.container.className = 'player';
		},

		reset: function () {

		},

		setPosition: function (x, y) {
			this.position = {x: x, y: y};
			this.update();
		},

		update: function (level, time, haveAdrenalin, state) {
			if (isNaN(time)) {
				return;
			}

			
			this.totalTime += time;

			var maxSpeed = haveAdrenalin ? globals.RUN_SPEED * 2 : globals.RUN_SPEED,
				transform = '',
				prevX = this.position.x,
				prevY = this.position.y,
				prevGroundY = level.getY(prevX, Number.MAX_VALUE),
				x,
				y,
				groundY;

			if (prevGroundY === prevY && state.JUMP) {
				this.speed.y = globals.JUMP_SPEED;
			} else {
				this.speed.y -= globals.GRAVITY * time;
			}

			if (state.MOVE_LEFT) {
				this.speed.x -= 0.1*time;
			
			} else if (state.MOVE_RIGHT) {
				this.speed.x += globals.RUN_ACCELERATION * time;
			
			} else if (this.speed.x > 0) {
				this.speed.x -= globals.STOP_ACCELERATION * time;
				this.speed.x = Math.max(this.speed.x, 0);
			
			} else if (this.speed.x < 0) {
				this.speed.x += globals.STOP_ACCELERATION * time;
				this.speed.x = Math.min(this.speed.x, 0);
			}

			this.speed.x = Math.max(Math.min(this.speed.x, maxSpeed), -maxSpeed);

			x = prevX + this.speed.x * time,
			y = prevY + this.speed.y * time,
			groundY = level.getY(x, Number.MAX_VALUE);


			this.position.x = Math.min(level.width - globals.SCREEN_WIDTH, Math.max(globals.SCREEN_WIDTH, x)); 

			if(y < groundY) {
				this.speed.y = 0;
				this.position.y = groundY;
			} else {
				this.position.y = y;
			}

			if (this.speed.x !== 0) {
				this.container.style.webkitAnimationName = this.container.style.animationName = 'player-walking';
			} else {
				this.container.style.webkitAnimationName = this.container.style.animationName = 'player-standing';
			}
			
			transform += ' translate3d(' + this.position.x + 'px, ' + (-this.position.y) + 'px, 0)';
		
			if (this.speed.x < 0) {
				transform += ' scaleX(-1)';
			}

			this.container.style[transformProp] = transform;

		}

	}

})(RNG, Math, document, Number, Modernizr);
