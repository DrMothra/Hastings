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
    BaseApp.prototype.init.call(this, container);
};

Hastings.prototype.update = function() {

    BaseApp.prototype.update.call(this);

    //Update vertices
    for(var i=0; i<this.waveGeometry.geometry.vertices.length; ++i) {
        this.waveGeometry.geometry.vertices[i].z += Math.sin(this.animationTime - (0.6 * i));
    }

    this.animationTime += 0.1;
    this.waveGeometry.geometry.verticesNeedUpdate = true;
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
    var planeMat = new THREE.MeshPhongMaterial( { color: 0x0000ff, map: tex});
    this.waveGeometry = new THREE.Mesh(planeGeom, planeMat);


    this.waveGeometry.rotation.x = -Math.PI/4;

    this.scene.add(this.waveGeometry);

    //Root node
    this.root = new THREE.Object3D();
    this.root.name = 'root';
    this.scene.add(this.root);
};

Hastings.prototype.createGUI = function() {
    //Create GUI for test dev only
    this.guiControls = new function() {
        //Light Pos
        this.LightX = 200;
        this.LightY = 200;
        this.LightZ = 200;
    };

    //Create GUI
    var gui = new dat.GUI();
    var _this = this;

    this.lightPos = gui.addFolder('LightPos');
    this.lightPos.add(this.guiControls, 'LightX', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, -1);
    });
    this.lightPos.add(this.guiControls, 'LightY', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 0);
    });
    this.lightPos.add(this.guiControls, 'LightZ', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 1);
    });
};

$(document).ready(function() {
    //Set up visualisation
    var container = document.getElementById("WebGL-Output");
    var app = new Hastings();
    app.init(container);
    app.createScene();
    //app.createGUI();

    app.run();
});