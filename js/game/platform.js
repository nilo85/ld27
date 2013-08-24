var Platform;

(function (RNG, undefined){
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


	Platform = function (width, type, seed) {

		this.rng = new RNG(seed);

		this.width = width;
		this.type = type;

		this.container = null;
		this.parts = [];
		this.canvases = [];
		
		this.create();
	}

	Platform.prototype = {
		create: function () {
			var x = 0,
				y = 500,
				maxHeight = 0,
				part,
				formula;

			while(x < this.width) {

				part = {
					x: x,
					y: y,
					width: Math.min(this.width - x, this.rng.random(100, 500)),
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

				this.parts.push(part);
			//console.log(part);
			}

			this.width = x;
			this.height = maxHeight;

			this.container = document.createElement('div');
			this.container.className = 'platform ' + this.type;
			this.container.style.height = maxHeight + 'px';

			this.createCanvases();

		},

		createCanvases: function () {
			var i,
				part,
				canvas;

			for (i = 0; i < this.parts.length; i++) {
				part = this.parts[i];

				canvas = this.createCanvas(part);

				this.canvases.push(canvas);
				this.container.appendChild(canvas);
			}			


		},
		createCanvas: function (part) {
			var x,
				y,
				part,
				canvas = this.canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),

				height = canvas.height = part.formula.getMax(part) * 2,
				width = canvas.width = part.width * 2; 
			
			canvas.style.left = part.x + 'px';
			canvas.style.width = width / 2 + 'px';
			canvas.style.height = height / 2 + 'px';

			ctx.beginPath();

			ctx.moveTo(0, height);


			for (x = part.x; x <= part.x + part.width; x++) {
				y = part.formula.calculate(x, part);

				ctx.lineTo((x - part.x) * 2, height-(y*2));
			}

			ctx.lineTo(width+1, height);
			ctx.closePath();
			
			ctx.fillStyle = 'green';
			ctx.fill();
			

			return canvas;
		},

		getPart: function (x) {
			var i, part;

			for (i = 0; i < this.parts.length; i++) {
				part = this.parts[i];

				if (x >= part.x && x < part.x + part.width) {
					return part;
				}
			}

			return undefined;
		},

		getY: function (x) {
			var	y,
				part = this.getPart(x);


			if (part === undefined) {
				return undefined;
			}

			return  part.formula.calculate(x, part);

		}

	};

})(RNG);
