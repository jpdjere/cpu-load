import * as d3 from 'd3';
import { ONE_SECOND_IN_MS } from '../constants';

export const startD3 = () => {
  // set the dimensions and margins of the graph
  const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create X axis and Y axis
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text("Time (hh.mm)");

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+20)
      .attr("x", -margin.top)
      .text("Avg. CPU Usage")

  const startDate = new Date();

  return {
    createGraph: (data) => {
      const tenMinuteDomain = [startDate, new Date(new Date() - (-1) * 10 * 60 * ONE_SECOND_IN_MS)];
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
        
      // Add the Line
      const valueLine = d3.line()
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
    updateGraph: (data) => {
      const [firstDate, lastDate] = x.domain();
      const isXAxisChange = lastDate < new Date();
      if (isXAxisChange) {
        const domainTenSecondsForward = [
          new Date(firstDate - (-1) * 10 * ONE_SECOND_IN_MS),
          new Date(lastDate - (-1) * 10 * ONE_SECOND_IN_MS)
        ];
        x.domain(domainTenSecondsForward);

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
      const valueLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.value); });
    
      svg.select(".line")
        .transition()
        .duration(500)
        .attr("d", valueLine(data))

      const formatTime = d3.timeFormat("%I:%M");

      const isYAxisChange = previousYDomainMax !== yDomainMax;
      const shouldRedrawDots = isYAxisChange || isXAxisChange;
      
      if(shouldRedrawDots) {
        svg.selectAll(".dot").remove();
      }
      
      const lastDataPoint = data[data.length - 1];
      const pointsData = shouldRedrawDots ? data : ([lastDataPoint] || []);
      setTimeout(() => {
        svg.selectAll("dot")
          .data(pointsData)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); })
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {

              // Enlarge datapoint dot
              d3.select(this)
                .transition()
                .duration(250)
                .attr("r", 5.5);

              // Append tooltip
              svg.append("text")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .append("tspan").text("Time: " + formatTime(d.date))
                .attr("y", height - margin.top - 25)
                .attr("x", margin.left - 50)
                .append("tspan").text("CPU Load Avg.: " + d.value.toFixed(3))
                .style("opacity", 1)
                .attr("y", height - margin.top)
                .attr("x", margin.left - 50)
              })
            .on("mouseout", function(d) {
              // Resize dot back to normal
              d3.select(this)
                .transition()
                .duration(250)
                .attr("r", 4);

              // Remove tooltip
              d3.selectAll(".tooltip")
                .transition()
                .duration(500)
                .style("opacity", 0);

              });

      }, shouldRedrawDots ? 500 : 0);
   
    }
  }
}