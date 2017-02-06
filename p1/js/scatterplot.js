// manually set margins
var margin = {top: 40, right: 20, bottom: 80, left: 110},
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

function loadScatterPlot(dfilter) {
  // load data from csv
  d3.csv("data/filteredschoolsucflag.csv", function(error, data) {
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
      .attr("y", margin.bottom - 20)
      // .attr("dx", "1em")
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
      .offset([0, -3])
      .html(function(d) {
        return "School Name: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style='color:#1F77B4'>"+ d.name + "</span><br>Acceptance Rate: &nbsp&nbsp<span style='color:#D62728'>" + d.adm_rate + "</span><br>Median Earnings:&nbsp&nbsp  <span style='color:#2CA02C'>" + d.earnings + "</span><br>Population: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span style='color:#FF7F0E'>" + d.pop + "</span>"
      })

    scatterPlot.call(tooltip);

    // var colors = [0.524, 0.046, 0.249, 0.753, 0.659, 0.123]

    // create points
    scatterPlot.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      // .filter(function(d) { return d.state == "CA" || d.state == "TX" || d.state == "FL" || d.state == "NY" || d.state == "IL"})
      // .attr("class", "dot")
      .attr("class", function(d) { return (d.ucflag == 1)?'ucdot':'dot'; })
      // radius
      .attr("r", 10)
      .attr("r", function(d) { return  d.pop/2000; })
      // x and y axis coords of the center of the element
      .attr("cx", function(d) { return x(d.adm_rate); })
      .attr("cy", function(d) { return y(d.earnings); })
      // .attr("fill", function(d,i){ return d3.interpolateRainbow(Math.random()) })
      // .attr("fill", function(d,i){ return d3.interpolateRainbow(colors[]); })
      .style("fill", function(d) { return colorScale20(d.state); })
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);
      // .each(function(d) {
      //   if (d.ucflag == 1) {
      //
      //   }
      //   return d;
      // }
            // var header = d3.select(this);
            // // loop through the keys - this assumes no extra data
            // d3.keys(d).forEach(function(key) {
            //     if (key != "data-name")
            //         header.attr(key, d[key]);
            // });





      // add legend
      var linearSize = d3.scaleLinear().domain([0,10]).range([10, 30]);

      scatterPlot.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20, 40)");

      // var legendSize = d3.legendSize()
      //   .scale(linearSize)
      //   .shape('square')
      //   .shapePadding(15)
      //   .labelOffset(20)
      //   .orient('horizontal');
      //
      // scatterPlot.select(".legendSize")
      //   .call(legendSize);

      // setTimeout(function() {
      //   legend
      //     .style("font-size","20px")
      //     .attr("data-style-padding",10)
      //     .call(d3.legend)
      // },1000)
    // var legend = scatterPlot.selectAll(".legend")
    //   .data(colorScale.domain())
    //   .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    //
    // legend.append("rect")
    //   .attr("x", width - 18)
    //   .attr("width", 18)
    //   .attr("height", 18)
    //   .style("fill", colorScale);
    //
    // legend.append("text")
    //   .attr("x", width - 24)
    //   .attr("y", 9)
    //   .attr("dy", ".35em")
    //   .style("text-anchor", "end")
    //   .text(function(d) { return d; });

  });
}
