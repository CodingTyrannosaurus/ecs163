!(function(){
    "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#pie").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)

    d3.csv("data/uc_pd_tr.csv", main)

    function main(data) {
        // console.log(data[10]);
        // data
        // data = data.filter(function(d) { return d.state == "CA"; })
        // data = data[1];
        setSize(data)
        drawChart(data)
    }

    function setSize(data) {
        width = document.querySelector("#pie").clientWidth
        height = document.querySelector("#pie").clientHeight

        margin = {top:40, left:0, bottom:40, right:0 }


        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)

        svg.attr("width", width).attr("height", height)


        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")


    }

    function drawChart(data) {
        var arcs = d3.pie()
            .sort(null)
            .value(function(d) { return d.UCD; })

        var arc = d3.arc()
            .outerRadius(chartHeight/2)
            .innerRadius(chartHeight/4)
            // .padAngle(0.0)
            .cornerRadius(10)

        // create tooltip
        var tooltip = d3.tip()
          .attr("class", "d3-tip")
        //   .offset([0, 0])
          .html(function(d) {
            return "hi"
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
            .attr("d", arc)
            .attr("id", function(d, i) { return "arc-" + i })
            .attr("stroke", "gray")
            .attr("fill", function(d,i){ return d3.interpolateRainbow(Math.random()); })
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide);

        // add title in center
        newSlice.append("text")
          .attr("class", "pieTitle")
          .attr('dy', '0.35em')
          .attr("text-anchor", "middle")
          .text("UC Davis");


        // newBlock.append("text")
        //     .attr("dx", 55)
        //     .attr("dy", -5)
        //     .append("textPath")
        //     .attr("xlink:href", function(d, i) { return "#arc-" + i; })
        //     .text(function(d) { console.log(d); return d.data.name })
    }
}());
