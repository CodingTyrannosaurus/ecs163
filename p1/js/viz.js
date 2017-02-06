// choose color scheme
// var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var colorScale20 = d3.scaleOrdinal(d3.schemeCategory20);

for (var i = 0; i < 20; i++) {
  console.log(colorScale20(i));
}
// console.log(colorScale20(0));

loadScatterPlot("US");

buildPieChart("data/uc_pd_tr.csv", "UC Berkeley", "UCB", "#UCBpie");
buildPieChart("data/uc_pd_tr.csv", "UC Davis", "UCD", "#UCDpie");
buildPieChart("data/uc_pd_tr.csv", "UC Irvine", "UCI", "#UCIpie");
buildPieChart("data/uc_pd_tr.csv", "UCLA", "UCLA", "#UCLApie");
buildPieChart("data/uc_pd_tr.csv", "UC Riverside", "UCR", "#UCRpie");
buildPieChart("data/uc_pd_tr.csv", "UC San Diego", "UCSD", "#UCSDpie");
buildPieChart("data/uc_pd_tr.csv", "UCSB", "UCSB", "#UCSBpie");
buildPieChart("data/uc_pd_tr.csv", "UC Santa Cruz", "UCSC", "#UCSCpie");
