

// Global vars         
var left_margin = 75,
    top_margin = 50,
    width = 1200 - left_margin,
    height = 550 - top_margin,
    chart_class = "chart",
    font = "Helvetica",
    mean_width = 3,
    highlight_width = 3,
    dash_line_width = 2,
    line_width = 1,
    highlight_color = "red",
    curve_color = "grey",
    text_color = "darkslategrey",
    mean_color = "darkslategrey",
    font_size = 12,
    font_weight = 300;
    points_per_year = 41;

// Displayed texts for each "slide" in the visualization
var text_one = "The following data were taken from the 2012 Programme \
for International Student Assessment (PISA) dataset. These data \
represent the math scores and wealth of over half a million students \
in 68 economies. PISA tests (which cover the areas of math, science and \
reading) aim to assess whether students at the end of compulsory \
education can apply their learning to real-life situations, rather than \
testing a specific curriculum.",
text_two = "The line below represents average score on the PISA math \
test by wealth bracket. PISA uses its own index to \
measure wealth, rather than a monetary metric like yearly income. This \
accounts for the fact that the amount of income that constitutes \
\"wealth\" may differ between nations. The PISA index is based on a \
student's access to certain amenities, like his/her own place to study, \
a DVD player, etc. The curve below represents the average math \
score by wealth of all participating countries, weighted by country \
population. Each score has a 95% confidence interval of at most \xB120 \
and represents at least half of the population studied by PISA.",
text_three  = "The difference between the lowest scoring wealth bracket \
and the highest scoring is about 70 points, which PISA estimates \
represents about one and a half years of schooling (41 points = 1 year).",
text_four = "Shown here is a comparison between two of the world's top \
economies - the United States, and Shanghai (China has yet to implement \
nation-wide PISA tests). Shanghai has the highest average math score in \
the 2012 PISA dataset. The average for the United States is 130 points \
below Shanghai, which suggests that the average American 15 year-old \
would need another three years of school to catch up with his/her \
counterpart in Shanghai.",
text_five = "However, the data also suggest that United States \
education is more equitable. The difference between the USA's lowest \
scoring and highest scoring brackets is 82 points, or two years \
of schooling. In Shanghai that difference is 123 points, or \
3 years by PISA estimations.",
text_six = "Below are the wealth-score curves for all of the economies \
that participated in the 2012 PISA assessment. Mouse over lines to view \
the name and mean score of an economy, or select countries by name in \
the drop menu on the right. All average scores have a 95% confidence interval \
of at most \xB120 points.";

// Titles for each "slide" in the visualization.
var title_one = "The PISA 2012 Dataset",
    title_two = "Correlation of Wealth and Math Skills",
    title_three = "Wealth and Math Skills",
    title_four = "Comparing Two Economies",
    title_five = "Equitability Within an Economy",
    title_six = "Exploring Wealth and Education";

// Attaches a horizontal d3 axis to the DOM.
// Takes a d3 scale object.
// Returns a handle to the x-axis object.
function x_axis(scale){
    return d3.svg.axis().scale(scale);
};

// Attaches a vertical d3 axis to the DOM.
// Takes a d3 scale object.
// Returns a handle to the y-axis object.
function y_axis(scale){
    return d3.svg.axis().scale(scale).orient("left");
}

// Attaches a d3 scale object to the DOM.
// Takes the endpoints of the pixel range of the scale, as well as a DOM
// object.
// returns a handle to the scale object.
function make_scale(pix_min, pix_max, dom){
    var scale = d3.scale.linear()
      .range([pix_min, pix_max])
      .domain(dom);

    return scale;
};

// Creates a valid d3 selector string from the values (e.g. country
// names) taken in from the raw dataset.
// Take a raw string, and returns a valid selector string.
function selector_from_string(str) {
  // Replace spaces with hyphens and remove parens
  return str.replace(/ /g, "-").replace(/\(|\)/g, "");
}

// Returns the maximum value of the given key in the array represented by data.
function maximum(data, key) {
  return d3.max(data, function(d) { return d["values"][key]; });
}

