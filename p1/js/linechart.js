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



    // not sure what this is doing
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

    // create tooltip


    var school = lineChart.selectAll(".school")
        .data(schools)
      .enter().append("g")
        .attr("class", "school");

    // Calculate size for legend
    legendSpace = height/schools.length;

    // Add legend for each school
    schools.forEach(function(d, i) {

    lineChart.selectAll(".school").append("path")
      .attr("class", "line")
      .style("stroke", function(d, i) {
        if (d.name == "UCB") {
          return color(d.name);
        } else if (d.name == "UCD") {
          return color(d.name);
        } else if (d.name == "UCI") {
          return color(d.name);
        } else if (d.name == "UCLA") {
          return color(d.name);
        } else if (d.name == "UCR") {
          return color(d.name);
        } else if (d.name == "UCSD") {
          return color(d.name);
        } else if (d.name == "UCSB") {
          return color(d.name);
        } else if (d.name == "UCSC") {
          return color(d.name);
        } else {
          console.log("ERROR: data not found");
        }
      })
      .attr("id", d.name)
      .attr("d", function(d) { return line(d.values); });

      lineChart.append("text")
        .attr("x", 10 + (legendSpace/2))
        .attr("y", 20 + 40 * i) // height* -1 - (margin.bottom/2)+ 5)
        .attr("class", "legend")
        .style("fill", function() {
            return d.color = color(d.name); })
        .on("click", function() {
          // d3.selectAll(".line").style("opacity", 0);
          // Determine if current line is visible
          var active = d.active ? false : true,
          newOpacity = active ? 0 : 1;
          // Hide or show the elements based on the ID

          d3.select("#" + d.name)
            // .transition().duration(100)
            // .style("opacity", newOpacity);
            .transition().duration(500)
            .style("stroke-width", "10px");
          // Update whether or not the elements are active

          d.active = active;
        }) // end onclick
        .text(d.name)
      }) // end first foreach

        // .html(function() {
        //   return te;
        // })

      // add tooltip to circles on line chart
      var tooltip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d, i) {
          return "School: <span style='color:" + color(d.name) + "'>" + d.name + "</span>"
        })

      lineChart.call(tooltip);

      schools.forEach(function(d, i) {
        console.log(d.values[i].debt)

        lineChart.selectAll(".circle")
         .data(data)
         .enter()
         .append("svg:circle")
         .attr("class", "circle")
         .attr("cx", function (d) {
            return x(d.date);
         })
         .attr("cy", function (d) {
          //  console.log(d)
          //  console.log(d.UCB)
           return y(d.UCD);
         })
         .attr("r", 5)
         .on('mouseover', tooltip.show)
         .on('mouseout', tooltip.hide);

     })// end 2nd foreach
    // })
  });
}
