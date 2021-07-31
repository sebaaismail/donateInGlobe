//import three.js
const THREE = require("three");
import Stats from "stats.js";

//export stateless React component
export default function Root() {
  return null;
}

var $ = require("jquery");

//set camera attributes
const VIEW_ANGLE = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 0.1;
const FAR = 10000;

//Three.js uses geometric meshes to create primitive 3D shapes like spheres, cubes, etc. I’ll be using a sphere.

// Set up the sphere attributes
const RADIUS = 200;
const SEGMENTS = 50;
const RINGS = 50;

//Update
/*
//set update function to transform the scene and view
function update() {
  //render
  renderer.render(scene, camera);

  //schedule the next frame.
  requestAnimationFrame(update);
}

//schedule the first frame.
requestAnimationFrame(update);
*/

// NEW CODE

var stats, renderer;

var group, text, plane;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var finalRotationY;

// Create a scene
const scene = new THREE.Scene();

//create a camera
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

init();
animate();

function init() {
  /*
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.z = 5;
  */

  //set the camera position - x, y, z
  camera.position.set(0, 0, 500);

  //set the scene background
  scene.background = new THREE.Color(0x000);

  //add the camera to the scene.
  scene.add(camera);
  //Lighting

  //create a point light (won't make a difference here because our material isn't affected by light)
  const pointLight = new THREE.PointLight(0xffffff);

  //set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 400;

  //add light to the scene
  scene.add(pointLight);

  //Create a group (which will later include our sphere and its texture meshed together)
  const globe = new THREE.Group();
  //add it to the scene
  scene.add(globe);

  //Let's create our globe using TextureLoader

  // instantiate a loader
  var loader = new THREE.TextureLoader();
  loader.load("land_ocean_ice_cloud_2048.jpg", function (texture) {
    //create the sphere
    var sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);

    //map the texture to the material. Read more about materials in three.js docs
    var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });

    //create a new mesh with sphere geometry.
    var mesh = new THREE.Mesh(sphere, material);

    mesh.onAfterRender(modelLoadedCallback);

    //add mesh to globe group
    globe.add(mesh);
  });

  // Move the sphere back (z) so we can see it.
  globe.position.z = -300;

  /*
  // texture - texture must not be in same folder or there is an error.
  var texture = THREE.ImageUtils.loadTexture(
    "images/texture.jpg",
    {},
    function () {
      // use to test when image gets loaded if it does
      render();
    },
    function () {
      alert("error");
    }
  );

  //alert('WORKING');

  material = new THREE.MeshPhongMaterial({ map: texture });

  group = new THREE.Object3D();

  //load mesh
  var loader = new THREE.JSONLoader();
  loader.load("models/cube.js", modelLoadedCallback);
//*/

  group = new THREE.Object3D();

  // renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const container = document.querySelector("#container");
  // Attach the renderer to the DOM element.
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  container.appendChild(stats.domElement);

  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("touchstart", onDocumentTouchStart, false);
  document.addEventListener("touchmove", onDocumentTouchMove, false);

  //

  window.addEventListener("resize", onWindowResize, false);

  //for debuging stats
  var interval = setInterval(debugInfo, 50);
}

function modelLoadedCallback(geometry) {
  mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  scene.add(group);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function onDocumentMouseDown(event) {
  event.preventDefault();

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);
  document.addEventListener("mouseout", onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDownX = targetRotationX;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  targetRotationY =
    targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
  targetRotationX =
    targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
  document.removeEventListener("mousemove", onDocumentMouseMove, false);
  document.removeEventListener("mouseup", onDocumentMouseUp, false);
  document.removeEventListener("mouseout", onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
  document.removeEventListener("mousemove", onDocumentMouseMove, false);
  document.removeEventListener("mouseup", onDocumentMouseUp, false);
  document.removeEventListener("mouseout", onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotationX =
      targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

    mouseY = event.touches[0].pageY - windowHalfY;
    targetRotationY =
      targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
  }
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function update() {
  //render
  renderer.render(scene, camera);

  //schedule the next frame.
  requestAnimationFrame(update);
}

function render() {
  //horizontal rotation
  group.rotation.y += (targetRotationX - group.rotation.y) * 0.1;

  //vertical rotation
  finalRotationY = targetRotationY - group.rotation.x;
  group.rotation.x += finalRotationY * 0.05;

  finalRotationY = targetRotationY - group.rotation.x;
  if (group.rotation.x <= 1 && group.rotation.x >= -1) {
    group.rotation.x += finalRotationY * 0.1;
  }
  if (group.rotation.x > 1) {
    group.rotation.x = 1;
  }

  if (group.rotation.x < -1) {
    group.rotation.x = -1;
  }

  renderer.render(scene, camera);
}

function debugInfo() {
  $("#debug").html("mouseX : " + mouseX + "   mouseY : " + mouseY + "");
}
