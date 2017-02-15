function buildMap(csvFile, jsonFile) {
  var map = L.map('mapView').setView([37.78975, -122.393452], 15);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    // layers: new L.StamenTileLayer('toner-hybrid')
  }).addTo(map);

  map._initPathRoot();

  // append the svg to the overlay pane, not the div
  // var svg = d3.select(map.getPanes().overlayPane).append("svg");

  var svg = d3.select("#mapView")
    .select("svg")

  var g = svg.append("g")
    .attr("class", "leaflet-zoom-hide")
    // d3.select("#overlay")
    //   .transition()
    //   .style("display", "inline")

  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // coordinates are backwards
    mapData.features.forEach(function(d) {
      d.LatLng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
    })


    // create circles for each feature
    var feature = g.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle")
      .style("stroke", "black")
      .style("fill", "#0070CB")
      .attr("r", 12)
      .attr("class", "marker")
      .on("click", function (d) {
        showOverlay(d);
      })
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "red");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("fill", "#0070CB");
      })


    map.on("viewreset", updateMap);
    updateMap();

    function updateMap() {
 		   feature.attr("transform",
 		   function(d) {
   	     return "translate("+
   		    map.latLngToLayerPoint(d.LatLng).x +","+
   				map.latLngToLayerPoint(d.LatLng).y +")";
   			}
 		)
 	}

  function showOverlay(selectedPoint) {
    // slide pane onto screen
    d3.select("#overlay")
      .transition()
      .style("display", "inline")
      .style("top", "0px");

    d3.selectAll(".cityLabel")
      .text(function(d) {
        return selectedPoint.properties.start_station;
      })
  }

  function drawHistogram() {

    var data = d3.range(1000).map(d3.randomBates(10));

    var histSvg = d3.select("#histogram")
        margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = histSvg.attr("width")
        height = histSvg.attr("height")
        g = histSvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
      .range([0, width])

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0])

    var bar = g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); });


    // x axis
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  }

  })
}
