import * as THREE from 'three';

const zoomObjectBoundingSphere = (obj, controls, lightDirectional, axesHelper, camera, scene) => {
	const bbox = new THREE.Box3().setFromObject(obj);

	const sphere = bbox.getBoundingSphere(new THREE.Sphere());
	const { center, radius } = sphere;

	controls.target.copy(center);
	controls.maxDistance = 5 * radius;

	camera.position.copy(center.clone().add(new THREE.Vector3(1.0 * radius, -1.0 * radius, 1.0 * radius)));
	camera.far = 10 * radius; // 2 * camera.position.length();
	camera.updateProjectionMatrix();

	lightDirectional.position.copy(center.clone().add(new THREE.Vector3(-1.5 * radius, -1.5 * radius, 1.5 * radius)));
	lightDirectional.shadow.camera.scale.set(0.2 * radius, 0.2 * radius, 0.01 * radius);
	lightDirectional.target = axesHelper;

	if (!axesHelper) {
		axesHelper = new THREE.AxesHelper(1);
		axesHelper.name = 'axesHelper';
		scene.add(axesHelper);
	}

	axesHelper.scale.set(radius, radius, radius);
	axesHelper.position.copy(center);

	obj.userData.center = center;
	obj.userData.radius = radius;
};

const disposeScene = (scene) => {
	scene.traverse(function(child) {
		if (child.type === 'Mesh') {
			//console.log(child);
			child.geometry.dispose();
			child.material.dispose();

			scene.remove(child);
		} else if (child instanceof THREE.LineSegments) {
			child.geometry.dispose();
			child.material.dispose();
		}
	});
};

export { zoomObjectBoundingSphere, disposeScene };
