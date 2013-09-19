var globals,
	Player,
	RNG;

(function (RNG, Math, document, Number, Modernizr, undefined){
	'use strict';
	
	var WIDTH = 53,
		HEIGHT = 68,
		BOTTOM_OFFSET = 0,

		GEOMETRY,
		MATERIAL;

	function getMaterial() {
		MATERIAL = undefined;

		if (MATERIAL === undefined) {
			MATERIAL =  new THREE.MeshBasicMaterial({ 
				color: 0x0000ff
			});
		}
		return MATERIAL;
	}

	function getGeometry() {
		GEOMETRY = undefined;
		
		if (GEOMETRY === undefined) {

			GEOMETRY = new THREE.Geometry();

			GEOMETRY.vertices.push(new THREE.Vector3(-(WIDTH/2), BOTTOM_OFFSET, 0));
			GEOMETRY.vertices.push(new THREE.Vector3(-(WIDTH/2), HEIGHT + BOTTOM_OFFSET, 0));
			GEOMETRY.vertices.push(new THREE.Vector3((WIDTH/2), HEIGHT + BOTTOM_OFFSET, 0));
			GEOMETRY.vertices.push(new THREE.Vector3((WIDTH/2), BOTTOM_OFFSET, 0));
			
			GEOMETRY.faces.push( new THREE.Face3( 0, 2, 1 ) );
			GEOMETRY.faces.push( new THREE.Face3( 0, 3, 2 ) );

			GEOMETRY.computeFaceNormals();

		}
		return GEOMETRY;
	}

	Player = function (x, y, z) {

		this.totalTime = 0;

		this.position =  {
			x: x,
			y: y,
			z: z
		},
		this.speed = {
			x: 0,
			y: 0
		}



		this.mesh = undefined;
		this.create();
	};

	Player.prototype = {
		create: function () {
			this.mesh = new THREE.Mesh(
				getGeometry(),
				getMaterial()
			);
			this.mesh.position = this.position;
		},

		reset: function () {

		},

		setPosition: function (x, y, z) {
			this.mesh.position = this.position = {x: x, y: y, z: z};
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
		//		this.container.style.webkitAnimationName = this.container.style.animationName = 'player-walking';
			} else {
		//		this.container.style.webkitAnimationName = this.container.style.animationName = 'player-standing';
			}
			
			
		
			if (this.speed.x < 0) {
				// TODO
				//	transform += ' scaleX(-1)';
			}


		}

	}

})(RNG, Math, document, Number, Modernizr);
