var width,height
var chartWidth, chartHeight
var margin
var svg = d3.select("#pie").append("svg")
var chartLayer = svg.append("g").classed("chartLayer", true)

function drawPieChart() {

  // use d3 module to calculate pie chart angles
  var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.pd1; });

  // calculate pie chart radius
  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
    // insert more styles

  // var arcs = pie(data);

  // load data from csv
  d3.csv('datawithdegree.csv', function(error, data) {
    if (error) throw error;

    data = data.filter(function(d) { return d.state == "CA"; })

      var g = pieChart.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
          .attr("class", "arc");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return colorScale(d.name); });

      g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name; });



  });
}
