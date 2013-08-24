var Level,
	Player;

(function (RNG, Math, Number, document){
	'use strict';

	var formulas = {
		'sin_1': {

			ampitude: 40,

			calculate : function (x, part) {
				var a = part.a - 0.5;
				if(a > 0) {
					a += 0.5;
				} else {
					a -= 0.5;
				}
				return (Math.sin((x - part.x) / a / 100)*part.b * this.ampitude) + part.y;
			},

			getMax: function (part) {
				return part.y + this.ampitude;
			},
			getMin: function (part) {
				return part.y - this.ampitude;
			}
		}
	}

	Level = function (seed, scale) {
		this.rng = new RNG(seed);

		this.container = undefined;
		this.player = undefined;

		this.floor = {
			container: null,
			parts: [],
			canvases: [],
		};



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
			var	testY,
				y = Number.MIN_VALUE,
				floorPart = this.getPart(this.floor, x);


			if (floorPart !== undefined) {
				testY = floorPart.formula.calculate(x, floorPart);
				if(testY <= fromY) {
					y = Math.max(y, testY);
				}
			}

			return  y;
		},

		getPart: function (object, x) {
			var i, part;

			for (i = 0; i < object.parts.length; i++) {
				part = object.parts[i];

				if (x >= part.x && x < part.x + part.width) {
					return part;
				}
			}

			return undefined;
		},

		createFloor: function () {
			var i,
				x = 0,
				y = 500,
				maxHeight = 0,
				part,
				formula,
				parts = this.rng.random(50, 200);

			for (i = 0; i < parts; i++) {

				part = {
					x: x,
					y: y,
					width: this.rng.random(100, 500),
					formula: formulas['sin_1'],
					a: this.rng.uniform(),
					b: this.rng.uniform(),
					c: this.rng.uniform(),
					d: this.rng.uniform()
				};

				formula = part.formula;
				maxHeight = Math.max(maxHeight, formula.getMax(part));
				x += part.width;
				y = formula.calculate(x, part);

				this.floor.parts.push(part);
			//console.log(part);
			}

			this.width = x;
			this.height = maxHeight;

			this.floor.container = document.createElement('div');
			this.floor.container.className = 'floor';
			this.floor.container.style.height = maxHeight + 'px';

			this.container.appendChild(this.floor.container);

			this.createCanvases(this.floor);

		},



		createCanvases: function (object) {
			var i,
				part,
				canvas;

			for (i = 0; i < object.parts.length; i++) {
				part = object.parts[i];

				canvas = this.createCanvas(part);

				object.canvases.push(canvas);
				object.container.appendChild(canvas);
			}			


		},
		createCanvas: function (part) {
			var x,
				y,
				part,
				canvas = this.canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),

				height = canvas.height = part.formula.getMax(part),
				width = canvas.width = part.width;
			
			canvas.style.left = part.x + 'px';
			ctx.beginPath();

			ctx.moveTo(0, height);


			for (x = part.x; x <= part.x + part.width; x++) {
				y = part.formula.calculate(x, part);

				ctx.lineTo(x - part.x, height-y);
			}

			ctx.lineTo(width+1, height);
			ctx.closePath();
			
			ctx.fillStyle = 'green';
			ctx.fill();
			

			return canvas;
		}
	}

})(RNG, Math, Number, document);