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

var mapSvg = d3.select("#mapView")
  .select("svg")

function drawMapMarkers(jsonFile) {
  // var mapSvg = d3.select("#mapView")
  //   .select("svg")

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

    // create circles for each feature
    var marker = g.selectAll(".marker")
      .data(mapData.features)
      .enter().append("circle")
      .attr("pointer-events","visible")
      .attr("r", 12)
      .attr("class", "marker")
      .style("fill", "#31a354")
      .on("click", function (d) {
        d3.selectAll(".cityLabel")
        .text(function() {
          // console.log(d);
          return d.properties.name;
        })
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
        updateHistogram("data/hourlyStations.csv", d.properties.name);
      })
      .on("mouseout", function(d) {
        tooltip.hide(d)
        // only change color when selecting other station
        if (d.properties.station_id != selectedStation) {
          d3.select(this)
            .style("fill", "#31a354");
        }
      })


    // marker.transition()
    //   .duration(1500)
    //   .delay(800)
    //   .attr("r", function(d) { return d.properties.dockcount * 0.75 } )

    function updateMarkerPositions() {
       marker.attr("transform",
       function(d) {
         return "translate("+
          map.latLngToLayerPoint(d.LatLng).x +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
    )}

    function toggleOverlay(selectedPoint, show) {
      if (show) {
        // slide pane onto screen
        d3.select("#overlay-top")
          .transition()
          .style("display", "inline")
          .style("top", "0px");
      } else {
        // slide pane onto screen
        d3.select("#overlay-top")
          .transition()
          .style("top", "-330px")
      }
    } // end toggleOverlay()

    // lasso
    // var lasso = setupLasso();
    // console.log(lasso)
    // init lasso on svg that contains markers
    // g.call(lasso);

    // lasso.items(d3.selectAll(".marker"));

    map.on("viewreset", updateMarkerPositions);
    updateMarkerPositions();
  }) // end d3.json()
} // end drawMapMarkers

function updateMapMarkers(jsonFile, popularStations) {
  var mapSvg = d3.select("#mapView").select("svg")
  var g = d3.select("g")

  d3.json(jsonFile, function(error, mapData) {
    if (error) throw error;

    // gives leaflet ability to redraw using coordinates
    mapData.features.forEach(function(d) {
      d.LatLng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
    })

    var randomFill = d3.interpolateCool(Math.random());

    // create circles for each feature
    var feature = g.selectAll(".marker")
      .data(mapData.features)
      .attr("pointer-events","visible")
      // .attr("r", 12)
      // .transition().duration(500)
      // .attr("r", function(d) { return d.properties.dockcount * 0.5 } )
      // .attr("class", "marker")
      // .style("fill", randomFill)
  }) // end d3.json()
} // end drawMapMarkers

function selectPopularStations(hour, station) {
  // second param is stations to highlight at hour
  updateMapMarkers("data/stationData.geojson", [])
}

// function setupLasso() {
//   // Lasso functions to execute while lassoing
//   var lasso_start = function() {
//     lasso.items()
//       .attr("r",3.5) // reset size
//       .style("fill",null) // clear all of the fills
//       .classed({"not_possible":true,"selected":false}); // style as not possible
//   };
//
//   var lasso_draw = function() {
//     // Style the possible dots
//     lasso.items().filter(function(d) {return d.possible===true})
//       .classed({"not_possible":false,"possible":true});
//
//     // Style the not possible dot
//     lasso.items().filter(function(d) {return d.possible===false})
//       .classed({"not_possible":true,"possible":false});
//   };
//
//   var lasso_end = function() {
//     // Reset the color of all dots
//     lasso.items()
//        .style("fill", function(d) { return color(d.species); });
//
//     // Style the selected dots
//     lasso.items().filter(function(d) {return d.selected===true})
//       .classed({"not_possible":false,"possible":false})
//       .attr("r",7);
//
//     // Reset the style of the not selected dots
//     lasso.items().filter(function(d) {return d.selected===false})
//       .classed({"not_possible":false,"possible":false})
//       .attr("r",3.5);
//
//   };
//
//   // Create the area where the lasso event can be triggered
//   var lasso_area = mapSvg.append("rect")
//                         .attr("width",1000)
//                         .attr("height",1000)
//                         .style("opacity",0);
//
//   // Define the lasso
//   var lasso = d3.lasso()
//         .closePathDistance(75) // max distance for the lasso loop to be closed
//         .closePathSelect(true) // can items be selected by closing the path?
//         .hoverSelect(true) // can items by selected by hovering over them?
//         .area(lasso_area) // area where the lasso can be started
//         .on("start",lasso_start) // lasso start function
//         .on("draw",lasso_draw) // lasso draw function
//         .on("end",lasso_end); // lasso end function
//
//   return lasso;
// }
