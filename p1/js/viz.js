// manually set margins
var margin = {top: 40, right: 20, bottom: 60, left: 110},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    padding = 100;

// setup x scale
var x = d3.scaleLinear()
    .range([0, width]);

// setup y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// choose color scheme
var color = d3.scaleOrdinal(d3.schemeCategory10);

// create x axis
var xAxis = d3.axisBottom()
    .scale(x);

// create y axis
var yAxis = d3.axisLeft()
    .scale(y);

// create sized svg to draw on
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load csv data
d3.csv("ucdata.csv", function(error, data) {
  if (error) throw error;

  // convert strings in csv to integers
  data.forEach(function(d) {
    d.cost = +d.adm_rate;
    d.earnings = +d.earnings;
  });

  // use maximum and minimum values of data for x and y domain
  x.domain(d3.extent(data, function(d) { return d.adm_rate; })).nice();
  y.domain(d3.extent(data, function(d) { return d.earnings; })).nice();

  // append x axis to svg group
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  // text label for y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height/2))
    .attr("y", 0 - margin.left + 10)
    .attr("dy", "1em")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .text("Median Earnings 10 years after graduating ($)")

  // text label for x axis
  svg.append("text")
    .attr("transform", "translate("+ (width/2) +","+(width/2)+")")
    .attr("y", margin.bottom - 20)
    .attr("dx", "1em")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .text("Average Cost to Attend ($)");

  // append y axis to svg group
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  // create points
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      // radius
      .attr("r", 10)
      .attr("r", function(d) { return  d.pop/2000; })
      // x and y axis coords of the center of the element
      .attr("cx", function(d) { return x(d.adm_rate); })
      .attr("cy", function(d) { return y(d.earnings); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
