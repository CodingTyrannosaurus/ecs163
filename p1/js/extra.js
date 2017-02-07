// // Update data section (Called from the onclick)
// function filterData(selection) {
//     // Get the data again
//     d3.csv("data/filteredschools.csv", function(error, data) {
//         if (error) throw error;
//
//         // convert strings in csv to integers
//         data.forEach(function(d) {
//           d.cost = +d.adm_rate;
//           d.earnings = +d.earnings;
//         });
//
//
//         // use maximum and minimum values of data for x and y domain
//         x.domain(d3.extent(data, function(d) { return d.adm_rate; })).nice();
//         y.domain(d3.extent(data, function(d) { return d.earnings; })).nice();
//
//     // Select the section we want to apply our changes to
//     var svg = d3.select("#scatter").transition();
//
//     svg.selectAll(".dot")
//       .attr("r", 20);
//     // Make the changes
//
//
//         //     .duration(750)
//         //     .attr("d", valueline(data));
//         // svg.select(".x.axis") // change the x axis
//         //     .duration(750)
//         //     .call(xAxis);
//         // svg.select(".y.axis") // change the y axis
//         //     .duration(750)
//         //     .call(yAxis);
//
//     });
// // }
//
//
//     if (dfilter == "US") {
//       console.log("US");
//     } else if (dfilter == 'CA') {
//       data.filter(function(d) { return d.state == "CA" });
//     } else if (dfilter == "top5") {
//       data.filter(function(d) { return d.state == "CA" || d.state == "TX" || d.state == "FL" || d.state == "NY" || d.state == "IL"});
//     }



        // var colors = [0.524, 0.046, 0.249, 0.753, 0.659, 0.123]
        // .filter(function(d) { return d.state == "CA" || d.state == "TX" || d.state == "FL" || d.state == "NY" || d.state == "IL"})
        // .attr("class", "dot")

        // add legend
        // var linearSize = d3.scaleLinear().domain([0,10]).range([10, 30]);
        //
        // scatterPlot.append("g")
        //   .attr("class", "legendSize")
        //   .attr("transform", "translate(20, 40)");
        //

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




              // newBlock.append("text")
              //     .attr("dx", 55)
              //     .attr("dy", -5)
              //     .append("textPath")
              //     .attr("xlink:href", function(d, i) { return "#arc-" + i; })
              //     .text(function(d) { console.log(d); return d.data.name })
