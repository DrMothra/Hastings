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
    this.numberRows = 5;
    this.tilesPerRow = 6;
    this.channelName = 'hastingsfiltered';
    BaseApp.prototype.init.call(this, container);
};

Hastings.prototype.update = function() {

    //Update vertices
    for(var i=0; i<this.waveGeometry.geometry.vertices.length; ++i) {
        this.waveGeometry.geometry.vertices[i].z = this.waveAmplitude * Math.sin(this.totalRot - (this.WaveDelay * i));
    }

    this.waveGeometry.geometry.verticesNeedUpdate = true;

    //Adjust rotation for each row
    var tileNumber = 0;
    for(var row=0; row<this.numberRows; ++row) {
        for(var tile=0; tile<this.tilesPerRow; ++tile) {
            this.tiles[tileNumber++].rotation.x = (this.waveAmplitude * Math.sin(this.totalRot+(this.rotationInc*20*row))/64) - Math.PI/2;
        }
    }

    this.totalRot += this.rotationInc;

    BaseApp.prototype.update.call(this);
};

Hastings.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    var _this = this;

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
    //Group tiles
    this.tileGroup = new THREE.Object3D();
    this.tileGroup.name = 'tileGroup';
    this.scene.add(this.tileGroup);

    this.tiles = [];
    var startX = -250;
    var startZ = -200;
    var incX = 100, incZ = 100;
    var numberTiles = 0;

    for(var row=0; row<this.numberRows; ++row) {
        for(var tile=0; tile<this.tilesPerRow; ++tile) {
            planeGeom = new THREE.PlaneGeometry(80, 60, 2, 2);
            planeMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
            this.tiles.push(new THREE.Mesh(planeGeom, planeMat));
            this.tiles[numberTiles].rotation = -Math.PI/2;
            this.tiles[numberTiles].position.x = startX + (incX * tile);
            this.tiles[numberTiles].position.y = 5;
            this.tiles[numberTiles].position.z = startZ + (incZ * row);
            this.tileGroup.add(this.tiles[numberTiles]);
            ++numberTiles;
        }
    }

    //Load teacup
    var loader = new THREE.OBJMTLLoader();
    loader.load( 'models/Cup.obj', 'models/Cup.mtl', function ( object ) {

        object.name = 'Cup';
        object.scale.set(200, 200, 200);
        object.position.y = -550;
        object.traverse(function(obj) {
            if(obj instanceof THREE.Mesh) {
                obj.visible = false;
            }
        });
        _this.scene.add( object );

    }, null, null );
};

//Get real data
Hastings.prototype.subscribe = function() {
    //Subscribe to pubnub channel
    this.channel = PubNubBuffer.subscribe(this.channelName,
        "sub-c-2eafcf66-c636-11e3-8dcd-02ee2ddab7fe",
        1000,
        300);
};

Hastings.prototype.createGUI = function() {
    //Create GUI for test dev only
    this.guiControls = new function() {
        //Appearance
        this.Wireframe = false;
        this.MeshVisible = true;
        this.TilesVisible = true;
        this.CupVisible = false;
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
    this.appearance.add(this.guiControls, 'MeshVisible', false).onChange(function(value) {
        _this.waveGeometry.visible = value;
    });
    this.appearance.add(this.guiControls, 'TilesVisible', false).onChange(function(value) {
        _this.tileGroup.traverse(function(obj) {
            if(obj instanceof THREE.Mesh) {
                obj.visible = value;
            }
        })
    });
    this.appearance.add(this.guiControls, 'CupVisible', false).onChange(function(value) {
        var cup = _this.scene.getObjectByName('Cup', true);
        if(cup) {
            cup.traverse(function(obj) {
                if(obj instanceof THREE.Mesh) {
                    obj.visible = value;
                }
            })
        }
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