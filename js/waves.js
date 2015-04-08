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
    BaseSmoothApp.prototype.init.call(this);
};

SmoothApp.prototype.update = function() {
    //Perform any updates
    time += 16;
    for(var i=0; i<this.smoothies.length; ++i) {
        this.timeSeries[i].append(new Date().getTime(), Math.random());
    }
};

$(document).ready(function() {
    //Set up smoothie charts
    var charts = ['tide', 'ripple', 'swell', 'waves'];
    var smoothieApp = new SmoothApp(charts);
    smoothieApp.init();

    smoothieApp.run();
});
