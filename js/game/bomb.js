var globals,
	Bomb;
(function (document, Modernizr, undefined) {
	'use strict';

	var WIDTH = 42,
		HEIGHT = 21,
		BOTTOM_OFFSET = 0,

		GEOMETRY,
		MATERIAL;

	function getMaterial() {
		MATERIAL = undefined;

		if (MATERIAL === undefined) {
			MATERIAL =  new THREE.MeshBasicMaterial({ 
				color: 0xff0000
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

	Bomb = function (x, y, z) {
		this.mesh = undefined;
		this.position = {x: x, y: y, z: z};

		this.exploaded = false;

		this.create();
	};

	Bomb.prototype = {
		create: function () {
			this.mesh = new THREE.Mesh(
				getGeometry(),
				getMaterial()
			);
			this.mesh.position = this.position;
		}


	};

})(document, Modernizr);