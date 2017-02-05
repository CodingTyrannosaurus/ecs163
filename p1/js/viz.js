// manually set margins
var margin = {top: 40, right: 20, bottom: 80, left: 110},
    width = 960 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;

// setup x scale
var x = d3.scaleLinear()
    .range([0, width]);

// setup y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// choose color scheme
var color = d3.scaleOrdinal(d3.schemeCategory10);

// create x axis
var xAxis = d3.axisBottom()
    .scale(x);

// create y axis
var yAxis = d3.axisLeft()
    .scale(y);

// create sized svg to draw on
var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

loadData("US");

function loadData(dfilter) {
  // load csv data
  d3.csv("filteredschools.csv", function(error, data) {
    if (error) throw error;

    // convert strings in csv to integers
    data.forEach(function(d) {
      d.cost = +d.adm_rate;
      d.earnings = +d.earnings;
    });

    // use maximum and minimum values of data for x and y domain
    x.domain(d3.extent(data, function(d) { return d.adm_rate; })).nice();
    y.domain(d3.extent(data, function(d) { return d.earnings; })).nice();

    // append x axis to svg group
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

    // text label for y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height/2))
    .attr("y", 0 - margin.left + 10)
    .attr("dy", "1em")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .text("Median Earnings 10 years after graduating ($)")

    // text label for x axis
    svg.append("text")
    .attr("transform", "translate("+ (width/2) +","+ height +")")
    .attr("y", margin.bottom - 20)
    // .attr("dx", "1em")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .text("Acceptance Rate");

    // append y axis to svg group
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

    // create tooltip
    var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
      return "School Name: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style='color:#3498db'>"+ d.name + "</span><br>Acceptance Rate: <span style='color:#e74c3c'>" + d.adm_rate + "</span><br>Median Earnings:  <span style='color:#2ecc71'>" + d.earnings + "</span>"
    })

    svg.call(tooltip);

    // Color scheme
    var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
      // .domain([1,2,3,6,7,8,9,10]);

    // create points
    svg.selectAll(".dot")
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
    .style("fill", function(d) { return colorScale(d.state); })
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide);


    var legend = svg.selectAll(".legend")
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



// // Update data section (Called from the onclick)
// function filterData(selection) {
//     // Get the data again
//     d3.csv("filteredschools.csv", function(error, data) {
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
