function updateHistogram(stationData) {
  var updateFunction = drawhistSVGContainerogram()
  histSVGContainer.datum(stationData).call(updateFunction)
}

function drawHistogram(filePath, currentStation) {
  var margin = {top: 10, right: 30, bottom: 60, left: 30},
      width = 1000 - margin.left - margin.right,
      height = 260 - margin.top - margin.bottom;

  var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)

  var histSVGContainer = d3.select("#histogram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xAxisLabel = histSVGContainer.append("text")
    .text("Rides by Hour")
    .attr("class", "histTitle")
    .style("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", 245);

  var allRides = 0;

  d3.csv(filePath, function(error, data) {
    // filter data by total users
    // var totalUsers = d3.keys(data[0]).filter(function(key) { return (key == "rides"); });
    // create new datapoint using map
    data.forEach(function(d) {
      // defines a new data field called totalRides that.....
      // d.totalRides = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
      d.totalRides = +d.rides
      d.hour = +d.hour

      // my counter
      allRides = allRides + d.totalRides;
    });

    console.log(allRides)
    // console.table(data);
    // console.log(data[0])
    // create tooltip
    // var tooltip = d3.tip()
    //   .attr("class", "d3-tip")
    //   .direction('n')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return d.properties.start_station
    //   })

    // map hours in data to x axis
    x.domain(data.map(function(d) { return d.hour; }));
    // compute upper bound of y domain
    y.domain([0, d3.max(data, function(d) { return d.totalRides })]);

    // add x axis
    histSVGContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var count = 0;
    // FIXME: replace with my data
    // var rideBar = histSVGContainer.selectAll("rect")
    // console.table(data)
    histSVGContainer.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.bandwidth())
      .attr("x", function(d) { return x(d.hour);  })
      .attr("y", function(d) { return y(d.totalRides); })
      .attr("height", function(d) {return height - y(d.totalRides); })

    var formatPercent = d3.format(",.1%");
    // CRAZY BUG
    histSVGContainer.selectAll("text.labels")
        .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", function(d, i) {
        return x(d.hour) + x.bandwidth() / 2;
      })
      .attr("y", function(d) {
          return y(d.totalRides) + 18;
      })
      .text(function(d) {
        percentRides = d.totalRides/allRides;
        if (percentRides > 0.012) {
          return formatPercent(percentRides);
        }
      });
  }) // end d3.csv()
} // end drawhistSVGContainerogram()
