function buildMap(csvFile, jsonFile) {
  var map = L.map('mapView').setView([37.783,	-122.41], 14);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

  // append the svg to the overlay pane, not the div
  var svg = d3.select(map.getPanes().overlayPane).append("svg");

  var g = svg.append("g")
    .attr("class", "leaflet-zoom-hide")

  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // convert GeoJSON to SVG
    var transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

    // create circles for each feature
    var feature = svg.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle", ".marker")
      .attr("r", 5)
      .attr("class", "marker")
      // .attr("cx", function (d) { return })


    // map.on("viewreset", updateMap);
    // updateMap();

    // init path data
    feature.attr("d", path);

    // // size svg object
    // var bounds = path.bounds(data),
    //     topLeft = bounds[0],
    //     bottomRight = bounds[1];
    // //
    svg.attr("width", 800)
       .attr("height", 600);
    // set dimensions of svg & g
    // svg.attr("width", bottomRight[0] - topLeft[0])
    //   .attr("height", bottomRight[1] - topLeft[1])
    //   .style("left", topLeft[0] + "px")
    //   .style("top", topLeft[1] + "px");

    // g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    // update position of data on map when resized
    function updateMap() {
      bounds = path.bounds(mapData);

      var topLeft = bounds[0],
        bottomRight = bounds[1];

      svg .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + ","
                                      + -topLeft[1] + ")");

      // initialize the path data
      feature.attr("d", path)
        .style("fill-opacity", 0.7)
        .attr('fill','blue');
		}
    // transform coordinates from leaflet's coords to d3's
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x))
      this.stream.point(point.x, point.y);
    }

  })
}
