var Player,
	RNG;

(function (RNG, Math, document){
	'use strict';
	
	Player = function () {

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

		update: function (level, time, state) {
			if (isNaN(time)) {
				return;
			}

			var prevX = this.position.x,
				prevY = this.position.y,
				prevGroundY = level.getY(prevX, 999999),
				x,
				y,
				groundY;

			if (prevGroundY === prevY && state.JUMP) {
				this.speed.y = 1;
			} else {
				this.speed.y -= 0.00982*time;
			}
			if (state.MOVE_LEFT) {
				this.speed.x -= 0.1*time;
			} else if (state.MOVE_RIGHT) {
				this.speed.x += 0.1*time;
			} else if (this.speed.x > 0) {
				this.speed.x -= 0.1*time;
				this.speed.x = Math.max(this.speed.x, 0);
			} else if (this.speed.x < 0) {
				this.speed.x += 0.1*time;
				this.speed.x = Math.min(this.speed.x, 0);
			}

			this.speed.x = Math.max(Math.min(this.speed.x, 1), -1);

				x = prevX + this.speed.x * time,
				y = prevY + this.speed.y * time,
				groundY = level.getY(x, 999999);




			this.position.x = x; 
			this.position.y = Math.max(y, groundY);



			this.container.style.webkitTransform = 'translate3d(' + this.position.x + 'px, ' + (-this.position.y) + 'px, 0)'
		},

	}

})(RNG, Math, document);