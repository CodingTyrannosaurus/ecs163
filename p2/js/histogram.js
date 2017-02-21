// TODO: Write function to choose each station's most popular timeslot
function getPopularStationTimes(data) {
  return data.filter(function(d) { return d.rides > 50; })
}

// initial histogram container setup

var margin = {top: 10, right: 30, bottom: 60, left: 30},
    width = 800 - margin.left - margin.right,
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


function drawHistogram(filePath) {
  var histSVGContainer = d3.select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var xAxisLabel = histSVGContainer.append("text")
    .text("Rides by Hour (% Total Rides)")
    .attr("class", "histTitle")
    .style("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", 245);

    // count total # of rides for percentage calculation
    var allRides = 0;

    // all data usage must occur in async d3.csv call
    d3.csv(filePath, function(error, data) {
      // use first station on initial load, user never sees this
      var data = data.filter(function(d) { return (d.station == "2nd at Folsom" && d.hour > 5); })

      data.forEach(function(d) {
        d.rides = +d.rides
        d.hour = +d.hour
        allRides = allRides + d.rides;
      });

      // map hours in data to x axis
      x.domain(data.map(function(d) { return d.hour; }));
      // compute upper bound of y domain
      y.domain([0, d3.max(data, function(d) { return d.rides })]);

      // add x axis
      histSVGContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // create tooltip
      var tooltip = d3.tip()
        .attr("class", "d3-tip")
        .direction('n')
        .offset([-10, 0])
        .html(function(d) {
          return d.rides + " rides"
        })

      histSVGContainer.call(tooltip)

      // I add all the visual calculations in update because first run isn't visible

      histSVGContainer.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .on("mouseover", function(d) {
          tooltip.show(d)
          selectPopularStations(d.hour, d.station)
          d3.select(this)
            .style("fill", "#43a2ca");
        })
        .on("mouseout", function(d) {
          tooltip.hide(d)
          d3.select(this)
            .style("fill", "#7BC8BD");
        })

      // var formatPercent = d3.format(",.0%");
      var percentLabels = histSVGContainer.selectAll("text.label")
          .data(data)
        .enter().append("text")
        .attr("class", "label")
    }) // end d3.csv()
} // end drawHistogram()


function updateHistogram(filePath, currentStation) {
  var histSVGContainer = d3.select("#histogram")

  // count total # of rides for percentage calculation
  var allRides = 0;

  // all data usage must occur in async d3.csv call
  d3.csv(filePath, function(error, data) {
    // filter data based on station
    var data = data.filter(function(d) { return (d.station == currentStation && d.hour > 5); })
    // var data = data.filter(function(d) { return d.hour > 5; })


    data.forEach(function(d) {
      d.rides = +d.rides
      d.hour = +d.hour
      allRides = allRides + d.rides;
    });

    // map hours in data to x axis
    x.domain(data.map(function(d) { return d.hour; }));
    // compute upper bound of y domain
    y.domain([0, d3.max(data, function(d) { return d.rides })]);

    // NO NEED TO APPEND, already appended in initial load!
    histSVGContainer.selectAll("rect")
      .data(data)
      .transition()
      .duration(400)
      .attr("width", x.bandwidth())
      .attr("x", function(d) { return x(d.hour); })
      .attr("y", function(d) { return y(d.rides); })
      .attr("height", function(d) { return height - y(d.rides); })

    var formatPercent = d3.format(",.0%");
    histSVGContainer.selectAll("text.label")
        .data(data)
        .transition().duration(400)
      .attr("class", "label")
      .attr("x", function(d, i) {
        return x(d.hour) + x.bandwidth() / 2;
      })
      .attr("y", function(d) {
          return y(d.rides) + 18;
      })
      .text(function(d) {
        percentRides = d.rides/allRides;
        if (percentRides > 0.015) {
          return formatPercent(percentRides);
        }
      });
  }) // end d3.csv()
} // end updateHistogram()

// var times = getPopularStationTimes(data);
// console.log(times)
// console.table(getPopularStationTimes(data));
