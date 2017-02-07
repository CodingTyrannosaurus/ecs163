// modification of http://bl.ocks.org/atmccann/8966400

function buildLineChart(csvFile) {

  var margin = {top: 20, right: 50, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 680 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%Y-%m-%d");

  var x = d3.scaleTime()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

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

  var line = d3.line()
      .curve(d3.curveBasis)
      // .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.price); });


  var lineChart = d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("airbus_data.tsv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var companies = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, price: +d[name]};
        })
      };
    });


    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(companies, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
      d3.max(companies, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
    ]);

    lineChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    lineChart.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    lineChart.append("line")
          .attr(
          {
              "class":"horizontalGrid",
              "x1" : 0,
              "x2" : width,
              "y1" : y(0),
              "y2" : y(0),
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke" : "black",
              "stroke-width" : "1px",
              "stroke-dasharray": ("3, 3")
          });


    var company = lineChart.selectAll(".company")
        .data(companies)
      .enter().append("g")
        .attr("class", "company");



    var path = lineChart.selectAll(".company").append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { if (d.name == "Airbus")
                                          {return "rgb(000,255,000)"}
                                        else {return "#000";}
                                           });
  });
}
