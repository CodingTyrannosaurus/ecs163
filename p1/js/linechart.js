// modification of http://bl.ocks.org/atmccann/8966400

function toggleLine(schoolID) {
  var school = "#" + schoolID,
  stroke = $(school).css('stroke-width');

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
  var margin = {top: 5, right: 50, bottom: 50, left: 80},
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%Y");

  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom()
      .scale(x)

  var yAxis = d3.axisLeft()
      .scale(y)

  // d3 line component
  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.debt); });

  // append linechart to svg
  var lineChart = d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // load data from csv
  d3.csv(csvFile, function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    // create map from school names to dates/debt
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

      // text label for y axis
      lineChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Median Debt After Graduating ($)")

      // text label for x axis
      lineChart.append("text")
        .attr("transform", "translate("+ (width/2) +","+ height +")")
        .attr("y", margin.bottom)
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Year");
  });
}
