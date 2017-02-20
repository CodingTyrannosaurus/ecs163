// TODO: Remove overlay pane on map click

// initial map setup

var map = L.map('mapView').setView([37.78975, -122.393452], 14);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; ' + mapLink + ' Contributors',
  maxZoom: 18,
}).addTo(map);

// FIXME: still not sure why this is needed
map._initPathRoot();

map.doubleClickZoom.disable();

function updateMap(jsonFile, selectedStations) {
  // FIXME: REMOVE WITH UPDATE PATTERN, ADD TRANSITIONS
  d3.select("#mapView").selectAll("g").remove()

  var mapSvg = d3.select("#mapView")
    .select("svg")
    // .append("svg")

  var g = mapSvg.append("g")
    .attr("class", "leaflet-zoom-hide");

  // END REMOVE & REDRAW

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
        return d.properties.name;
      })

    mapSvg.call(tooltip);

    var selectedStation = 0;
    var currentStationOverlayShown = 0;

    // var randomFill = d3.interpolateCool(Math.random());

    // create circles for each feature
    var feature = g.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle")
      .attr("pointer-events","visible")
      .attr("r", 12)
      // .attr("r", function(d) { return d.properties.dockcount * 0.5 } )
      .attr("class", "marker")
      .style("fill", "#31a354")
      .on("click", function (d) {
        // hide overlay when clicking on selected station
        // console.log("term: " + d.properties.station_id + " selected: " + selectedStation)
        // if the station user selects is already selected AND overlay IS SHOWING
        if (d.properties.station_id == selectedStation && currentStationOverlayShown) {
          // hide overlay
          toggleOverlay(d, false);
          currentStationOverlayShown = 0;
          // if the station user selects is not selected OR overlay not showing
        } else {
          // show overlay
          toggleOverlay(d, true);
          currentStationOverlayShown = 1;
          updateHistogram("data/hourlyStations.csv", d.properties.name)
        }
        selectedStation = d.properties.station_id;
        g.selectAll(".marker")
          .style("fill", "#31a354")
          .style("stroke-width", "1px");
        d3.select(this)
          .style("fill", "#f03b20")
          .style("stroke-width", "2px");
      })
      .on("mouseover", function(d) {
        tooltip.show(d)
        // only change color when selecting other station
        if (d.properties.station_id != selectedStation) {
          d3.select(this)
            .style("cursor", "pointer")
            .style("fill", "#3BC566");
        }
      })
      .on("mouseout", function(d) {
        tooltip.hide(d)
        // only change color when selecting other station
        if (d.properties.station_id != selectedStation) {
          d3.select(this)
            .style("fill", "#31a354");
        }
      })

    function updateMarkerPositions() {
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
        d3.select("#overlay-top")
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
        d3.select("#overlay-top")
          .transition()
          .style("top", "-330px")
      }
    } // end toggleOverlay()

    map.on("viewreset", updateMarkerPositions);
    updateMarkerPositions();
  }) // end d3.json()
} // end updateMap()


function selectPopularStations(hour, station) {
  updateMap("data/stationData.geojson", [])
}
