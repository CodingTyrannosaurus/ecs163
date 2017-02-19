function updateHistogramData(stationData) {
  var updateFunction = drawHistogram()
  hist.datum(stationData).call(updateFunction)
}


function drawHistogram(filePath, currentStation) {
  var margin = {top: 10, right: 30, bottom: 60, left: 30},
      width = 900 - margin.left - margin.right,
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

  var hist = d3.select("#histogram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xAxisLabel = hist.append("text")
    .text("Rides by Hour")
    .attr("class", "histTitle")
    .style("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", 245);

  d3.csv(filePath, function(error, data) {
    // filter data by total users
    // var totalUsers = d3.keys(data[0]).filter(function(key) { return (key == "rides"); });
    // create new datapoint using map
    data.forEach(function(d) {
      // defines a new data field called totalRides that.....
      // d.totalRides = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
      d.totalRides = +d.rides
      d.hour = +d.hour
      // console.log(d.totalRides)
    });

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
    // y.domain([0, 100])//d3.max(data, function(d) { return d3.max(d.totalRides, function(d) { return d.totalRides; }); })]);
    y.domain([0, d3.max(data, function(d) { return d.totalRides })]);
    // y.domain([0, 15670]);
      //
      // console.log(d3.max(data, function(d) { return d.totalRides; }))
      //
      //  return d3.max(data, function(d) { return d.totalRides; }); })]);

    // add x axis
    hist.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var count = 0;
    // FIXME: replace with my data
    var rideBar = hist.selectAll("rect")
      .data(data)
      // .data(function(d) { console.log(d); })
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.bandwidth())
      .attr("x", function(d) { return x(d.hour);  })
      .attr("y", function(d) { return y(d.totalRides); })
      .attr("height", function(d) {
        // console.log("bad height" + d.totalRides)
        count++;
        return height - y(d.totalRides); })

    hist.selectAll("text")
      .data(data)
      .enter().append("text")
        .text(function(d) {
          // console.log(d.totalRides);
          return d.totalRides;
        })
        .attr("x", function(d, i) {
          return 280;
          //  return i * (width / data.length) + 5;
        })
        .attr("y", function(d) {
          return 9;
          //  return height - (d.totalRides * 4) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");

    // text on each bar
    // rideBar.append("text")
    //   .attr("dy", ".75em")
    //   .attr("y", 6)
    //   .attr("x", 20)
    //   .attr("text-anchor", "middle")

    console.log(count)
  }) // end d3.csv()
} // end drawHistogram()
