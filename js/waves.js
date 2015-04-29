/**
 * Created by atg on 08/04/2015.
 */
var time = 0;
function SmoothApp(containers) {
    BaseSmoothApp.call(this, containers);
}

SmoothApp.prototype = new BaseSmoothApp();

SmoothApp.prototype.init = function() {
    //Initialise app
    this.data = null;
    this.channelName = 'hastingsfiltered';
    this.subscribe();
    this.streams = ['lower', 'middle', 'upper'];
    this.lastTimestamps = new Array(this.streams.length);
    this.tideTimestamp = 0;
    this.middleTimestamp = 0;
    this.dataMiddle = null;
    this.combinedData = null;
    var _this = this;
    setInterval(function() {
        _this.stopWaiting();
    }, this.waveDelay);
    //DEBUG
    this.numSameStamps = 0;
    BaseSmoothApp.prototype.init.call(this);
};

SmoothApp.prototype.stopWaiting = function() {
    //Remove waiting info
    var ids = ['connectRipple', 'connectWave', 'connectSwell'];
    for(var i=0; i<ids.length; ++i) {
        $('#'+ids[i]).hide();
    }
};

SmoothApp.prototype.createScene = function() {
    //Set up canvas
    this.canvasDetails = { id:'tide', width: 0.19, height: 0.837, background: '#71c5ef', line: '#000000', delay: 12500, max: 1000, min: 0, maxScale: 2.3, minScale: 1.3 };

    this.tideCanvas = document.getElementById(this.canvasDetails.id);
    this.tideCtx = this.tideCanvas.getContext('2d');
    //ctx.strokeStyle = '#000000';
    this.tideCtx.lineWidth = 10;
    //ctx.fillStyle = '#000000';

    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    this.tideCanvas.width = pageWidth * this.canvasDetails.width;
    this.tideCanvas.height = pageHeight * this.canvasDetails.height;

    this.tideCtx.beginPath();
    this.tideCtx.lineWidth = 5;
    this.tideCtx.moveTo(0, 100);
    this.tideCtx.lineTo(this.tideCanvas.width, 100);
    this.tideCtx.stroke();
    this.tideCtx.closePath();
};

SmoothApp.prototype.subscribe = function() {
    //Subscribe to pubnub channel
    this.channel = PubNubBuffer.subscribe(this.channelName,
        "sub-c-2eafcf66-c636-11e3-8dcd-02ee2ddab7fe",
        1000,
        300);
};

SmoothApp.prototype.update = function() {
    //Perform any updates
    for(var i=0; i<this.streams.length; ++i) {
        this.data = this.channel.getLastValue(this.streams[i]);
        if(this.data != undefined) {
            if(this.data.timeStamp !== this.lastTimestamps[i]) {
                this.numSameStamps = 0;
                this.lastTimestamps[i] = this.data.timeStamp;
                this.timeSeries[i].append(this.lastTimestamps[i], this.data.data);
            } else {
                ++this.numSameStamps;
                if(this.numSameStamps >= 12) {
                    //console.log("Same stamps =", this.numSameStamps);
                }
            }
        }
    }
    //Update tide
    this.data = this.channel.getLastValue('tide');
    this.dataMiddle = this.channel.getLastValue('middle');
    if(this.data != undefined && this.dataMiddle != undefined) {
        if(this.data.timeStamp !== this.tideTimestamp && this.dataMiddle.timestamp !== this.middleTimestamp) {
            this.combinedData = this.data.data + this.dataMiddle.data;
            var scale = (this.combinedData - this.canvasDetails.min)/(this.canvasDetails.max - this.canvasDetails.min);
            var height = (1-scale) * this.tideCanvas.height;
            this.tideTimestamp = this.data.timeStamp;
            this.middleTimestamp = this.dataMiddle.timeStamp;
            this.tideCtx.clearRect(0, 0, this.tideCanvas.width, this.tideCanvas.height);
            this.tideCtx.beginPath();
            //this.tideCtx.lineWidth = 5;
            this.tideCtx.moveTo(0, height);
            this.tideCtx.lineTo(this.tideCanvas.width, height);
            this.tideCtx.stroke();
            this.tideCtx.closePath();
        }
    }
};

$(document).ready(function() {
    //Set up smoothie charts
    var dataDelay = 50000;
    var charts = [
        { id: 'ripple', width: 0.78, height: 0.233, background: '#71c5ef', line: '#000000', delay: dataDelay, max: undefined, min: undefined, maxScale: 1.3, minScale: 1.3 },
        { id: 'wave', width: 0.78, height: 0.231, background: '#71c5ef', line: '#000000', delay: dataDelay, max: undefined, min: undefined, maxScale: 1.3, minScale: 1.3 },
        { id: 'swell', width: 0.78, height: 0.227, background: '#71c5ef', line: '#000000', delay: dataDelay, max: undefined, min: undefined, maxScale: 1.3, minScale: 1.3 } ];

    var smoothieApp = new SmoothApp(charts);
    //Set any params
    smoothieApp.setPixelDist(40);
    smoothieApp.setLineWidth(4);
    smoothieApp.setWaveDelay(dataDelay);
    smoothieApp.init();
    smoothieApp.createScene();

    smoothieApp.run();
});
