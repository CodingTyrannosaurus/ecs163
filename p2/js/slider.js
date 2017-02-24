function drawSlider(fileName) {
  var parseDate = d3.timeParse("%m/%d/%y");

  var width = 960, height = 100;
  var margin = {right: 30, left: 30, top: 10, bottom: 10};

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

  d3.csv("data/factorsSF.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    xSlider.domain(d3.extent(data, function(d) { return d.date; }));

    var xAxis = d3.axisBottom()
      .scale(xSlider)

    svg.append("g")
      .attr("class", "x axis")
      .attr("id", "sliderAxis")
      .attr("transform", "translate(30," + height / 2.3 + ")")
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

    // slider.insert("g", ".track-overlay")
    //     .attr("class", "ticks")
    //     .attr("transform", "translate(0," + 18 + ")")
    //   .selectAll("text")
    //   .data(data)
    //   .enter().append("text")
    //     .attr("x", xSlider)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return d.date; });

    var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

    function moveSlider(date) {
      var sliderDay = d3.timeDay.floor(date);
      // console.log(sliderDay)
      // console.log(data[0].date)
      var dataForDay = data.filter(function(d) { console.log(); return (d.date.getTime() == sliderDay.getTime()); })[0];
      $("#temperature").replaceWith("<div id=\"temperature\">" + dataForDay.temp + "°" + "</div>")
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

      // console.log(d.customer)
      handle.attr("cx", xSlider(date));
    }
  });
}
