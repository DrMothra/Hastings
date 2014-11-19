/**
 * Created by DrTone on 17/11/2014.
 */


//Init this app from base
function Hastings() {
    BaseApp.call(this);
}

Hastings.prototype = new BaseApp();

Hastings.prototype.init = function(container) {
    //Animation
    this.animationTime = 0;
    this.rotationInc = Math.PI/32;
    this.totalRot = 0;
    this.waveAmplitude = 1;
    this.WaveDelay = this.rotationInc;
    BaseApp.prototype.init.call(this, container);
};

Hastings.prototype.update = function() {

    BaseApp.prototype.update.call(this);

    //Update vertices
    for(var i=0; i<this.waveGeometry.geometry.vertices.length; ++i) {
        this.waveGeometry.geometry.vertices[i].z = this.waveAmplitude * Math.sin(this.totalRot - (this.WaveDelay * i));
    }

    this.waveGeometry.geometry.verticesNeedUpdate = true;

    //Single tile
    var offset = this.waveAmplitude * Math.sin(this.totalRot)/64;
    for(var tile=0; tile<this.tiles.length; ++tile) {
        this.tiles[tile].rotation.x = offset - Math.PI/2;
    }


    //DEBUG
    console.log('Offset =', offset);

    this.totalRot += this.rotationInc;
};

Hastings.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    //Place marker where light is
    var boxGeom = new THREE.BoxGeometry(2, 2, 2);
    var boxMat = new THREE.MeshBasicMaterial( {color: 0xffffff});
    var box = new THREE.Mesh(boxGeom, boxMat);
    box.name = 'lightBox';
    var light = this.scene.getObjectByName('PointLight', true);
    if(light) {
        box.position.copy(light.position);
    }

    this.scene.add(box);

    var tex = THREE.ImageUtils.loadTexture("images/blue-squares.jpg");
    var planeGeom = new THREE.PlaneGeometry(640, 480, 8, 8);
    var planeMat = new THREE.MeshPhongMaterial( { color: 0x0000ff, map: tex, wireframe: false});
    this.waveGeometry = new THREE.Mesh(planeGeom, planeMat);
    this.waveGeometry.rotation.x = -Math.PI/2;

    this.scene.add(this.waveGeometry);

    //Individual tiles
    this.tiles = [];
    var startX = -150;
    var incX = 100;
    for(var tile=0; tile<4; ++tile) {
        planeGeom = new THREE.PlaneGeometry(80, 60, 2, 2);
        planeMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
        this.tiles.push(new THREE.Mesh(planeGeom, planeMat));
        this.tiles[tile].rotation = -Math.PI/2;
        this.tiles[tile].position.x = startX + (incX*tile);
        this.tiles[tile].position.y = 5;
        this.scene.add(this.tiles[tile]);
    }

    //DEBUG
    //this.scene.add(new THREE.FaceNormalsHelper(this.waveGeometry));

    //Root node
    /*
    this.root = new THREE.Object3D();
    this.root.name = 'root';
    this.scene.add(this.root);
    */
};

Hastings.prototype.createGUI = function() {
    //Create GUI for test dev only
    this.guiControls = new function() {
        //Appearance
        this.Wireframe = false;
        //Parameters
        this.Amplitude = 1;
        this.WaveDelay = 0.1;
        //Light Pos
        this.LightX = 200;
        this.LightY = 200;
        this.LightZ = 200;
    };

    //Create GUI
    var gui = new dat.GUI();
    var _this = this;

    //Folders
    this.appearance = gui.addFolder('Appearance');
    this.parameters = gui.addFolder('Parameters');
    this.lights = gui.addFolder('Lights');

    this.appearance.add(this.guiControls, 'Wireframe', false).onChange(function(value) {
        _this.waveGeometry.material.wireframe = value;
    });

    this.parameters.add(this.guiControls, 'Amplitude', 0.5, 10).onChange(function(value) {
        _this.waveAmplitude = value;
    });
    this.parameters.add(this.guiControls, 'WaveDelay', 0.1, 5).onChange(function(value) {
        _this.WaveDelay = value;
    });

    this.lights.add(this.guiControls, 'LightX', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, -1);
    });
    this.lights.add(this.guiControls, 'LightY', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 0);
    });
    this.lights.add(this.guiControls, 'LightZ', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 1);
    });
};

Hastings.prototype.changeLightPos = function(value, axis) {
    //Alter light pos
    var light = this.scene.getObjectByName('PointLight', true);
    var box = this.scene.getObjectByName('lightBox', true);
    if(!light || !box) {
        console.log('No light or light box');
        return;
    }
    switch(axis) {
        case -1:
            //X-axis
            light.position.x = value;
            box.position.x = value;
            break;

        case 0:
            //Y-Axis
            light.position.y = value;
            box.position.y = value;
            break;

        case 1:
            //Z-Axis
            light.position.z = value;
            box.position.z = value;
            break;

        default:
            break;
    }
};

$(document).ready(function() {
    //Set up visualisation
    var container = document.getElementById("WebGL-Output");
    var app = new Hastings();
    app.init(container);
    app.createScene();
    app.createGUI();

    app.run();
});