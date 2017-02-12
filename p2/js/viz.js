// choose color scheme
var colorScale20 = d3.scaleOrdinal(d3.schemeCategory20);
var colorScale10 = d3.scaleOrdinal(d3.schemeCategory10);

// object to hold school names
var schoolData = {
  fullName: ["UC Berkeley", "UC Davis", "UC Irvine", "UCLA", "UC Riverside", "UC San Diego", "UCSB", "UC Santa Cruz"],
  shorthand: ["UCB", "UCD", "UCI", "UCLA", "UCR", "UCSD", "UCSB", "UCSC"]
}

buildScatterPlot("data/filteredschoolsucflag.csv");

for (var i = 0; i < schoolData.fullName.length; i++) {
  var id = "#" + schoolData.shorthand[i] + "pie";
  buildPieChart("data/uc_pd_tr.csv", schoolData.fullName[i], schoolData.shorthand[i], id);
}

buildLineChart("data/uc_debt_over_time.csv");
