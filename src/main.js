import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Text Geometry
const loader = new FontLoader();
loader.load('path/to/helvetiker_bold.typeface.json', function (font) {
    const geometry = new TextGeometry('Your Text Here', {
        font: font,
        size: 80,
        height: 5,
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(geometry, material);
    scene.add(textMesh);
});

// Particle Background
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 2000 - 1000;
    positions[i * 3 + 1] = Math.random() * 2000 - 1000;
    positions[i * 3 + 2] = Math.random() * 2000 - 1000;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    color: new THREE.Color(0x888888)
});

const pointCloud = new THREE.Points(particles, particleMaterial);
scene.add(pointCloud);

// Add a background gradient texture
const bgTexture = new THREE.TextureLoader().load('path/to/your/background_texture.jpg'); // Optional
scene.background = bgTexture;

// Camera position
camera.position.z = 500;

// Mouse controls
const controls = {
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
};

window.addEventListener('mousedown', (event) => {
    controls.isDragging = true;
});

window.addEventListener('mouseup', () => {
    controls.isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (controls.isDragging) {
        const deltaX = event.clientX - controls.previousMousePosition.x;
        const deltaY = event.clientY - controls.previousMousePosition.y;
        
        camera.rotation.y -= deltaX * 0.01;
        camera.rotation.x -= deltaY * 0.01;
    }
    controls.previousMousePosition.x = event.clientX;
    controls.previousMousePosition.y = event.clientY;
});

window.addEventListener('wheel', (event) => {
    camera.position.z += event.deltaY * 0.1;
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

