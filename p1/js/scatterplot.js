function loadScatterPlot(dfilter) {
  // load data from csv
  d3.csv("data/filteredSchools.csv", function(error, data) {
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
        return "School Name: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style='color:#3498db'>"+ d.name + "</span><br>Acceptance Rate: <span style='color:#e74c3c'>" + d.adm_rate + "</span><br>Median Earnings:  <span style='color:#2ecc71'>" + d.earnings + "</span>"
      })

    scatterPlot.call(tooltip);

    // var colors = [0.524, 0.046, 0.249, 0.753, 0.659, 0.123]

    // create points
    scatterPlot.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .filter(function(d) { return d.state == "CA" || d.state == "TX" || d.state == "FL" || d.state == "NY" || d.state == "IL"})
      .attr("class", "dot")
      // radius
      .attr("r", 10)
      .attr("r", function(d) { return  d.pop/2000; })
      // x and y axis coords of the center of the element
      .attr("cx", function(d) { return x(d.adm_rate); })
      .attr("cy", function(d) { return y(d.earnings); })
      // .attr("fill", function(d,i){ return d3.interpolateRainbow(Math.random()) })
      // .attr("fill", function(d,i){ return d3.interpolateRainbow(colors[]); })
      .style("fill", function(d) { return colorScale(d.state); })
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);

    var legend = scatterPlot.selectAll(".legend")
      .data(colorScale.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  });
}
