/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

//import three.js
const THREE = require("three");
import Stats from "stats.js";

//export stateless React component
export default function Root() {
  return null;
}

const VIEW_ANGLE = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 0.1;
const FAR = 10000;

//Three.js uses geometric meshes to create primitive 3D shapes like spheres, cubes, etc. I’ll be using a sphere.

// Set up the sphere attributes
const RADIUS = 200;
const SEGMENTS = 50;
const RINGS = 50;

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function () {
    return (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (
        /* function FrameRequestCallback */ callback,
        /* DOMElement Element */ element
      ) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
}
var container, stats;

var camera, scene, renderer;

var mesh = new THREE.Mesh(),
  plane;

var targetRotationX = 0.5;
var targetRotationOnMouseDownX = 0;

//var targetRotationY = 0.2;
//var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

//var mouseY = 0;
//var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var slowingFactor = 0.25;

init();
animate();

function init() {
  const container = document.querySelector("#container");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  camera.position.set(0, 0, 400);

  //set the scene background
  scene.background = new THREE.Color(0x000);
  scene.add(camera);

  //Lighting

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

  //scene.add(cube);

  //Let's create our globe using TextureLoader

  // instantiate a loader
  var loader = new THREE.TextureLoader();
  //loader.load("land_ocean_ice_cloud_2048.jpg", function (texture) {
  loader.load(
    //"https://commons.wikimedia.org/wiki/File:Land_ocean_ice_2048.jpg",
    //"land_ocean_ice_cloud_2048.jpg",
    //"land_ocean_ice_cloud_2048_indexed.jpg",
    "https://cdn.jsdelivr.net/gh/sebaaismail/donateInGlobe/public/land_ocean_ice_cloud_2048_indexed.jpg",
    function (texture) {
      //create the sphere
      var sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);

      //map the texture to the material. Read more about materials in three.js docs
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        overdraw: 0.5,
      });

      //create a new mesh with sphere geometry.
      mesh = new THREE.Mesh(sphere, material);

      //add mesh to globe group
      globe.add(mesh);
    }
  );

  // Move the sphere back (z) so we can see it.
  globe.position.z = -300;

  ///*************** */

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  container.appendChild(stats.domElement);

  document.addEventListener("mousedown", onDocumentMouseDown, false);
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);
  document.addEventListener("mouseout", onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDownX = targetRotationX;

  //mouseYOnMouseDown = event.clientY - windowHalfY;
  //targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;

  targetRotationX = (mouseX - mouseXOnMouseDown) * 0.00025;

  //mouseY = event.clientY - windowHalfY;

  //targetRotationY = (mouseY - mouseYOnMouseDown) * 0.00025;
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

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  rotateAroundWorldAxis(mesh, new THREE.Vector3(0, 1, 0), targetRotationX);
  //rotateAroundWorldAxis(cube, new THREE.Vector3(1, 0, 0), targetRotationY);

  //targetRotationY = targetRotationY * (1 - slowingFactor);
  targetRotationX = targetRotationX * (1 - slowingFactor);
  renderer.render(scene, camera);
}

function rotateAroundWorldAxis(object, axis, radians) {
  var rotationMatrix = new THREE.Matrix4();

  rotationMatrix.makeRotationAxis(axis.normalize(), radians);
  rotationMatrix.multiply(object.matrix); // pre-multiply
  object.matrix = rotationMatrix;
  object.rotation.setFromRotationMatrix(object.matrix);
}
