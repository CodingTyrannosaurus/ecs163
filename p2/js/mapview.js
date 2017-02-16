function buildMap(csvFile, jsonFile) {
  var map = L.map('mapView').setView([37.78975, -122.393452], 15);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    // layers: new L.StamenTileLayer('toner-hybrid')
  }).addTo(map);

  map._initPathRoot();

  var mapSvg = d3.select("#mapView")
    .select("svg")

  var g = mapSvg.append("g")
    .attr("class", "leaflet-zoom-hide");
    // d3.select("#overlay")
    //   .transition()
    //   .style("display", "inline")



  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // coordinates are backwards
    mapData.features.forEach(function(d) {
      d.LatLng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
    })

    // create tooltip
    var tooltip = d3.tip()
      .attr("class", "d3-tip")
      .direction('ne')
      .offset([0, -5])
      .html(function(d, i) {
        return "Station Name: "
      })

    mapSvg.call(tooltip);

    var selectedStation = 0;

    // create circles for each feature
    var feature = g.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle")
      .attr("r", 12)
      .attr("class", "marker")
      .on("click", function (d) {
        selectedStation = d.properties.start_term;
        d3.select(this)
          .style("fill", "#f03b20");
        showOverlay(d);
      })
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "#f03b20");
        tooltip.show;
      })
      .on("mouseout", function(d) {
        if (d.properties.start_term == selectedStation) {
          // clear all other selections
          g.selectAll(".marker")
            .style("fill-opacity", "0.15");
          d3.select(this)
            .style("fill", "#f03b20");
        } else {
          d3.select(this)
            .style("fill", "#31a354");
        }
        tooltip.hide;
      })

    map.on("viewreset", updateMap);
    updateMap();

    drawHistogram(mapData.features);

    function updateMap() {
 		   feature.attr("transform",
 		   function(d) {
   	     return "translate("+
   		    map.latLngToLayerPoint(d.LatLng).x +","+
   				map.latLngToLayerPoint(d.LatLng).y +")";
   			}
 		)}

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
  }) // end d3.json
} // end buildMap
