//ref: https://threejs.org/examples/webgl_custom_attributes_lines.html

import * as THREE from 'three';

import { FontLoader } from '../../lib/3d/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../lib/3d/jsm/geometries/TextGeometry.js';

let renderer, scene, camera;

let line, uniforms;

let text = getParameter("text");
const loader = new FontLoader();

$(document).ready(function () {
    if (!text || text.lenth === 0)
		text = "RuneBox";

    loader.load('../../fonts/helvetiker_bold.typeface.json', function (font) {
        init(font);
        animate();
    });
});

function init(font) {
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 400;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x050505);

	uniforms = {
		amplitude: { value: 5.0 },
		opacity: { value: 0.3 },
		color: { value: new THREE.Color(0xffffff) }
	};

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});

	const geometry = new TextGeometry(text, {
		font: font,

		size: 50,
		height: 15,
		curveSegments: 10,

		bevelThickness: 5,
		bevelSize: 1.5,
		bevelEnabled: true,
		bevelSegments: 10,
	});
	geometry.center();

	const count = geometry.attributes.position.count;

	const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
	geometry.setAttribute('displacement', displacement);

	const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
	geometry.setAttribute('customColor', customColor);

	const color = new THREE.Color(0xffffff);

	for (let i = 0, l = customColor.count; i < l; i++) {
		color.setHSL(i / l, 0.5, 0.5);
		color.toArray(customColor.array, i * customColor.itemSize);
	}

	line = new THREE.Line(geometry, shaderMaterial);
	line.rotation.x = 0.2;
	scene.add(line);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	const container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	//
	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

	render();
	// capture
	if (Recorder.isRecording) {
		Recorder.capturer.capture(renderer.domElement);
	}
}

function render() {
	const time = Date.now() * 0.001;

	line.rotation.y = 0.25 * time;

	uniforms.amplitude.value = Math.sin(0.5 * time);
	uniforms.color.value.offsetHSL(0.0005, 0, 0);

	const attributes = line.geometry.attributes;
	const array = attributes.displacement.array;

	for (let i = 0, l = array.length; i < l; i += 3) {

		array[i] += 0.3 * (0.5 - Math.random());
		array[i + 1] += 0.3 * (0.5 - Math.random());
		array[i + 2] += 0.3 * (0.5 - Math.random());

	}

	attributes.displacement.needsUpdate = true;

	renderer.render(scene, camera);
}