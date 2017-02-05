// manually set margins
var margin = {top: 40, right: 20, bottom: 80, left: 110},
    width = 960 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

// setup x scale
var x = d3.scaleLinear()
    .range([0, width]);

// setup y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// choose color scheme
var colorScale = d3.scaleOrdinal(d3.schemeCategory10)// .domain([1,2,3,6,7,8,9,10]);

// create x axis
var xAxis = d3.axisBottom()
    .scale(x);

// create y axis
var yAxis = d3.axisLeft()
    .scale(y);

// Adds the svg canvas to draw on
var scatterPlot = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

loadScatterPlot("US");

// Adds the svg canvas to draw on
// var pieChart = d3.select("#pie")
//   .append("svg")
//     .attr("width", width)// + margin.left + margin.right)
//     .attr("height", height)// + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// drawPieChart();
