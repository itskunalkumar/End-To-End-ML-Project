/* Ambient 3D node-network background.
   Slow, non-interactive drift with a gentle mouse parallax —
   the single orchestrated motion moment for this page. */

(function () {
  var canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 420;

  var group = new THREE.Group();
  scene.add(group);

  var NODE_COUNT = window.innerWidth < 700 ? 46 : 90;
  var SPREAD = 520;
  var LINK_DIST = 130;

  var nodePositions = [];
  var nodeGeo = new THREE.SphereGeometry(2.1, 8, 8);
  var goldMat = new THREE.MeshBasicMaterial({ color: 0xf2b84b });
  var tealMat = new THREE.MeshBasicMaterial({ color: 0x57e2c9 });

  for (var i = 0; i < NODE_COUNT; i++) {
    var pos = new THREE.Vector3(
      (Math.random() - 0.5) * SPREAD * 1.6,
      (Math.random() - 0.5) * SPREAD,
      (Math.random() - 0.5) * SPREAD
    );
    nodePositions.push(pos);
    var mesh = new THREE.Mesh(nodeGeo, Math.random() > 0.82 ? goldMat : tealMat);
    mesh.position.copy(pos);
    mesh.userData.speed = 0.06 + Math.random() * 0.1;
    mesh.userData.offset = Math.random() * Math.PI * 2;
    mesh.userData.axis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    group.add(mesh);
  }

  var lineMat = new THREE.LineBasicMaterial({
    color: 0x8fa3c9,
    transparent: true,
    opacity: 0.16,
  });
  var lineGeo = new THREE.BufferGeometry();
  var linePositions = [];

  for (var a = 0; a < nodePositions.length; a++) {
    for (var b = a + 1; b < nodePositions.length; b++) {
      if (nodePositions[a].distanceTo(nodePositions[b]) < LINK_DIST) {
        linePositions.push(
          nodePositions[a].x, nodePositions[a].y, nodePositions[a].z,
          nodePositions[b].x, nodePositions[b].y, nodePositions[b].z
        );
      }
    }
  }
  lineGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  var mouseX = 0;
  var mouseY = 0;
  var targetRotX = 0;
  var targetRotY = 0;

  window.addEventListener("mousemove", function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    targetRotY += (mouseX * 0.35 - targetRotY) * 0.02;
    targetRotX += (-mouseY * 0.22 - targetRotX) * 0.02;

    group.rotation.y = t * 0.03 + targetRotY;
    group.rotation.x = t * 0.015 + targetRotX;

    renderer.render(scene, camera);
  }

  animate();
})();
