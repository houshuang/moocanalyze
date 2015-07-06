/* jshint devel:true */
'use strict';

var App = {
    "day": 0,
    "fontSize": 10
};

var addMeta = function addMeta(data, meta) {
    return(_.map(data, function(x) {
	x.meta = meta[x.id];
	return x; 
    }));
};

function initialCanvas() {
    var svg = d3.select("#d3").append("svg")
    .attr("width", 200 + App.courseMeta.maxForumlength * 5)
    .attr("height", App.forumsLength * App.fontSize).append("g");
    return svg;
}

var render = function(forums) {
    $("#day").html(App.day);
    var data = _.map(App.forums, function(x){
	x['forumThreads'] = App.forumThreads[x.id]
	return(x)
    });

    // LABELS

    var labels = App.svg.selectAll("g")
    .data(data, function(d) { return d.id });

    labels.enter()
    .append("g")
    .append('text')
    .attr({
	"font-size": App.fontSize,
	x: function (d, i) { return d.level * 10 },
	y: function (d, i) {return i * App.fontSize + 20 }
    })
    .style("font-weight", function(d) { return +d.level < 4 ? "bold" : null })
    .style("fill", function(d) { return +d.open_day > App.day ? "#CCCCCC" : null })
    .text(function(d) { return d.name; });

    labels.style("fill", function(d) { return +d.open_day > App.day ? "#CCCCCC" : null });

    labels.transition().delay(250).duration(1000)
    .style("fill", function(d) { return +d.open_day > App.day ? "#CCCCCC" : null })
    .attr({
	"font-size": App.fontSize,
	x: function (d, i) { return d.level * 10 },
	y: function (d, i) {return i * App.fontSize + 20 }
    });

    labels.exit().transition()
    .remove()

    // CIRCLES

    var circles = labels.selectAll("circle")
    .data( function(d) { return d.forumThreads }, function(d) { return d[0] });

    circles.enter()
    .append("circle")
    .attr({
	"cx": function(d, i) { return (i * 6 + 200) },
	"cy": function(d, i, j) { return (j * App.fontSize + 20)},
	"r": function(d, i) { return (Math.sqrt( Math.log(d[1]) / Math.log(App.courseMeta["maxThreadlength"])) * 3) + 0.4 },
	"fill": function(d, i) { return "#000000" }
    });

    circles.transition().delay(250).duration(1000)
    .attr({
	"cx": function(d, i) { return (i * 6 + 200) },
	"cy": function(d, i, j) { return (j * App.fontSize + 20)},
	"r": function(d, i) { return (Math.sqrt( Math.log(d[1]) / Math.log(App.courseMeta["maxThreadlength"])) * 3) + 0.4 },
	"fill": function(d, i) { return "#000000" }
    });

    circles.exit().transition()
    .remove()

}

App.rooturl = "http://localhost:5984/"
App.course = "coursera_001_programming1"

function urlBase(key) {
    return App.rooturl + App.course + "/" + key
}

function initialLoad(err, forums, forumThreads, courseMeta) {
    if(err) {
	console.error(err)
    } else
	{
	    App.forums = forums['content'];
	    App.forumsLength = App.forums.length;

	    App.forumThreads = forumThreads['content'];
	    App.courseMeta = courseMeta['content'];

	    App.svg = initialCanvas();
	    render();
	}
}

function updateDay(err, data) {
    if(err) {
	console.error(err)
    } else
	{
	    App.forumThreads = data;
	    render();
	}
}


function changeDay(day) {
    App.day = day;
    d3.json( urlBase("forumThreads_" + App.day), updateDay) 
}

queue()
.defer(d3.json, urlBase("forums")) 
.defer(d3.json, urlBase("forumThreads_1")) 
.defer(d3.json, urlBase("course_meta"))
.await(initialLoad); 

$( document ).ready(function() {
    key('0', function(){ App.day = 0; render(); return false;});
    key('shift+right', function(){ changeDay(App.day + 1); return false });
    key('shift+left', function(){ changeDay(App.day - 1); return false });
});
