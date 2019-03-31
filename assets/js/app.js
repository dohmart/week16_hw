// These arrays to be used to figure out at need what data type each column is
// Made globally available to all functions. 
var intcols = ["id", "income", "incomeMoe"];
var strcols = ["state", "abbr"];
var floatcols = ["poverty", "povertyMoe", "age", "ageMoe", "healthcare", "healthcareLow", "healthecareHigh", 
                "obesity", "obesityLow", "obesityHigh", "smokes", "smokesLow", "smokesHigh"];


// Function to determine if a value is in an array. Returns true if value is found
// in array, otherwise false
function inArray(arr, val) {
    return arr.indexOf(val) !== -1
};

// By default, the csv reading reads all information as strings, 
// so convert back the numerical values. This can be done in a tight loop using the
// arrays of key values previously defined. And the one line inArray function. 
// =================================
function parseData(censusdata) {

  censusdata.forEach(function(state) {
    var keys= Object.keys(state);
    
    keys.forEach(function(key) {
        if (inArray(intcols, key)) {
            state[key] = parseInt(state[key]);
        }
        else if (inArray(floatcols, key)) {
            state[key] = parseFloat(state[key])
        };
    });
  })
};


// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
// This is just a bunch of variables that size things out
// Total size of chart, margins used to center chart container in 
// the html window, and the graph width and height.
// Note that the graph width and height are calculated from the 
// container size and the margins, so the whole thing is self-consistent
// ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var axisgb = 0.2    // Extend axes by 20%

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
chartGroup.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (margin.top/2) + ")")
  .style("text-anchor", "middle")
  .text("HealthCare access vs Poverty");

// Step 3:
// Import the census data from assets/data/data.csv file provided
// =================================
var datapath = "assets/data/";
var datafile = "data.csv";
d3.csv(datapath+datafile).then(function(censusdata) {

  // Step 4: Parse the data
    parseData(censusdata);

  // Step 5: Create Scales. 
  //= ============================================

    var xScale = d3.scaleLinear()
      .domain([(1-axisgb) * d3.min(censusdata, d => d["poverty"]),
               (1+axisgb) * d3.max(censusdata, d => d["poverty"])])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([(1-axisgb) * d3.min(censusdata, d => d["healthcare"]),
               (1+axisgb) * d3.max(censusdata, d => d["healthcare"])])
      .range([height, 0]);

  // Step 6: Create Axes
  // =============================================
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale)
                     


  // Step 7: Append the axes to the chartGroup
  // ==============================================
  // Add bottomAxis
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("poverty");

  // Add leftAxis to the left side of the display
    chartGroup.append("g").call(leftAxis);
    chartGroup.append("g")
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left/2)
    .attr("x", 0-(height/2))
    .style("color", "black")
    .style("text-anchor", "middle")
    .text("healthcare")


  // Add a scale for bubble size
  // var bscale = createScale("income", censusdata, 0, 10);


  // Add circles

  stateCircles = svg.append('g')
    .selectAll(".stateCircle")
    .data(censusdata)
    .enter()
    .append("g")

  stateCircles
      .append("circle")
      .attr("cx", d => xScale(d["poverty"]))
      .attr("cy", d => yScale(d["healthcare"]))
      .attr("r", 15 )
      .style("opacity", "0.7")
      .classed("stateCircle", true)

  stateCircles
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr("x", d => xScale(d["poverty"]))
    .attr("y", d => yScale(d["healthcare"]))
    .style('font-size', "12px")
    // .attr('fill-opacity', 0)
    // .attr('fill', 'red')
    .text(d => d["abbr"])
    .classed('stateText', true)

});
