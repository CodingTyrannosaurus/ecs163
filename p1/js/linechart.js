// modification of http://bl.ocks.org/atmccann/8966400

function buildLineChart(csvFile) {

  var margin = {top: 40, right: 50, bottom: 20, left: 50},
      width = 1200 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%Y");

  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom()
      .scale(x)
      // .ticks(5)
      // .innerTickSize(15)
      // .outerTickSize(0)
      // .orient("bottom");

  // var yAxis = d3.lineChart.axis()
  var yAxis = d3.axisLeft()
      .scale(y)
      // .tickFormat(function(d) { return d + "%";})
      // .ticks(5)
      // .innerTickSize(15)
      // .outerTickSize(0)
      // .orient("left");

  // d3 line component
  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.debt); });

  var lineChart = d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // load data from csv
  d3.csv(csvFile, function(error, data) {
    if (error) throw error;

    // not sure about this
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var schools = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, debt: +d[name]};
        })
      };
    });


    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(schools, function(c) { return d3.min(c.values, function(v) { return v.debt; }); }),
      d3.max(schools, function(c) { return d3.max(c.values, function(v) { return v.debt; }); })
    ]);

    lineChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    lineChart.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    // lineChart.append("line")
    //       .attr(
    //       {
    //           "class":"horizontalGrid",
    //           "x1" : 0,
    //           "x2" : width,
    //           "y1" : y(0),
    //           "y2" : y(0),
    //           "fill" : "none",
    //           "shape-rendering" : "crispEdges",
    //           "stroke" : "black",
    //           "stroke-width" : "3px",
    //           "stroke-dasharray": ("3, 3")
    //       });


    var school = lineChart.selectAll(".school")
        .data(schools)
      .enter().append("g")
        .attr("class", "school");

    var path = lineChart.selectAll(".school").append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d, i) {
          if (d.name == "UCB") {
            return colorScale10(d.name);
          } else if (d.name == "UCD") {
            return colorScale10(d.name);
          } else if (d.name == "UCI") {
            return colorScale10(d.name);
          } else if (d.name == "UCLA") {
            return colorScale10(d.name);
          } else if (d.name == "UCR") {
            return colorScale10(d.name);
          } else if (d.name == "UCSD") {
            return colorScale10(d.name);
          } else if (d.name == "UCSB") {
            return colorScale10(d.name);
          } else if (d.name == "UCSC") {
            return colorScale10(d.name);
          } else {
            console.log("ERROR: data not found");
          }
        });

    // Calculate size for legend
    legendSpace = width/schools.length;

    // Add legend for each school
    schools.forEach(function(d, i) {
      lineChart.append("text")
          .attr("x", (legendSpace/2)+i*legendSpace)
          .attr("y", -15) // height* -1 - (margin.bottom/2)+ 5)
          .attr("class", "legend")
          .style("fill", function() {
              return d.color = colorScale10(d.name); })
          .text(d.name);
    })

  });
}
