/**
 * Created by atg on 08/04/2015.
 */


$(document).ready(function() {
    //Set up smoothie charts
    var smoothie = new SmoothieChart();
    smoothie.streamTo(document.getElementById("tide"));

    //Data
    var tide = new TimeSeries();

});