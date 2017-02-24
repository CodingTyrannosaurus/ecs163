// TODO: Write function to choose each station's most popular timeslot
function getPopularStationTimes(data) {
  return data.filter(function(d) { return d.rides > 50; })
}

// initial histogram container setup
var histMargin = {top: 10, right: 30, bottom: 60, left: 30},
    histWidth = 800 - histMargin.left - histMargin.right,
    histHeight = 220 - histMargin.top - histMargin.bottom;

var histX = d3.scaleBand()
  .rangeRound([0, histWidth])
  .padding(0.1);

var histY = d3.scaleLinear()
  .range([histHeight, 0]);

var xAxis = d3.axisBottom()
  .scale(histX)

var yAxis = d3.axisLeft()
  .scale(histY)

function drawHistogram(filePath) {

  var x = histX;
  var y = histY;

  var histSVGContainer = d3.select("#histogram")
    .append("svg")
    .attr("width", histWidth + histMargin.left + histMargin.right)
    .attr("height", histHeight + histMargin.top + histMargin.bottom)

  var xAxisLabel = histSVGContainer.append("text")
    .text("Rides by Hour (% Total Rides)")
    .attr("class", "histTitle")
    .attr("transform", "translate("+ (histWidth/2) +","+ histHeight +")")
    // .attr("y", histMargin.bottom - 10)
    .style("text-anchor", "middle")
    // .attr("x", width/2)
    .attr("y", histMargin.bottom);

    // count total # of rides for percentage calculation
    var allRides = 0;

    // all data usage must occur in async d3.csv call
    d3.csv(filePath, function(error, data) {
      // use first station on initial load, user never sees this
      var data = data.filter(function(d) { return (d.station == "2nd at Folsom" && d.hour > 5 && d.hour < 22); })

      data.forEach(function(d) {
        d.date = new Date(2017, 0, 0, d.hour, 0, 0)
        d.rides = +d.rides
        d.hour = +d.hour
        allRides = allRides + d.rides;
      });

      // map hours in data to x axis
      x.domain(data.map(function(d) { return d.date; }));
      // compute upper bound of y domain
      y.domain([0, d3.max(data, function(d) { return d.rides })]);

      // add x axis
      histSVGContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + histHeight + ")")
        .call(
          xAxis.tickFormat(d3.timeFormat("%_I%p"))
        );

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

      var percentLabels = histSVGContainer.selectAll("text.label")
          .data(data)
        .enter().append("text")
        .attr("class", "label")
    }) // end d3.csv()
} // end drawHistogram()


function updateHistogram(filePath, currentStation) {

  var x = histX;
  var y = histY;

  var histSVGContainer = d3.select("#histogram")

  // count total # of rides for percentage calculation
  var allRides = 0;

  // all data usage must occur in async d3.csv call
  d3.csv(filePath, function(error, data) {
    // filter data based on station
    var data = data.filter(function(d) { return (d.station == currentStation && d.hour > 5 && d.hour < 22); })

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
      .attr("height", function(d) { return histHeight - y(d.rides); })

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
          return formatPercent((Math.round(100 * percentRides)/100));
        }
      });
  }) // end d3.csv()
} // end updateHistogram()
