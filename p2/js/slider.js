var width = 960, height = 100;
var margin = {right: 30, left: 30};

var svg = d3.select("#slider")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height)

var newWidth = width - margin.left - margin.right;

// var svg = d3.select("#slider"),
    // margin = {right: 50, left: 50},
    // width = +svg.attr("width") - margin.left - margin.right,
    // height = +svg.attr("height");

var xSlider = d3.scaleLinear()
    .domain([0, 180])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", xSlider.range()[0])
    .attr("x2", xSlider.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { moveSlider(xSlider.invert(d3.event.xSlider)); })
      );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(xSlider.ticks(10))
  .enter().append("text")
    .attr("x", xSlider)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "°"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

function moveSlider(val) {
  handle.attr("cx", xSlider(val));
}
