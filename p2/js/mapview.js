function buildMap(csvFile, jsonFile) {
  var map = L.map('mapView').setView([37.788975, -122.403452], 15);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    // layers: new L.StamenTileLayer('toner-hybrid')
  }).addTo(map);

  map._initPathRoot();

  // append the svg to the overlay pane, not the div
  // var svg = d3.select(map.getPanes().overlayPane).append("svg");

  var svg = d3.select("#mapView").select("svg")
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
      .style("right", "0px")

    d3.selectAll(".cityLabel")
      .text(function(d) {
        return selectedPoint.properties.start_station;
      })




    console.log(selectedPoint)
  }

    // update position of data on map when resized
    // function updateMap() {
    //   var bounds = path.bounds(mapData);
    //
    //   var topLeft = bounds[0],
    //     bottomRight = bounds[1];
    //
    //   svg.attr("width", bottomRight[0] - topLeft[0])
    //     .attr("height", bottomRight[1] - topLeft[1])
    //     .style("left", topLeft[0] + "px")
    //     .style("top", topLeft[1] + "px");
    //
    //   g.attr("transform", "translate(" + -topLeft[0] + ","
    //                                   + -topLeft[1] + ")");
    //
    //   // initialize the path data
    //   feature.attr("d", path)
    //     .style("fill-opacity", 0.7)
    //     .attr('fill','blue');
		// }
    // transform coordinates from leaflet's coords to d3's
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x))
      this.stream.point(point.x, point.y);
    }

  })
}
