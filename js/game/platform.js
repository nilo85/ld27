var globals,
	Platform;

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
	};



	Platform = function (width, z, type, seed, baseHeight) {

		this.rng = new RNG(seed);

		this.baseHeight = baseHeight;

		this.width = width;
		this.type = type;
		this.z = z;

		this.mesh = undefined;

		this.parts = [];
		this.canvases = [];
		
		this.create();
	}

	Platform.prototype = {
		create: function () {
			var x = 0,
				y = this.baseHeight,
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
			}

			this.width = x;
			this.height = maxHeight;


			this.mesh = new THREE.Mesh(
				this.createGeometry(),
				this.createMaterial()
			);





			//this.createCanvases();

		},
		createMaterial: function () {
			if(this.type === 'floor') {
				return new THREE.MeshBasicMaterial({ 
					color: 0x4e9f39
				});
			} else {
				return new THREE.MeshBasicMaterial({
					color: 0x4e9f39, 
					transparent: true, 
					opacity: 0.5
				});				
			}
		},

		createGeometry: function () {

			var x,y,i,
				part,
				geometry = new THREE.Geometry();

			for (x = 0; x < this.width; x += 10) {

				part = this.getPart(x);

				y = part.formula.calculate(x, part);

				geometry.vertices.push(new THREE.Vector3(x, 0, this.z));
				geometry.vertices.push(new THREE.Vector3(x, y, this.z));

			}

			for (i = 0; i < geometry.vertices.length - 2; i += 2) {
				geometry.faces.push( new THREE.Face3( i+0, i+2, i+1 ) );
				geometry.faces.push( new THREE.Face3( i+2, i+3, i+1 ) );
			}

			geometry.computeFaceNormals();


			return geometry;
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
