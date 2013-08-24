var Level,
	Player,
	Platform;

(function (RNG, Math, Number, document){
	'use strict';


	Level = function (seed, scale) {
		this.rng = new RNG(seed);

		this.container = undefined;
		this.player = undefined;

		this.floor = undefined;



		this.createContainer();
		this.createFloor();
		this.createPlayer();
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
			this.player.setPosition(startX, this.getY(startX, Number.MAX_VALUE));			
		},

		getY: function (x, fromY) {
			var	y = Number.MIN_VALUE,
				floorY = this.floor.getY(x);

			if (floorY !== undefined && floorY <= fromY) {
				y = Math.max(y, floorY);
			}

			return  y;
		},


		createFloor: function () {
			this.floor = new Platform('floor', this.rng.uniform());
			this.container.appendChild(this.floor.container);
		}


	}

})(RNG, Math, Number, document);