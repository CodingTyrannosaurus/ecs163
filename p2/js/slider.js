var firstSlide = true;

function drawSlider(fileName) {
  var parseDate = d3.timeParse("%m/%d/%y");

  var width = 960, height = 100;
  var margin = {right: 20, left: 60, top: 10, bottom: 10};

  var svg = d3.select("#slider")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var newWidth = width - margin.left - margin.right;

  var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 3 + ")");

  var xSlider = d3.scaleTime()
    .range([0, width])
    .clamp(true);

  d3.csv(fileName, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.totalCust = +d.totalCust;
    });

    xSlider.domain(d3.extent(data, function(d) { return d.date; }));

    var xAxis = d3.axisBottom()
      .scale(xSlider)

    svg.append("g")
      .attr("class", "x axis")
      .attr("id", "sliderAxis")
      .attr("transform", "translate(" + margin.left + "," + 40 + ")")
      .call(xAxis);

    slider.append("line")
      .data(data)
      .attr("class", "track")
      .attr("x1", xSlider.range()[0])
      .attr("x2", xSlider.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function(d) { moveSlider(xSlider.invert(d3.event.x)); }));

    var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

    function moveSlider(date) {

      if (firstSlide) {
        showAllRides();
        firstSlide = false;
      }

      var sliderDay = d3.timeDay.floor(date);
      var maxCustomers = d3.max(data, function(d) { return d.totalCust });

      var dataForDay = data.filter(function(d) { console.log(); return (d.date.getTime() == sliderDay.getTime()); })[0];

      var dateFormat = d3.timeFormat('%A, %b %d %Y');
      var prettyDate = dateFormat(dataForDay.date);

      if (dataForDay.rain == 1) {
        $("#rain").css('opacity', '1.0');
      } else {
        $("#rain").css('opacity', '0.2');
      }

      if (dataForDay.Giants == 1) {
        $("#giants").css('opacity', '1.0');
      } else {
        $("#giants").css('opacity', '0.2');
      }

      if (dataForDay.holiday == 1) {
        $("#holiday").css('opacity', '1.0');
      } else {
        $("#holiday").css('opacity', '0.2');
      }

      $("#temperature").replaceWith("<div id=\"temperature\">" + dataForDay.temp + "°" + "</div>");
      $("#date").replaceWith("<div id=\"date\">" + prettyDate + "</div>")

      handle.attr("cx", xSlider(date));

      // update guage to customers in that day
      custPercent = dataForDay.totalCust/maxCustomers;
      needle.moveTo(custPercent);
    }

    function showAllRides() {
      // update histogram and label to all rides
      d3.selectAll(".cityLabel")
        .text(function() {
          return "All Stations";
        })

      updateHistogram("data/hourlyRides.csv", "all");
      // deselect red station
      d3.selectAll(".marker")
        .style("fill", "#31a354")
        .style("stroke-width", "1px");
    }
  });
}
