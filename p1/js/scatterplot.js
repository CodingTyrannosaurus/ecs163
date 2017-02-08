// modification of http://bl.ocks.org/weiglemc/6185069

function buildScatterPlot(csvFile) {
  var margin = {top: 40, right: 20, bottom: 60, left: 110},
      width = 960 - margin.left - margin.right,
      height = 680 - margin.top - margin.bottom,
      radius = Math.min(width, height) / 2;

  // setup x scale
  var x = d3.scaleLinear()
      .range([0, width]);

  // setup y scale
  var y = d3.scaleLinear()
      .range([height, 0]);

  // create x axis
  var xAxis = d3.axisBottom()
      .scale(x);

  // create y axis
  var yAxis = d3.axisLeft()
      .scale(y);

  // Adds the svg canvas to draw on
  var scatterPlot = d3.select("#scatter")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  loadScatterPlot();

  function loadScatterPlot() {
    // load data from csv
    d3.csv(csvFile, function(error, data) {
      if (error) throw error;

      // use maximum and minimum values of data for x and y domain
      x.domain(d3.extent(data, function(d) { return d.adm_rate; })).nice();
      y.domain(d3.extent(data, function(d) { return d.earnings; })).nice();

      // append x axis to svg group
      scatterPlot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

      // text label for y axis
      scatterPlot.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - margin.left + 10)
        .attr("dy", "1em")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Median Earnings 10 years after graduating ($)")

      // text label for x axis
      scatterPlot.append("text")
        .attr("transform", "translate("+ (width/2) +","+ height +")")
        .attr("y", margin.bottom - 10)
        .attr("class", "label")
        .style("text-anchor", "middle")
        .text("Acceptance Rate");

      // append y axis to svg group
      scatterPlot.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      // create tooltip
      var tooltip = d3.tip()
        .attr("class", "d3-tip")
        .direction('ne')
        .offset([0, -5])
        .html(function(d, i) {
          return "School Name: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style='color:" + colorScale20(d.state) + "'>" + d.name +
          "</span><br>Acceptance Rate: &nbsp&nbsp<span style='color:" + colorScale20(d.state) + "'>" + d.adm_rate +
          "</span><br>Median Earnings:&nbsp&nbsp&nbsp<span style='color:" + colorScale20(d.state) + "'>" + d.earnings +
          "</span><br>Population: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span style='color:" + colorScale20(d.state) + "'>" + d.pop + "</span>"
        })

      scatterPlot.call(tooltip);

      // create points
      scatterPlot.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("fill", function(d) { return colorScale20(d.state); })
        .attr("class", function(d) { return (d.ucflag == 1)?'ucdot':'dot'; })
        // radius
        .attr("r", function(d) { return  d.pop/2000; })
        // x and y axis coords of the center of the element
        .attr("cx", function(d) { return x(d.adm_rate); })
        .attr("cy", function(d) { return y(d.earnings); })
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);
    });
  }
  $(".filterUC").click(function() {
    $(".dot").animate({'fill-opacity': '0.15'}, 800);
  });

  $(".filterUS").click(function() {
    $(".dot").animate({'fill-opacity': '0.8'}, 800);
  });
}
