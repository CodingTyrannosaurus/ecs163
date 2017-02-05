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
