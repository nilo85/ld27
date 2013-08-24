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

			this.speed.y -= 0.00982*time;
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

			this.speed.x = Math.min(this.speed.x, 1);
			this.speed.x = Math.max(this.speed.x, -1);

			var prevY = this.position.y,
				y = prevY + this.speed.y * time,
				prevX = this.position.x,
				x = prevX + this.speed.x * time;




			this.position.y = Math.max(y, level.getY(this.position.x, 999999));
			this.position.x = x; 


			this.container.style.webkitTransform = 'translate3d(' + this.position.x + 'px, ' + (-this.position.y) + 'px, 0)'
		},

	}

})(RNG, Math, document);