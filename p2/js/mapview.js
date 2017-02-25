// initial map setup

var map = L.map('mapView').setView([37.78975, -122.393452], 14);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; ' + mapLink + ' Contributors',
  maxZoom: 18,
}).addTo(map);

map._initPathRoot();

map.doubleClickZoom.disable();

var mapSvg = d3.select("#mapView")
  .select("svg")

function drawMapMarkers(jsonFile) {
  var g = mapSvg.append("g")
    .attr("class", "leaflet-zoom-hide");

  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // gives leaflet ability to redraw using coordinates
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

    // container for circles with text
    var markerContainer = g.selectAll("g")
      .data(mapData.features)

    var markerEnter = markerContainer.enter()
      .append("g");

    var marker = markerEnter.append("circle")
      .attr("pointer-events", "visible")
      .attr("r", 12)
      .attr("class", "marker")
      .style("fill", "#31a354")
      .on("click", function (d) {
        // reset slider to re-show allrides next timeDay
        firstSlide = true;

        d3.selectAll(".cityLabel")
        .text(function() {
          return d.properties.name;
        })
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
          updateHistogram("data/hourlyStations.csv", d.properties.name);
        }
        selectedStation = d.properties.station_id;
        g.selectAll(".marker")
          .style("fill", "#31a354")
          .style("stroke-width", "1px");
        d3.select(this)
          .style("fill", "#f03b20")
          .style("stroke-width", "2px");
      }) // end onclick
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
    // end marker attributes

    function updateMarkerPositions() {
       markerEnter.attr("transform",
       function(d) {
         return "translate("+
          map.latLngToLayerPoint(d.LatLng).x +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
        });
      }

    function toggleOverlay(selectedPoint, show) {
      if (show) {
        // slide panes onto screen
        d3.select("#overlay-top")
          .transition().duration(500)
          .style("display", "inline")
          .style("top", "0px");
        d3.select("#overlay-right")
          .transition().duration(600)
          .style("display", "inline")
          .style("right", "0px");
        d3.select("#overlay-bottom")
          .transition().duration(700)
          .style("display", "inline")
          .style("bottom", "0px");
      } else {
        // slide pane onto screen
        d3.select("#overlay-top")
          .transition().duration(500)
          .style("top", "-330px")
        d3.select("#overlay-right")
          .transition().duration(600)
          .style("display", "inline")
          .style("right", "-280px");
        d3.select("#overlay-bottom")
          .transition().duration(700)
          .style("display", "inline")
          .style("bottom", "-80px");
      }
    } // end toggleOverlay()

    var markerLabel = markerEnter.append("text")
      .attr("dy", function(d) { return 4; })
      .attr("text-anchor", "middle")
      .attr("class", "markerLabel")
      .attr("opacity", 0)
      .text(function(d) { return d.properties.dockcount; });

    $('#toggleArea :checkbox').change(function() {
      if (this.checked) {
        marker.transition()
          .duration(600)
          .attr("r", function(d) { return d.properties.dockcount * 0.75; });

        var markerLabel = markerEnter.append("text")
          .attr("dy", function(d) { return 4; })
          .attr("text-anchor", "middle")
          .attr("class", "markerLabel")
          .text(function(d) { return d.properties.dockcount; });

      } else {
        marker.transition()
          .duration(600)
          .attr("r", 12)

        markerEnter.selectAll(".markerLabel").remove()
      }
    });

    map.on("viewreset", updateMarkerPositions);
    updateMarkerPositions();
  }) // end d3.json()
} // end drawMapMarkers
