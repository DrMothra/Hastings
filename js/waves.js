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
    if(this.data != undefined && this.data > 10) {
        for(var i=0; i<this.smoothies.length; ++i) {
            this.timeSeries[i].append(new Date().getTime(), this.data);
        }
    }
};

$(document).ready(function() {
    //Set up smoothie charts
    var charts = ['tide', 'ripple', 'swell', 'waves'];
    var smoothieApp = new SmoothApp(charts);
    smoothieApp.init();

    smoothieApp.run();
});
