function drawHistogram(stationData) {
  var data = d3.range(1000).map(d3.randomBates(10));

  var formatCount = d3.format(",.0f");

  // parse the date / time
  var parseDate = d3.timeParse("%d-%m-%Y");

  var margin = {top: 10, right: 30, bottom: 20, left: 30},
      width = 900 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var x = d3.scaleTime()
    .domain([new Date(2017, 1, 1), new Date(2017, 1, 2)])
    .nice(d3.timeHour)
    .rangeRound([0, width]);

  var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(10))
      (data);

  var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0]);

  var hist = d3.select("#histogram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  var g = hist.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = g.selectAll(".bar")
    .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); });

  // text on each bar
  bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatCount(d.length); });

  // x axis
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom()
        .scale(x)
        .ticks(12).tickFormat(d3.timeFormat("%_I %p")));
      // .call(d3.axisBottom(x));
} // end drawHistogram
