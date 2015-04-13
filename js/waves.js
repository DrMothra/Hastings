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
    this.streams = ['tide', 'broad', 'wave', 'lower'];
    this.lastTimestamps = new Array(this.streams.length);
    BaseSmoothApp.prototype.init.call(this);
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
                this.lastTimestamps[i] = this.data.timeStamp;
                this.timeSeries[i].append(this.lastTimestamps[i], this.data.data);
            }
        }
    }
};

$(document).ready(function() {
    //Set up smoothie charts
    var charts = [ { id:'tide', width: 0.158, height: 0.837, background: '#71c5ef', line: '#000000', delay: 7500, max: 360, min: 290 },
        { id: 'swell', width: 0.763, height: 0.22, background: '#71c5ef', line: '#000000', delay: 100, max: undefined, min: undefined },
        { id: 'wave', width: 0.763, height: 0.22, background: '#71c5ef', line: '#000000', delay: 100, max: undefined, min: undefined },
        { id: 'ripple', width: 0.763, height: 0.22, background: '#71c5ef', line: '#000000', delay: 100, max: undefined, min: undefined } ];

    var smoothieApp = new SmoothApp(charts);
    //Set any params
    smoothieApp.setPixelDist(40);
    smoothieApp.setLineWidth(4);
    smoothieApp.init();

    smoothieApp.run();
});
