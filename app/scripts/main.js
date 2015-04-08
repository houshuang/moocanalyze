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
	.attr("width",800)
	.attr("height", App.forums_length * App.fontSize).append("g");
	return svg;
}

var translateString = function(d, i) {
	var ret = "translate(" + 
		(d.level * 10) + "," +
		(i * App.fontSize + 20) + ")"; 
	return ret;
}


var render = function(forums) {
	console.log("Rendering day " + App.day);
	var forums = App.forums['forums'];
	var svg = App.svg;

	var labels = svg.selectAll(".label")
	.data(forums, function(d) { return d.id });

	labels.enter()
	.append("text")
	.attr({
		"font-size": App.fontSize,
		transform: translateString
	})
	.style("font-weight", function(d) { return +d.level < 4 ? "bold" : null })
	.style("fill", function(d) { return +d.open_day > App.day ? "#CCCCCC" : null })
	.text(function(d) { return d.name; });

	labels.style("fill", function(d) { return +d.open_day > App.day ? "#CCCCCC" : null });

	labels.transition().delay(250).duration(1000)
	.attr("transform", translateString);

	labels.exit().transition()
	.attr("transform", translateString)
	.remove()
}

console.log("Starting d/l");
d3.json('http://localhost:5984/coursera_001_programming1/forums', 
	function(err, data) {
		if(err) { 
			console.error(err) 
		}
		else {
			App.forums = data;
			App.forums_length = data['forums'].length;
			App.svg = initialCanvas();
			render()
			App.day = 15;
			render()
		}
	}
);
