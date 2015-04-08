/**
 * Created by DrTone on 08/04/2015.
 */

//Base app for smooth graphing applications

function BaseSmoothApp(containers) {
    this.containers = containers;
    this.projector = null;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timeSeries = [];
    this.smoothies = [];
}

BaseSmoothApp.prototype.init = function() {
    for(var i=0; i<this.containers.length; ++i) {
        this.smoothies.push(new SmoothieChart( {millisPerPixel:90} ));
        this.smoothies[i].streamTo(document.getElementById(this.containers[i]), 1);
        this.timeSeries.push(new TimeSeries());
        this.smoothies[i].addTimeSeries(this.timeSeries[i]);
    }
};

BaseSmoothApp.prototype.update = function() {
    //Perform any updates

};

BaseSmoothApp.prototype.run = function() {
    var _this = this;
    this.update();
    requestAnimationFrame(function() { _this.run(); });
};
