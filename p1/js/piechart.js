function buildPieChart(csvFile, title, category, selector) {
  var	margin, width, height, chartWidth, chartHeight;

  var svg = d3.select(selector).append("svg")
  var chartLayer = svg.append("g").classed("chartLayer", true)

  d3.csv("data/uc_pd_tr.csv", main)

  function main(data) {
    // if (category == "UCD") {
    //   data = data.filter(function(d) { return d.UCD > 0.03; })
    // }
    setSize(data);
    drawChart(data, category);
  }

  function setSize(data) {
    // margin = {top: 30, right: 20, bottom: 30, left: 50},
    margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = 300,
    height = 300;

    chartWidth = width - (margin.left + margin.right)
    chartHeight = height - (margin.top + margin.bottom)

    svg.attr("width", width).attr("height", height)

    chartLayer
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("transform", "translate("+[margin.left, margin.top]+")")
  }

  function drawChart(data, school) {
    var arcs = d3.pie()
      .sort(null)
      .value(function(d) {
        if (school == "UCB") {
          return d.UCB;
        } else if (school == "UCD") {
          return d.UCD;
        } else if (school == "UCI") {
          return d.UCI;
        } else if (school == "UCLA") {
          return d.UCLA;
        } else if (school == "UCR") {
          return d.UCR;
        } else if (school == "UCSD") {
          return d.UCSD;
        } else if (school == "UCSB") {
          return d.UCSB;
        } else if (school == "UCSC") {
          return d.UCSC;
        } else {
          console.log("ERROR: data not found");
        }
      })

      // adjust for size of arc
      var arc = d3.arc()
        .outerRadius(chartHeight/2)
        .innerRadius(chartHeight/4)
        .padAngle(0.008)
        .cornerRadius(10)

      var tooltip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d, i) {
          return "Major: <span style='color:" + colorScale20(i) + "'>" + data[i].major + "</span>"
        })

      scatterPlot.call(tooltip);
      var pieG = chartLayer.selectAll("g")
        .data([data])
        .enter()
        .append("g")
        .attr("transform", "translate("+[chartWidth/2, chartHeight/2]+")")
        var slice = pieG.selectAll(".arc")
        .data(arcs)
        var newSlice = slice.enter().append("g").classed("arc", true)

      // var colorDomain = [0.1, 0.9, 0.11, 0.42]
      newSlice.append("path")
        .attr("fill", function(d, i) { return colorScale20(i); })
        .attr("d", arc)
        .attr("id", function(d, i) { return "arc-" + i })
        .attr("stroke", "gray")
        // .attr("fill", function(d,i){ return d3.interpolateRainbow(Math.random()); })
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);

      // add title in center
      newSlice.append("text")
        .attr("class", "pieTitle")
        .attr('dy', '0.35em')
        .attr("text-anchor", "middle")
        .text(title);



        // newBlock.append("text")
        //     .attr("dx", 55)
        //     .attr("dy", -5)
        //     .append("textPath")
        //     .attr("xlink:href", function(d, i) { return "#arc-" + i; })
        //     .text(function(d) { console.log(d); return d.data.name })
    }
}
