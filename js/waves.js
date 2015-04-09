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
    this.lastTimestamp = 0;
    this.channelName = 'hastings';
    this.subscribe();
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
    this.data = this.channel.getLastValue('wave');
    if(this.data != undefined && this.data.data > 10) {
        if(this.data.timeStamp !== this.lastTimestamp) {
            this.lastTimestamp = this.data.timeStamp;
            //DEBUG
            //console.log("Timestamp =", this.lastTimestamp);
            for(var i=0; i<this.smoothies.length; ++i) {
                this.timeSeries[i].append(this.lastTimestamp, this.data.data);
            }
        }
    }
};

$(document).ready(function() {
    //Set up smoothie charts
    var charts = [ { id:'tide', height:0.91, background: '#dcdef0', line: '#475eab', fill: 'rgba(0,0,0,0.3)' },
        { id: 'swell', height: 0.3, background: '#dceed4', line: '#38b449', fill: 'rgba(0,0,0,0.3)' },
        { id: 'wave', height: 0.3, background: '#fdecf3', line: '#db1f27', fill: 'rgba(0,0,0,0.3)' },
        { id: 'ripple', height: 0.3, background: '#e3f5fd', line: '#1896ab', fill: 'rgba(0,0,0,0.3)' } ];

    var smoothieApp = new SmoothApp(charts);
    //Set any params
    smoothieApp.setPixelDist(40);
    smoothieApp.setLineWidth(4);
    smoothieApp.init();

    smoothieApp.run();
});
