import * as THREE from 'three';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { VRButton } from 'jsm/webxr/VRButton.js';
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js"

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.set(0, 2, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.xr.enabled = true; // ОБЯЗАТЕЛЬНО для VR
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.0;
bloomPass.strength = 3.0;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

document.body.appendChild(VRButton.createButton(renderer));

const colors = ['red', 'purple', 'orange', 'blue', 'yellow'];

function getSquare(posY){
const squareGeo = new THREE.PlaneGeometry(1, 1);
const color = colors[Math.floor(Math.random() * colors.length)];
const basicMat = new THREE.MeshBasicMaterial({
  color,
  side: THREE.DoubleSide
});

const mesh = new THREE.Mesh( squareGeo, basicMat );
const x = Math.round( Math.random() * 10 ) - 5;

// const y = Math.round( Math.random() * 10 ) - 5;
const z = Math.round( Math.random() * 10 ) - 5;
mesh.rotation.x = 90 * Math.PI / 180;
mesh.position.set( x, posY, z );
const speed = 0.05;
const limit = 81;
function update(){
  mesh.position.z += speed;
  if( mesh.position.z > 4 ){
    mesh.position.z = -limit;
  }
}
return {
  mesh,
  update
}
}

const squares = [];
const numSquares = 30;
let posY = 5;
for( let i = 0; i <= numSquares; i++ ){
  posY = posY * -1;
  let square = getSquare(posY);
  scene.add( square.mesh );
  squares.push(square);
}

// ВАЖНО: используем setAnimationLoop вместо requestAnimationFrame
renderer.setAnimationLoop(function () {
  camera.rotation.z += 0.0003;
  squares.forEach( s => s.update() );
  renderer.render(scene, camera); // Прямой рендеринг, без composer
});
