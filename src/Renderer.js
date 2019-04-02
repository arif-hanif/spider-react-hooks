import React, { useEffect, useState, useRef } from 'react';
import { gbXMLParser, threeGenerator } from '@ladybug-tools/spider-core';
import axios from 'axios';
import * as THREE from 'three';
import OrbitControlsDef from 'three-orbit-controls';

import { zoomObjectBoundingSphere, disposeScene } from './threeFunctions';

const Renderer = ({ gbXMLURL }) => {
	const ref = useRef();

	const [ ambientLight ] = useState(new THREE.AmbientLight(0x444444));
	const [ directionalLight ] = useState(new THREE.DirectionalLight(0xffffff, 1));
	const [ pointLight ] = useState(new THREE.PointLight(0xffffff, 0.5));
	const [ axesHelper ] = useState(new THREE.AxesHelper(1));
	const [ camera ] = useState(new THREE.PerspectiveCamera(40, 2, 0.1, 1000));
	const [ scene ] = useState(new THREE.Scene());
	const [ gbXML, setgbXML ] = useState(null);
	const [ renderer ] = useState(new THREE.WebGLRenderer({ alpha: 1, antialias: true }));
	const [ surfaceMeshes ] = useState(new THREE.Group());
	const [ surfaceEdges ] = useState(new THREE.Group());
	const [ surfaceOpenings ] = useState(new THREE.Group());

	surfaceMeshes.name = 'surfaceMeshes';
	surfaceEdges.name = 'surfaceEdges';
	surfaceOpenings.name = 'surfaceOpenings';

	useEffect(
		() => {
			axios.get(gbXMLURL).then((data) => setgbXML(data.data));
		},
		[ gbXMLURL ]
	);

	useEffect(
		() => {
			if (gbXML) {
				disposeScene(scene);
				surfaceMeshes.children = [];
				surfaceEdges.children = [];
				surfaceOpenings.children = [];

				scene.remove(surfaceMeshes, surfaceEdges, surfaceOpenings);
				camera.remove(pointLight);

				const json = gbXMLParser.parseFileXML(gbXML);

				const OrbitControls = OrbitControlsDef(THREE);
				const controls = new OrbitControls(camera, renderer.domElement);

				surfaceMeshes.add(...threeGenerator.getSurfaceMeshes(json));
				surfaceEdges.add(...threeGenerator.getSurfaceEdges(surfaceMeshes));
				surfaceOpenings.add(...threeGenerator.getOpenings(json));

				camera.up.set(0, 0, 1);
				camera.position.z = 4;
				camera.add(pointLight);

				directionalLight.shadow.mapSize.width = 2048; // default 512
				directionalLight.shadow.mapSize.height = 2048;
				directionalLight.castShadow = true;

				scene.add(
					ambientLight,
					directionalLight,
					axesHelper,
					camera,
					surfaceMeshes,
					surfaceEdges,
					surfaceOpenings
				);

				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;

				zoomObjectBoundingSphere(surfaceEdges, controls, directionalLight, axesHelper, camera, scene);
				ref.current.appendChild(renderer.domElement);
				renderer.render(scene, camera);

				controls.update();
				animate();
			}
		},
		[ gbXML ]
	);

	// Render Loop
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		//controls.update();
	}

	return (
		<div
			style={{
				position: 'relative',
				left: 0,
				top: 0,
				zIndex: 0
			}}
			ref={ref}
		/>
	);
};

export default Renderer;
