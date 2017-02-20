// choose color scheme
var colorScale20 = d3.scaleOrdinal(d3.schemeCategory20);
var colorScale10 = d3.scaleOrdinal(d3.schemeCategory10);

buildMap("data/bikedata_subset.csv", "data/startTerm.json", [])