// Returns the minimum value of the given key in the array represented by data.
function minimum(data, key) {
  return d3.min(data, function(d) { return d["values"][key]; });
}

// Adds text at a specific location on the svg element.
// Takes the svg element, the x and y coordinates that are the top-left
// corner of the text element as well as styling elements.
// Returns a handle to the text element.
function add_text(svg, x, y, text_string, stroke, text_class) {

  // Add text element to dom
  var text = svg.append("text")
    .attr("class", text_class)
    .attr("x", x)
    .attr("y", y)
    .style("font-family", font)
    .style("stroke", stroke)
    .style("font-size", font_size)
    .style("font-weight", font_weight)
    .text(text_string);

  return text;
};

// filter function from
// http://stackoverflow.com/questions/7378228/
function filter_by_key(data, keys) {
  return data.filter(function(d) {
    return keys.indexOf(d["key"]) > -1;
  });
};

// Adds an visible arrow element to the svg.
// Takes a start point (x1, y1) and an end point (x2, y2)
// returns a handle to the arrow element.
function add_arrow(svg, x1, y1, x2, y2) {

  var color = "black",
    weight = 2,
    diff = 8;

  // Shorten length of arrow to account for marker end
  if (y2 - y1 < 0)
    y2 += diff;
  else
    y2 -= diff;
  var line = draw_line(x1, y1, x2, y2, svg, text_color, weight)

  return line.attr("marker-end", "url(#triangle)");
};

// Searches for a key in country array and, if found, returns the object
// with the key.
function get_country(country_array, country) {
  for(var i = 0; i < country_array.length; i++) {
    if (country_array[i]["key"] === country) {
      return country_array[i];
    }
  }
}

// Searches for a country key in an array of key value pairs and returns
// a rounded value.
function get_country_mean(country_mean_array, country) {
    var result = null;
    for(var i = 0; i < country_mean_array.length; i++) {
      if(country_mean_array[i]["key"] === country) {
        result = country_mean_array[i]["values"];
        return parseInt(result.toFixed(0));
      }
    }
    return result;
};

// Highlights the curve with the passed-in country name.
function highlight(country) {
  d3.select("#" + country).classed("highlighted", true);
};

// Removes highlighting from the country with the passed-in country name.
function dehighlight(country) {
  d3.select("#" + country).classed("highlighted", false);
}

// Grabs first select element and attempts to find an option therein whose text
// matches the text provided. If it succeeds, it sets that option as the selected
// option. Returns true if it succeeds, false otherwise.
// Assumes there is a single select element in the DOM.
function set_dropdown_option(target) {
  var dropdown = document.getElementsByTagName("SELECT")[0];
  for(var i = 0; i < dropdown.options.length; i++)
    if(dropdown.options[i].text === target) {
      dropdown.selectedIndex = i;
      return true;
    }
  return false;
}

function points_to_years(points) {
  return (points / points_per_year).toFixed(1);
}

// Highlights a curve and displays information for a country that is selected by
// the user and deselects all other curves, or simply toggles selection if the user
// selects the same country multiple times. 
function select(country) {
  var selectedClass = "selected";
  // Determine whether this class is already selected
  var country_curve = d3.select("#" + country);
  var alreadySelected = country_curve.classed(selectedClass);
  if(!alreadySelected) {
    // Deselect previously selected line.
    d3.selectAll(".selected")
      .classed(selectedClass, false);
    // Select class
    country_curve.classed(selectedClass, true);
    // Make actual changes to appearance.
    d3.selectAll(".info-text").remove();
    var bins = country_curve[0][0]["__data__"]["values"];
    var values = bins[0]["values"];
    // Extract country information from line data.
    var country_name = values["country"];
    var avg_scr = values["mean"].toFixed(2);
    var avg_wlth = values["wealth"].toFixed(2);
    var scr_rng = (maximum(bins, "y") - minimum(bins, "y")).toFixed(2);
    var rng_str = scr_rng + " (" + points_to_years(scr_rng) + " years)";
    // Display country information in info panel.
    add_info_value("info-country", country_name);
    add_info_value("info-mean", avg_scr);
    add_info_value("info-range", rng_str);
    add_info_value("info-wealth", avg_wlth);
    // Set the drop down option to selected country in case this was selected by
    // mouse-click.
    set_dropdown_option(country_name);
  } else if(country !== "Mean") {
    // Default to mean if country is "deselected."
    select("Mean");
  }
    // If "Deselecting" mean, then do nothing.
}

