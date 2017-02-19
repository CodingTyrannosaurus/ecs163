// TODO: Remove overlay pane on map click

function buildMap(csvFile, jsonFile) {
  var map = L.map('mapView').setView([37.78975, -122.393452], 15);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

  // FIXME: still not sure why this is needed
  map._initPathRoot();

  map.doubleClickZoom.disable();

  var mapSvg = d3.select("#mapView")
    .select("svg")

  var g = mapSvg.append("g")
    .attr("class", "leaflet-zoom-hide");

  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // coordinates are backwards
    mapData.features.forEach(function(d) {
      d.LatLng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
    })

    // create tooltip
    var tooltip = d3.tip()
      .attr("class", "d3-tip")
      .direction('n')
      .offset([-10, 0])
      .html(function(d) {
        return d.properties.start_station
      })

    mapSvg.call(tooltip);

    var selectedStation = 0;
    var currentStationOverlayShown = 0;

    // create circles for each feature
    var feature = g.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle")
      .attr("pointer-events","visible")
      .attr("r", 12)
      .attr("class", "marker")
      .on("click", function (d) {
        // hide overlay when clicking on selected station
        // console.log("term: " + d.properties.start_term + " selected: " + selectedStation)
        // if the station user selects is already selected AND overlay IS SHOWING
        if (d.properties.start_term == selectedStation && currentStationOverlayShown) {
          // hide overlay
          toggleOverlay(d, false);
          currentStationOverlayShown = 0;
          // if the station user selects is not selected OR overlay not showing
        } else {
          // show overlay
          toggleOverlay(d, true);
          currentStationOverlayShown = 1;

          // FIXME: probably in the wrong place
          // FIXME: Draw using data from each station clicked
          // console.log("load new hist Data")
          // drawHistogram("data/stations.csv", "test");
          // drawHistogram("data/stationshours.csv", "2nd at Folsom");
        }
        selectedStation = d.properties.start_term;
        g.selectAll(".marker")
          .style("fill", "#31a354")
          .style("stroke-width", "1px");
        d3.select(this)
          .style("fill", "#f03b20")
          .style("stroke-width", "2px");
      })
      .on("mouseover", function(d) {
        // console.log("over: " + selectedStation)
        tooltip.show(d)
        // only change color when selecting other station
        if (d.properties.start_term != selectedStation) {
          d3.select(this)
            .style("cursor", "pointer")
            .style("fill", "#3BC566");
        }
      })
      .on("mouseout", function(d) {
        // console.log("out: " + selectedStation)
        tooltip.hide(d)
        // only change color when selecting other station
        if (d.properties.start_term != selectedStation) {
          d3.select(this)
            .style("fill", "#31a354");
        }
      })

    function updateMap() {
 		   feature.attr("transform",
 		   function(d) {
   	     return "translate("+
   		    map.latLngToLayerPoint(d.LatLng).x +","+
   				map.latLngToLayerPoint(d.LatLng).y +")";
   			}
 		)}

    function toggleOverlay(selectedPoint, show) {
      if (show) {
        // console.log("showing")
        // slide pane onto screen
        d3.select("#overlay")
        .transition()
        .style("display", "inline")
        .style("top", "0px");

        d3.selectAll(".cityLabel")
          .text(function(d) {
            return selectedPoint.properties.start_station;
          })
      } else {
        // console.log("hiding")
        // slide pane onto screen
        d3.select("#overlay")
          .transition()
          .style("top", "-330px")
      }
    } // end toggleOverlay()

    map.on("viewreset", updateMap);
    updateMap();
    // drawHistogram("data/hourlyRides.csv", "test");
    // drawHistogram("data/hourlyRides.csv", "test");

    // // FIXME: Draw using data from each station clicked
    drawHistogram("data/testrides.csv", "test");


  }) // end d3.json()
} // end buildMap()
