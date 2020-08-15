// Step 1: Set up our chart
//=================================
var svg_width = 960;
var svg_height = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;
// var char = d3.select("#scatter").append("div").classed("chart", true);


// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svg_width)
.attr("height", svg_height);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// Step 3:
// Import data from the data.csv file
// =================================

d3.csv("data/data.csv").then(function(data_do) {

  // Step 4: Parse the data
// Format the data and convert to numerical 
// =================================
// Format the data
    data_do.forEach(function(data) {
    
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });


// Step 5: Create the scales for the chart
// =================================

var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height, 0]);
    
  
    var xMin;
    var xMax;
    var yMin;
    var yMax;
    
    xMin = d3.min(data_do, function(data) {
        return data.healthcare;
    });
    
    xMax = d3.max(data_do, function(data) {
        return data.healthcare;
    });
    
    yMin = d3.min(data_do, function(data) {
        return data.poverty;
    });
    
    yMax = d3.max(data_do, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([4, xMax]);
    yLinearScale.domain([6, yMax]);
    
    console.log(xMin);
    console.log(yMax);

    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // append

    // append x axis
    chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  

    var circlesGroup = chartGroup.selectAll("circle").data(data_do).enter()
    // append initial circles
    circlesGroup .append("circle")
          .attr("cx", d => xLinearScale(d.healthcare))
          .attr("cy", d => yLinearScale(d.poverty))
          .attr("r", 17)
          .attr("fill", "blue")
          .attr("opacity", ".4")
    // append state labels
    circlesGroup .append("text")

// edding 
          .text(function(d) {
              return d.abbr;

           })
          .attr("dx", d => xLinearScale(d.healthcare))
          .attr("dy", d => yLinearScale(d.poverty))
          // center abbr
          .attr("text-anchor", "middle")
          .attr('font-size', 10);

      
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([75, -60])
      .html(function(d) {
        return (d.abbr + '%');
        });
       
        chartGroup.call(toolTip);

  //Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
  //Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });


})
      chartGroup.append("text")
      // .style("font-size", "10px")
        .attr("x", 0 - (height / .5))
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
  //       .catch(function(error) {
  // console.log(error);});