// Adds value_text to a .value text-box inside an info-field with class field_class.
function add_info_value(field_class, value_text) {
  selector_string = ".info-field." + field_class + " .value";
  return d3.select(selector_string).append("text").text(value_text)
    .classed("info-text", true);
}

// Adds label_text to a label text-box inside an info-field with class field_class.
function add_info_label(field_class, label_text) {
  var selector_string = ".info-field." + field_class + " .label";
  return d3.select(selector_string).append("strong").text(label_text)
    .classed("info-label", true);
}

// Removes all curves from the svg element. Used to change between slides
// in the visualization.
function trim_curves(svg, data) {
  var kill = svg.selectAll("path")
    .data(data)
    .exit()
    .remove();
};

// Binds data to path elements and draws them on the svg. Selection
// should be a selection of "path" elements from the svg.
function draw_curves(selection, data, line_func, isSpecial) {
    return selection.data(data)
      .enter()
      .append("path")
      .attr("d", function(d) {
        return line_func(d["values"]); })
      .attr("id", function(d) { return selector_from_string(d["key"]); })
      .attr("class", function(d) {
        if(d["key"] !== "Mean")
          return "country";
        return "mean";
      })
      .classed("special", isSpecial);
}

// Removes all arrows and text from the svg. Used to change between
// slides.
function clear_annotations(svg) {
    svg.selectAll("line").remove();
    svg.selectAll("text").remove();
}

