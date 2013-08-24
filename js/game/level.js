var Level;

(function (RNG, Math, document){
	'use strict';

	var formulas = {
		'sin_1': {

			calculate : function (x, part) {
				return (Math.sin((x - part.x) / (part.a + 0.5) / 100)*part.b*40) + part.y;
			},

			getMaxHeight: function (part) {
				return part.y + 40;
			}
		}
	}

	Level = function (seed) {
		this.rng = new RNG(seed);

		this.container = null;
		this.floor = {
			container: null,
			parts: [],
			canvases: []
		};
		this.length = 0;

		this.createContainer();
		this.createFloor();
	};

	Level.prototype =  {

		createContainer: function () {
			this.container = document.createElement('div');
			this.container.className = 'level';
			document.body.appendChild(this.container);
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
				maxHeight = Math.max(maxHeight, formula.getMaxHeight(part));
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

				height = canvas.height = part.formula.getMaxHeight(part),
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

})(RNG, Math, document);