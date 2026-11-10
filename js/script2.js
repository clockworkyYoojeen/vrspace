    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { VRButton } from 'three/addons/webxr/VRButton.js';
    // --- Сцена ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101020);

    // --- Камера ---
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.set(2, 2, 4);
    
    // --- Рендерер ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true; // Включаем WebXR
    document.body.appendChild(renderer.domElement);

    // --- Кнопка входа в VR ---
    document.body.appendChild(VRButton.createButton(renderer));

    // --- Освещение ---
    const light = new THREE.AmbientLight( 0x404040, 2 ) // soft white color
    scene.add(light)
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    // --- Пол (чтобы в VR было ощущение пространства) ---
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 'lightgreen',
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

  // --- Текстура ---
    const textureLoader = new THREE.TextureLoader()
  //   const texture = textureLoader.load('textures/halloween.png',
  //       (tex) => console.log('✅ текстура загружена', tex.image.width, '×', tex.image.height),
  // (progress) => console.log('⏳ загрузка...', progress),
  // (err) => console.error('❌ ошибка загрузки', err)
  //   )

    // texture.colorSpace = THREE.SRGBColorSpace;
  
  const colorTexture = textureLoader.load(
  'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
);
colorTexture.colorSpace = THREE.SRGBColorSpace;

    // --- Фигура ---
    const form = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({map: colorTexture})
    const sphere = new THREE.Mesh(form, material)
    sphere.position.set(1, 2, -2)
    scene.add(sphere)

    // --- Отрисовка всего ---
    renderer.render(scene, camera)

    