import * as d3 from 'd3';

export const startD3 = () => {
  // set the dimensions and margins of the graph
  const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add X axis and Y axis
  
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const startDate = new Date();

  const rectHover = svg.append("rect")
    .attr("class", "overlay")
    .attr("opacity", 0)
    .attr("z-index", 999)
    .attr("width", width)
    .attr("height", height);

  const hoverLineGroup = svg.append("g")
    .attr("class", "hover-line");

  const hoverLine = hoverLineGroup
    .append("line")
    .attr("stroke", "#000")
    .attr("x1", 10).attr("x2", 10) 
    .attr("y1", 0).attr("y2", height); 

  rectHover  
    .on("mousemove", function (event) {
      const [mouse_x, mouse_y] = d3.pointer(event);

      const graph_y = y.invert(mouse_y);
      const graph_x = x.invert(mouse_x);

      console.log({graph_x: graph_x.toISOString(), graph_y});
    
      hoverLine.attr("x1", mouse_x).attr("x2", mouse_x)
      hoverLineGroup.style("opacity", 1);
    });

  return {
    createGraph: (data) => {
      const tenMinuteDomain = [startDate, new Date(new Date() - (-1) * 60000)];
      x.domain(tenMinuteDomain);
      y.domain([0, d3.max(data, (d) => { return d.value; })]);
    
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "axis--x")
        .call(d3.axisBottom(x).ticks(d3.timeSecond.every(10)))
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
      svg.append("g")
        .attr("class", "axis--y")
        .call(d3.axisLeft(y));
        
      // add the Line
      var valueLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.value); });
    
      svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", valueLine);

    },
    updateGraph: (importData) => {
      let data = [...importData];

      const [firstDate, lastDate] = x.domain();
      const isXAxisChange = lastDate < new Date();
      if (isXAxisChange) {
        x.domain([new Date(firstDate - (-1/60) * 60000), new Date(lastDate - (-1/30) * 60000)]);

        svg.select(".axis--x")
          .transition().duration(500)
          .call(d3.axisBottom(x));
      }

      const [, previousYDomainMax] = y.domain();
      const yDomainMax = d3.max(data, (d) => { return d.value; });
      y.domain([0, yDomainMax]);
     
      svg.select(".axis--y")
        .transition().duration(500)
        .call(d3.axisLeft(y));
        
      // Recreate the line
      var valueLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.value); });
    
      svg.select(".line")
        .transition()
        .duration(500)
        .attr("d", valueLine(data));

      // Add tooltip
      var formatTime = d3.timeFormat("%e %B");

      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      
      
      const isYAxisChange = previousYDomainMax !== yDomainMax;
      const shouldRedrawDots = isYAxisChange || isXAxisChange;
      const lastDataPoint = data[data.length - 1];
      const pointsData = shouldRedrawDots ? data : ([lastDataPoint] || []);

      if(shouldRedrawDots) {
        svg.selectAll(".dot").remove();
      }
      setTimeout(() => {
        svg.selectAll("dot")
          .data(pointsData)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2.5)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); })
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
              div.html(formatTime(d.date) + "<br/>" + d.value)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
              })
            .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              });

      } , shouldRedrawDots ? 500 : 0);
     

    
    }
  }
}

