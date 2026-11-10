import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( w, h );
renderer.xr.enabled = true;

document.body.appendChild( renderer.domElement );

// VR button
document.body.appendChild(VRButton.createButton(renderer));

// camera
const fov = 75; // degrees
const aspect = w / h;
const min_near = 0.1;
const max_far = 10;
const camera = new THREE.PerspectiveCamera( fov, aspect, min_near, max_far );
camera.position.z = 2;

// scene
const scene = new THREE.Scene();

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);

// floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 'lightgreen',
    roughness: 0.8,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

// texture for the ball (creating before the object)
const textureLoader = new THREE.TextureLoader();
const ballMap = textureLoader.load(
    './static/textures/halloween.png'
);
// object
    // diameter 1 м ---
    // radius 0.5 м
    const SPHERE_RADIUS = 0.5;
    const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: ballMap,
      envMapIntensity: 1.2,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

// rendering
let direction = 1;
const step = 0.02;
const tooClose = 1;
const tooFar = -3;
renderer.setAnimationLoop( () => {

    sphere.position.z += step * direction;
    
    if( sphere.position.z >= tooClose ){
        sphere.position.z = 1;
        direction = -1;
    } else if( sphere.position.z <= tooFar ){
        sphere.position.z = -3;
        direction = 1;
    }

    renderer.render( scene, camera );
} )