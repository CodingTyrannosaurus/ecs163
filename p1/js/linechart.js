// modification of http://bl.ocks.org/atmccann/8966400

function toggleLine(schoolID) {
  var school = "#" + schoolID,
  stroke = $(school).css('stroke-width');

  console.log(stroke)

  d3.select(school)
    .transition().style("stroke-width", function() {
      if (stroke == '1.5px') {
        return '8px';
      } else {
        return '1.5px';
      }
    });
}

function buildLineChart(csvFile) {

  var margin = {top: 5, right: 50, bottom: 20, left: 50},
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

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
      // makes space for button
      d3.max(schools, function(c) { return d3.max(c.values, function(v) { return v.debt + 1000; }); })
    ]);

    lineChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    lineChart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // create tooltip
    legendSpace = height/schools.length;
    var school = lineChart.selectAll(".line")
      .data(schools)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("id", function(d) {return "line" + d.name})
      .style("stroke", function(d, i) {
        return color(d.name);
      })
      .attr("d", function(d) { return line(d.values); });

      lineChart.append("foreignObject")
        .attr("width", 900)
        .attr("height", 500)
        .append("xhtml:div")
        .attr("class", "legend")
        .style("font", "14px 'Helvetica Neue'")
        .html("<button class='filterButton btn' id='filterUCB' role='button' aria-pressed='true' onclick='toggleLine(\"lineUCB\")'>UCB</button><button class='filterButton btn' id='filterUCD' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCD\")'>UCD</button><button class='filterButton btn' id='filterUCI' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCI\")'>UCI</button><button class='filterButton btn' id='filterUCLA' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCLA\")'>UCLA</button><button class='filterButton btn' id='filterUCR' role='button' aria-pressed='false'  onclick='toggleLine(\"lineUCR\")'>UCR</button><button class='filterButton btn' id='filterUCSD' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCSD\")'>UCSD</button><button class='filterButton btn' id='filterUCSB' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCSB\")'>UCSB</button><button class='filterButton btn' id='filterUCSC' role='button' aria-pressed='false' onclick='toggleLine(\"lineUCSC\")'>UCSC</button>");
    }); // end csv load
  }
  //
  // lineChart.append("text")
  //   .attr("x", 10 + (legendSpace/2))
  //   .attr("y", 20 + 40 * i) // height* -1 - (margin.bottom/2)+ 5)
  //   .attr("class", "legend")
  //   .style("fill", function() {
  //       return d.color = color(d.name);
  //     })
  //     .on("click", function() {
  //       // Determine if current line is visible
  //       var active = d.active ? false : true,
  //       newOpacity = active ? 0 : 1;
  //       // Hide or show the elements based on the ID
  //
  //       d3.select("#line" + d.name)
  //         // .style("stroke-width", "20px");
  //         d.active = active;
  //
  //       console.log("#line" + d.name)
  //     }) // end onclick
  // .text(d.name)
  // }) // end foreach loop

  // d3.select('#testLine').style("stroke-width", "10px");
  // d3.select('#testLine').attr("opacity", 0);
  // .style("color", "black")
  // .transition().duration(100)
  // .transition().duration(1000)
  // .style("stroke", "red")
  // Update whether or not the elements are active

        // .html(function() {
        //   return te;
        // })

      // TOOLTIP CODE
      /*
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

     */


// .transition()
// .duration(2500)
// .delay(function(d) { return d * 40; })
// .on("start", function repeat() {
//     d3.active(this)
//         .attr("cx", width)
//       .transition()
//         .attr("cx", 0)
//       .transition()
//         .on("start", repeat);
// });
