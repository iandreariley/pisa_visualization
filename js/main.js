

var header_margin = 10

// Add buttons, text areas and chart to the DOM. Handles generated here are used in the
// main draw function to manipulate the elements.
var header = append_div(d3.select("body"), "header");
var title = header.append("h2").text(title_one);
var text_box = append_div(header, "header-text").text(text_one);
var button_panel = append_div(header, "button-panel");
var prev_button = append_div(button_panel, "button").text("PREV")
  .classed("invis", true);
var next_button = append_div(button_panel, "button").text("NEXT");
var chart = append_div(d3.select("body"), "chart");

// Load data.
process("pisa_by_country_and_wealth_filtered.tsv");

// Loads data from tsv file in context-root directory. casts numeric columns to numeric
// values from strings. 
function process(file){
    d3.tsv(file, function(d) {
        // transform data
        d["math_score"] = +d["math_score"];
        d["wealth"] = +d["wealth"];
        d["country_mean"] = +d["country_mean"];
        d["average_wealth"] = +d["average_wealth"];
        return d;
    }, draw);
};
  