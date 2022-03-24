﻿// ref: view-source:https://threejs.org/examples/webgl_lightningstrike.html

//import * as THREE from 'https://cdn.skypack.dev/three@v0.138.3';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/controls/OrbitControls.js';
//import { LightningStrike } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/geometries/LightningStrike.js';
////import { LightningStorm } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/objects/LightningStorm.js';
//import { EffectComposer } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/postprocessing/EffectComposer.js';
//import { RenderPass } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/postprocessing/RenderPass.js';
//import { OutlinePass } from 'https://cdn.skypack.dev/three@v0.138.3/examples/jsm/postprocessing/OutlinePass.js';

import * as THREE from 'three';
import { OrbitControls } from '../../lib/3d/jsm/controls/OrbitControls.js';
import { LightningStrike } from '../../lib/3d/jsm/geometries/LightningStrike.js';
//import { LightningStorm } from '../../lib/3d/jsm/objects/LightningStorm.js';
import { EffectComposer } from '../../lib/3d/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../lib/3d/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from '../../lib/3d/jsm/postprocessing/OutlinePass.js';


let container;

let scene, renderer, composer;

let currentTime = 0;

const clock = new THREE.Clock();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

$(document).ready(function () {
    init();
    animate();
});

function init() {
	container = document.getElementById('container');

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;

	container.appendChild(renderer.domElement);

	composer = new EffectComposer(renderer);

	window.addEventListener('resize', onWindowResize);

	//createScene();
	scene = createConesScene();
	initScene();
}

function initScene() {
	scene.userData.timeRate = 1;
}

function onWindowResize() {
	scene.userData.camera.aspect = window.innerWidth / window.innerHeight;
	scene.userData.camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	composer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	requestAnimationFrame(animate);

	render();
	//stats.update();
}

function render() {
	currentTime += scene.userData.timeRate * clock.getDelta();
	if (currentTime < 0) {
		currentTime = 0;
	}
	scene.userData.render(currentTime);
}

function createOutline(scene, objectsArray, visibleColor) {
	const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, scene.userData.camera, objectsArray);
	outlinePass.edgeStrength = 2.5;
	outlinePass.edgeGlow = 0.7;
	outlinePass.edgeThickness = 2.8;
	outlinePass.visibleEdgeColor = visibleColor;
	outlinePass.hiddenEdgeColor.set(0);
	composer.addPass(outlinePass);

	scene.userData.outlineEnabled = true;

	return outlinePass;
}

function createConesScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x050505);

	scene.userData.canGoBackwardsInTime = true;

	scene.userData.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 200, 100000);

	// Lights

	scene.userData.lightningColor = new THREE.Color(0xB0FFFF);
	scene.userData.outlineColor = new THREE.Color(0x00FFFF);

	const posLight = new THREE.PointLight(0x00ffff, 1, 5000, 2);
	scene.add(posLight);

	// Ground

	const ground = new THREE.Mesh(new THREE.PlaneGeometry(200000, 200000), new THREE.MeshPhongMaterial({ color: 0xC0C0C0, shininess: 0 }));
	ground.rotation.x = - Math.PI * 0.5;
	scene.add(ground);

	// Cones

	const conesDistance = 1000;
	const coneHeight = 200;
	const coneHeightHalf = coneHeight * 0.5;

	posLight.position.set(0, (conesDistance + coneHeight) * 0.5, 0);
	posLight.color = scene.userData.outlineColor;

	scene.userData.camera.position.set(5 * coneHeight, 4 * coneHeight, 18 * coneHeight);

	const coneMesh1 = new THREE.Mesh(new THREE.ConeGeometry(coneHeight, coneHeight, 30, 1, false), new THREE.MeshPhongMaterial({ color: 0xFFFF00, emissive: 0x1F1F00 }));
	coneMesh1.rotation.x = Math.PI;
	coneMesh1.position.y = conesDistance + coneHeight;
	scene.add(coneMesh1);

	const coneMesh2 = new THREE.Mesh(coneMesh1.geometry.clone(), new THREE.MeshPhongMaterial({ color: 0xFF2020, emissive: 0x1F0202 }));
	coneMesh2.position.y = coneHeightHalf;
	scene.add(coneMesh2);

	// Lightning strike

	scene.userData.lightningMaterial = new THREE.MeshBasicMaterial({ color: scene.userData.lightningColor });

	scene.userData.rayParams = {
		sourceOffset: new THREE.Vector3(0, 0, 0),
		destOffset: new THREE.Vector3(),
		radius0: 4,
		radius1: 4,
		minRadius: 2.5,
		maxIterations: 7,
		isEternal: true,

		timeScale: 0.7,

		propagationTimeFactor: 0.05,
		vanishingTimeFactor: 0.95,
		subrayPeriod: 3.5,
		subrayDutyCycle: 0.6,
		maxSubrayRecursion: 3,
		ramification: 7,
		recursionProbability: 0.6,

		roughness: 0.85,
		straightness: 0.6
	};

	let lightningStrike;
	let lightningStrikeMesh;
	const outlineMeshArray = [];

	scene.userData.recreateRay = function () {
		if (lightningStrikeMesh) {
			scene.remove(lightningStrikeMesh);
		}

		lightningStrike = new LightningStrike(scene.userData.rayParams);
		lightningStrikeMesh = new THREE.Mesh(lightningStrike, scene.userData.lightningMaterial);

		outlineMeshArray.length = 0;
		outlineMeshArray.push(lightningStrikeMesh);

		scene.add(lightningStrikeMesh);
	};

	scene.userData.recreateRay();

	// Compose rendering

	composer.passes = [];
	composer.addPass(new RenderPass(scene, scene.userData.camera));
	createOutline(scene, outlineMeshArray, scene.userData.outlineColor);

	// Controls

	const controls = new OrbitControls(scene.userData.camera, renderer.domElement);
	controls.target.y = (conesDistance + coneHeight) * 0.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	scene.userData.render = function (time) {
		// Move cones and Update ray position
		coneMesh1.position.set(Math.sin(0.5 * time) * conesDistance * 0.6, conesDistance + coneHeight, Math.cos(0.5 * time) * conesDistance * 0.6);
		coneMesh2.position.set(Math.sin(0.9 * time) * conesDistance, coneHeightHalf, 0);
		lightningStrike.rayParameters.sourceOffset.copy(coneMesh1.position);
		lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
		lightningStrike.rayParameters.destOffset.copy(coneMesh2.position);
		lightningStrike.rayParameters.destOffset.y += coneHeightHalf;

		lightningStrike.update(time);

		controls.update();

		// Update point light position to the middle of the ray
		posLight.position.lerpVectors(lightningStrike.rayParameters.sourceOffset, lightningStrike.rayParameters.destOffset, 0.5);

		if (scene.userData.outlineEnabled) {
			composer.render();

		} else {
			renderer.render(scene, scene.userData.camera);
		}
	};
	return scene;
}