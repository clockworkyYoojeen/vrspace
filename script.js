    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { VRButton } from 'three/addons/webxr/VRButton.js';
    // --- Вспомогательный объект (показывает оси) ---
    const axesHelper = new THREE.AxesHelper(3);  
    // --- Сцена ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101020);
    scene.add( axesHelper );

    // --- Камера ---
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 5);

    // --- Рендерер ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true; // Включаем WebXR
    document.body.appendChild(renderer.domElement);

    // --- Кнопка входа в VR ---
    document.body.appendChild(VRButton.createButton(renderer));

    // --- Освещение ---
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    // --- Кубы ---
    const geometry = new THREE.BoxGeometry();

    const material1 = new THREE.MeshLambertMaterial({ color: 'orange' });
    const material2 = new THREE.MeshMatcapMaterial({ color: 'skyblue' });
    const material3 = new THREE.MeshToonMaterial({ color: 'pink' });

    const cube1 = new THREE.Mesh(geometry, material1);
    const cube2 = new THREE.Mesh(geometry, material2);
    const cube3 = new THREE.Mesh(geometry, material3);

    cube1.position.set(-3, 1, 1);
    cube2.position.set(1, 2, -2);
    // --- повернём синий куб по осям X и Y ---
    cube2.rotateX(2)
    cube2.rotateY(5)

    cube3.position.set(4, -1, -5);

    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);

    // --- Пол (чтобы в VR было ощущение пространства) ---
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // --- Сетка для наглядности ---
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    gridHelper.position.y = -0.99;
    scene.add(gridHelper);

    // --- OrbitControls (для мыши/тача в обычном режиме) ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, -2);
    controls.enableDamping = true;
    controls.update();

    // --- Анимация ---
    // ВАЖНО: используем setAnimationLoop вместо requestAnimationFrame
    // Это обязательно для работы в VR-режиме
    renderer.setAnimationLoop(() => {
      cube1.rotation.x += 0.01;
      cube1.rotation.y += 0.01;

      controls.update();
      renderer.render(scene, camera);
    });

    // --- Обработка изменения размера окна ---
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
