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
    this.mmPerPixel = 60;
    this.lineWidth = 2;
}

BaseSmoothApp.prototype.setPixelDist = function(pixelDist) {
    this.mmPerPixel = pixelDist;
};

BaseSmoothApp.prototype.setLineWidth = function(lineWidth) {
    this.lineWidth = lineWidth;
};

BaseSmoothApp.prototype.init = function() {
    var elem, parentWidth;
    for(var i=0; i<this.containers.length; ++i) {
        this.smoothies.push(new SmoothieChart( {grid:{fillStyle: this.containers[i].background, strokeStyle: 'transparent'}, millisPerPixel:this.mmPerPixel} ));
        this.smoothies[i].streamTo(document.getElementById(this.containers[i].id), 1);
        //Set dimensions

        elem = $('#'+this.containers[i].id);
        parentWidth = elem.parent().width();
        var canvas = document.getElementById(this.containers[i].id);
        canvas.width = parentWidth*0.95;
        //elem.css("width", parentWidth*0.9+"px");
        //document.getElementById(this.containers[i].id).style.height = "200px";
        //elem.css("height", window.innerHeight * this.containers[i].height + "px");
        canvas.height = window.innerHeight * this.containers[i].height;

        this.timeSeries.push(new TimeSeries());
        this.smoothies[i].addTimeSeries(this.timeSeries[i], { lineWidth: this.lineWidth, strokeStyle: this.containers[i].line
            });
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