// Draws a line on the svg element from (x1, y1) to (x2, y2).
function draw_line(x1, y1, x2, y2, svg, color, weight, dashed) {

  if( typeof(dashed) === "undefined")
    dashed = false;
  var line = svg.append("svg:line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2)
    .style("stroke", color)
    .style("stroke-width", weight);

  if(dashed)
    return line.style("stroke-dasharray", "10,10");
  else
    return line;
};

// Returns the mean score of leaves.
// All elements of leaves are expected to have the same country and
// "wealth" values.
function agg(leaves) {
    var mean_score = d3.mean(leaves, function(d) {
        return d["math_score"];
    });
    
    return {
      "country" : leaves[0]["country"],
      "x" : leaves[0]["wealth"],
      "y" : mean_score
    };
};

// Updates the header text and title for the slides. Used to change
// slides.
function update_text(text_title, text_body) {
  d3.select(".header h2")
    .text(text_title);
  d3.select(".header-text")
    .text(text_body);
}

// Adds a field div to the info panel element.
function add_info_field(info_panel_selector, field_class) {
  var field = append_div(info_panel_selector, "info-field " + field_class);
  append_div(field, "text-box label");
  append_div(field, "text-box value");
  return field;
}

// Appends a div with the supplied class to the given selector.
function append_div(selector, div_class) {
  return selector.append("div")
    .classed(div_class, true);
}

// Hide a DOM element.
function hide_element(selector) {
  return selector.classed("vis", false).classed("invis", true);
}

// Show a DOM element.
function show_element(selector) {
  return selector.classed("invis", false).classed("vis", true);
}

/*                          *
 *    MAIN DRAW FUNCTION    *
 *                          */
function draw(data) {
  "use strict";

  // Add SVG element to DOM
  var svg = d3.select("div.chart")
    .append("svg")
      .attr("width", width + left_margin)
      .attr("height", height + top_margin)
    .append("g")
      .attr("class", chart_class);

  // Add info panel to the right of the svg element.
  var info_panel = append_div(d3.select("div.chart"), 'info-panel');

  // Attach field divs to info_panel.
  add_info_field(info_panel, "info-country");
  add_info_field(info_panel, "info-mean");
  add_info_field(info_panel, "info-range")
  add_info_field(info_panel, "info-wealth");

  // Mean test score by country
  var country_means = d3.nest()
    .key(function(d) { return d["country"]})
    .rollup(function(leaves) {
      return leaves[0]["country_mean"];
      })
    .entries(data);

  // Mean test score by wealth bin for each country in PISA set
  // including the grand mean.
  var countries = d3.nest()
    .key(function(d) {return d["country"];})
    .key(function(d) {return +d["wealth"];})
    .sortKeys(function(a, b) { return a - b; })
    .rollup(function(leaves) {
      return {
        "country" : leaves[0]["country"],
        "x" : leaves[0]["wealth"],
        "y" : leaves[0]["math_score"],
        "mean" : leaves[0]["country_mean"],
        "wealth" : leaves[0]["average_wealth"]
      };
    })
    .entries(data);


  // Get mean test score weighted by country population from csv data.
  var mean_score = data.filter(function(d) {
    return d["country"] == "Mean";
  })[0]["country_mean"];

  // Bind data to path elements and chart.
  var lines = svg.selectAll("path")
    .data(countries)
    .enter()

  // Find range of wealth column.
  var wealth_extent = d3.extent(data, function(d) {
      return +d["wealth"];
  });

  // Find range of math scores.
  var score_extent = d3.extent(data, function(d) {
      return d["math_score"];
  });

  // Create x and y scales mapping values to pixels
  var max_y = 650,
      min_y = 200;
  var wealth_scale = make_scale(left_margin, width - 200, wealth_extent);
  var score_scale = d3.scale.linear()
    .range([height, top_margin])
    .domain([min_y, max_y]);

  // Create axes
  var wealth_axis = x_axis(wealth_scale);
  var score_axis = y_axis(score_scale);

  // Draw axes to graph
  d3.select("svg")
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(wealth_axis);

  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + left_margin + ",0)")
    .call(score_axis);

  // Draw labels to graph.
  d3.select("svg")
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", (width - left_margin)/2 + left_margin )
    .attr("y", top_margin + height)
    .text("Wealth");

  var y_lab_offset = 20;
  d3.select("svg")
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", y_lab_offset)
    .attr("x", -(height/2))
    .attr("transform", "rotate(-90)")
    .text("PISA Math Score");

  // Make an arrow marker and attach the definition to parent svg element so that
  // it isn't cleared by chart clearing functions.
  // Lifted wholesale from Mozilla Developer Nework
  var m_width = 5,
      m_height = m_width,
      ref_x = 1,
      ref_y = 5;

  d3.select("svg").append("defs")
    .append("marker")
    .attr("id", "triangle")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", ref_x)
    .attr("refY", ref_y)
    .attr("markerWidth", m_width)
    .attr("markerHeight", m_height)
    .attr("orient", "auto")
    .append("path")
    .style("stroke", text_color)
    .style("fill", text_color)
    .attr("d", "M 0 0 L 10 5 L 0 10 z");

  // Function for drawing curves to the graph from data points.
  var line = d3.svg.line()
    .x(function(d) {
      return wealth_scale(d["values"]["x"]);
    })
    .y(function(d) {
      return score_scale(d["values"]["y"]);
    })
    .interpolate("basis");

  var us = "United States of America",
      china = "China-Shanghai",
      us_color = "blue",
      china_color = "gold";

  // Path selection for adding/removing country curves to chart
  var curves = svg.selectAll("path");

  // Draws two horizontal lines at min_score and max_score y values. Draws arrows
  // and optional text to label the span.
  function draw_span(min_score, max_score, x, arr_length,
    arr_offset, hi_color, lo_color) {

    if(typeof(lo_color) === "undefined") {
      if(typeof(hi_color) === "undefined") {
        hi_color = curve_color;
        lo_color = curve_color;
      } else {
        lo_color = hi_color;
      }
    }

    var hi_line_y = score_scale(max_score),
        lo_line_y = score_scale(min_score),
        arr_x = wealth_scale(x);

    //draw high low lines
    draw_line(left_margin, hi_line_y, width - 200, hi_line_y, svg,
      hi_color, dash_line_width, true);
    draw_line(left_margin, lo_line_y, width - 200, lo_line_y, svg,
      lo_color, dash_line_width, true);
    var top_arrow_end = score_scale(max_score - arr_length),
        bot_arrow_end = score_scale(min_score + arr_length),
        top_arrow_tip = score_scale(max_score) + arr_offset,
        bot_arrow_tip = score_scale(min_score) - arr_offset;
    // draw arrows and text highlighting score difference over wealth
    add_arrow(svg, arr_x, top_arrow_end, arr_x, top_arrow_tip);
    add_arrow(svg, arr_x, bot_arrow_end, arr_x, bot_arrow_tip);

  }

  // FIRST SLIDE.
  function stage_one() {
    update_text(title_two, text_two);

    // Hide "Prev" button in case we're returning from slide 2.
    hide_element(prev_button);

    // Remove any unecessary curves from chart (all but one)
    // as well as any text annotation or lines.
    // Draw selected cureves (mean) to remaining paths
    clear_annotations(svg);
    var mean = filter_by_key(countries, ["Mean"]);
    trim_curves(svg, []);
    draw_curves(curves, mean, line, false);
  };

  // SECOND SLIDE.
  function stage_two() {
    update_text(title_three, text_three);

    // Make "previous" button available, since there are now slides to go back to.
    show_element(prev_button);

    // Grab data to draw.
    var mean = filter_by_key(countries, ["Mean"]);

    // Clear chart.
    clear_annotations(svg);
    trim_curves(svg, []);

    // Draw curves
    draw_curves(curves, mean, line, false);

    var max_score = maximum(mean[0]["values"], "y"),
        min_score = minimum(mean[0]["values"], "y"),
        offset = 5,
        arrow_length = .3 * (max_score - min_score),
        x = .9,
        text_y = score_scale((max_score + min_score)/2);

    // Draw horizontal lines at range endpoints.
    draw_span(min_score, max_score, x, arrow_length, offset);
    add_text(svg, wealth_scale(0), text_y,
      "70 points = 1.5 years of schooling", text_color);
  };

  // THIRD SLIDE.
  function stage_three() {
    update_text(title_four, text_four);

    //Make "Next" button visible in case we're returning from slide 5.
    next_button.classed("vis", true)

    // Grab data for Mean, USA and China-Shanghai.
    var curves_to_draw = filter_by_key(countries, ["Mean", us, china]);

    // remove previous highlight lines and change text
    clear_annotations(svg);
    trim_curves(svg, []);

    // Draw the selected data to the chart.
    draw_curves(curves, curves_to_draw, line, true);

    var china_score = get_country_mean(country_means, china),
        us_score = get_country_mean(country_means, us),
        offset = 5,
        arrow_length = 50,
        x = -5,
        text_y = score_scale((china_score + us_score)/2);

    // Draw horizontal lines for mean US score and mean China-Shanghai score.
    draw_span(us_score, china_score, x, arrow_length, offset,
      china_color, us_color);

    // Label mean lines with text
    add_text(svg, wealth_scale(1.2), score_scale(640),
      "Shanghai (China)");
    add_text(svg, wealth_scale(2.1), score_scale(500),
      "USA")
    add_text(svg, wealth_scale(-5.9), score_scale(547),
      "130 points = 3 years schooling", text_color, "mean_text");
  };

  // FOURTH SLIDE.
  function stage_four() {
    update_text(title_five, text_five);

    // Hide "Next" button since there are no slides following this one.
    show_element(next_button);

    var curves_to_draw = filter_by_key(countries, ["Mean", us, china]);

    // Remove elements from Slide 5, if we're going backwards.
    d3.selectAll(".info-text").remove();
    d3.selectAll(".info-label").remove();
    d3.select("select").remove();
    // Remove previous highlight lines, if we're going forwards.
    clear_annotations(svg);
    trim_curves(svg, []);
    draw_curves(curves, curves_to_draw, line, true);
    var us_data = filter_by_key(countries, [us]);
    var china_data = filter_by_key(countries, [china]);
    var us_max = maximum(us_data[0]["values"], "y"),
        us_min = minimum(us_data[0]["values"], "y"),
        us_x = -5.5,
        us_arr_len = 0.3 * (us_max - us_min),
        china_max = maximum(china_data[0]["values"], "y"),
        china_min = minimum(china_data[0]["values"], "y"),
        china_x = -5,
        china_arr_len = 0.3 * (china_max - china_min),
        offset = 5;

    // Draw horizontal lines highlighting the range of scores in Shanghai and the 
    // US.
    draw_span(us_min, us_max, us_x, us_arr_len, offset, "grey");
    draw_span(china_min, china_max, china_x, china_arr_len, offset,
      "grey");

    // Add text explaining difference in terms of years of schooling.
    add_text(svg, wealth_scale(-5.5), score_scale((china_max + china_min) / 2),
      "123 points = 3 years", text_color, "span");
    add_text(svg, wealth_scale(-5.9), score_scale((us_max + us_min) / 2),
      "82 points = 2 years", text_color, "span");
  };

  // FIFTH SLIDE.
  function stage_five() {
    update_text(title_six, text_six);

    // Hide "Next" button since there are no slides after this one.
    hide_element(next_button);

    // Remove irrelevant annotations and curves.
    clear_annotations(svg);
    trim_curves(svg, []);

    // Add labels for information fields.
    add_info_label("info-country", "Country:");
    add_info_label("info-mean", "Average Score:");
    add_info_label("info-range", "Score Range:");
    add_info_label("info-wealth", "Average Wealth:");

    // Draw all country curves and add event handlers.
    var country_curves = draw_curves(curves, countries, line)
      .on("mouseover", function(d){ highlight(selector_from_string(d["key"])); })
      .on("mouseout", function(d){  dehighlight(selector_from_string(d["key"])); })
      .on("click", function(d) { select(selector_from_string(d["key"])); });

    // Add tooltips to lines
    country_curves.append("svg:title")
      .attr("class", "tooltip")
      .text(function(d) {
        if(d["key"] === "mean")
          return "Mean\nAverage Score: " + mean_score.toFixed();
        var values = d["values"][0]["values"];
        var country = values["country"];
        var score = get_country_mean(country_means, country);
        return country + "\nAverage Score: " + score;
      });

    // Add a drop menu for user to select countries from.
    var country_selector = header.append("select").on("change", selector);

    // Sort countries variable and bind data to each option of the drop menu
    var options = country_selector.selectAll("option")
      .data(countries.sort(function(a, b) {
        if(a["key"] < b["key"])
          return -1;
        else if (a["key"] > b["key"])
          return 1;
        return 0;
      }));

    // Add an option to the selector for each country.
    options.enter()
      .append("option")
      .attr("value", function(d) { return d["key"]; })
      .text(function(d) { return d["key"]; });

    // Initialize slide with mean line selected.
    select("Mean");

    // When user selects from the drop menu, highlight the curve and provide country
    // information.
    function selector() {
      var index = country_selector.property("selectedIndex");
      var selected_country = options[0][index]["__data__"]["key"];
      selected_country = selector_from_string(selected_country);
      select(selected_country, countries, country_means);
    };
  };

  // Set up 'slide' order, and allow users to navigate forwards and backwards using
  // the PREV and NEXT buttons.
  var stage_array = [stage_one, stage_two, stage_three, stage_four,
                    stage_five];
  var stidx = 0;

  // Add click events to PREV and NEXT buttons.
  next_button.on("click", function(d){
    if(stidx < stage_array.length){
      stage_array[stidx]();
      stidx += 1;
    }
  });

  prev_button.on("click", function(d) {
    if(stidx > 1) {
      stage_array[stidx - 2]();
      stidx -= 1;
    }
  })
};

