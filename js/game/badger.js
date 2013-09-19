var globals,
	Badger;

(function (Modernizr) {
	'use strict';

	var WIDTH = 37,
		HEIGHT = 71,
		BOTTOM_OFFSET = -40,

		GEOMETRY,
		MATERIAL;

	function getMaterial() {
		if (MATERIAL === undefined) {
			MATERIAL =  new THREE.MeshBasicMaterial({ 
				color: 0xff00ff
			});
		}
		return MATERIAL;
	}

	function getGeometry() {
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


	Badger = function (x, y, z, delay) {
		this.mesh = undefined;
		this.position = {x: x, y: y, z: z};
		this.delay = delay;

		this.create();

	};

	Badger.prototype = {
		create: function () {
			this.mesh = new THREE.Mesh(
				getGeometry(),
				getMaterial()
			);
			this.mesh.position = this.position;
		}

	
	};

})(Modernizr);