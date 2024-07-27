import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export function createParticles(scene) {
  const particleCount = 5000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    positions.set([x, y, z], i * 3);

    // Set colors
    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.5, 0.5); // Hue, saturation, lightness
    colors.set([color.r, color.g, color.b], i * 3);
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true
  });

  const particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
}

// Initialize and export camera and controls
export function setupCameraAndControls(scene, renderer) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  const sensitivity = 0.1;

  function handleMouseMove(event) {
    if (isDragging) {
      const deltaX = (event.clientX - prevMouseX) * sensitivity;
      const deltaY = (event.clientY - prevMouseY) * sensitivity;

      // Invert the dragging direction
      camera.rotation.y -= deltaX * 0.01;
      camera.rotation.x -= deltaY * 0.01;

      // Clamp the camera rotation to avoid flipping
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

      prevMouseX = event.clientX;
      prevMouseY = event.clientY;
    }
  }

  window.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Left click
      isDragging = true;
      prevMouseX = event.clientX;
      prevMouseY = event.clientY;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', handleMouseMove);

  window.addEventListener('wheel', (event) => {
    // Move camera forward/backward based on scroll
    const moveSpeed = 0.05;
    const delta = event.deltaY * moveSpeed;
    camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-delta));
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return camera;
}

