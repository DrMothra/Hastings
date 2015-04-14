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
    var canvas;
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    for(var i=0; i<this.containers.length; ++i) {
        this.smoothies.push(new SmoothieChart( {grid:{fillStyle: this.containers[i].background, strokeStyle: 'transparent'}, millisPerPixel:this.mmPerPixel,
            labels: {disabled: true}, maxValue: this.containers[i].max, minValue: this.containers[i].min, maxValueScale: this.containers[i].maxScale,
                minValueScale: this.containers[i].minScale }));
        canvas = document.getElementById(this.containers[i].id);
        canvas.width = pageWidth * this.containers[i].width;
        canvas.height = pageHeight * this.containers[i].height;
        this.smoothies[i].streamTo(canvas, this.containers[i].delay);

        this.timeSeries.push(new TimeSeries());
        this.smoothies[i].addTimeSeries(this.timeSeries[i], { lineWidth: this.lineWidth, strokeStyle: this.containers[i].line });
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
