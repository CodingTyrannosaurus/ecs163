// choose color scheme
var colorScale20 = d3.scaleOrdinal(d3.schemeCategory20);
var colorScale10 = d3.scaleOrdinal(d3.schemeCategory10);

// initial d3 station setup
drawMapMarkers("data/stationData.geojson");
// initial histogram draw
drawHistogram("data/hourlyStations.csv");

drawSlider("data/factorsSF.csv");

// drawGuage();
