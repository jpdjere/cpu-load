import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ONE_SECOND_IN_MS } from "../constants";

export const LineGraph = ({ data }) => {

  const d3Container = useRef(null);
  const svg = useRef(null);
  const x = useRef(null);
  const y = useRef(null);

  const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  useEffect(() => {

      // Create X axis and Y axis
    x.current = d3.scaleTime().range([0, width]);
    y.current = d3.scaleLinear().range([height, 0]);

    svg.current = d3.select(d3Container.current).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis label:
    svg.current
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text("Time (hh.mm)");

    // Y axis label:
    svg.current
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text("Avg. CPU Usage");

    const startDate = new Date();

    const tenMinuteDomain = [
      startDate,
      new Date(new Date() - (-1) * 10 * 60 * ONE_SECOND_IN_MS),
    ];
    x.current.domain(tenMinuteDomain);
    y.current.domain([
      0,
      d3.max(data, (d) => {
        return d.value;
      }),
    ]);

    svg.current
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "axis--x")
      .call(d3.axisBottom(x.current).ticks(d3.timeSecond.every(10)))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg.current.append("g").attr("class", "axis--y").call(d3.axisLeft(y.current));

    // Add the Line
    const valueLine = d3
      .line()
      .x((d) => {
        return x.current(d.date);
      })
      .y((d) => {
        return y.current(d.value);
      });

    svg.current
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("d", valueLine);
  }, []);

  useEffect(
    () => {
      console.log("data rerender", data);
      const [firstDate, lastDate] = x.current.domain();
      const isXAxisChange = lastDate < new Date();
      if (isXAxisChange) {
        const domainTenSecondsForward = [
          new Date(firstDate - (-1) * 10 * ONE_SECOND_IN_MS),
          new Date(lastDate - (-1) * 10 * ONE_SECOND_IN_MS),
        ];
        x.current.domain(domainTenSecondsForward);

        svg.current
          .select(".axis--x")
          .transition()
          .duration(500)
          .call(d3.axisBottom(x.current));
      }

      const [, previousYDomainMax] = y.current.domain();
      const yDomainMax = d3.max(data, (d) => {
        return d.value;
      });
      y.current.domain([0, yDomainMax]);

      svg.current
        .select(".axis--y")
        .transition()
        .duration(500)
        .call(d3.axisLeft(y.current));

      // Recreate the line
      const valueLine = d3
        .line()
        .x((d) => {
          return x.current(d.date);
        })
        .y((d) => {
          return y.current(d.value);
        });

      svg.current
        .select(".line")
        .transition()
        .duration(500)
        .attr("d", valueLine(data));

      const formatTime = d3.timeFormat("%I:%M");

      const isYAxisChange = previousYDomainMax !== yDomainMax;
      const shouldRedrawDots = isYAxisChange || isXAxisChange;

      if (shouldRedrawDots) {
        svg.current.selectAll(".dot").remove();
      }

      const lastDataPoint = data[data.length - 1];
      const pointsData = shouldRedrawDots ? data : [lastDataPoint] || [];
      setTimeout(
        () => {
          svg.current
            .selectAll("dot")
            .data(pointsData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
              return x.current(d.date);
            })
            .attr("cy", function (d) {
              return y.current(d.value);
            })
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
              // Enlarge datapoint dot
              d3.select(this).transition().duration(250).attr("r", 5.5);

              // Append tooltip
              svg.current
                .append("text")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .append("tspan")
                .text("Time: " + formatTime(d.date))
                .attr("y", height - margin.top - 25)
                .attr("x", margin.left - 50)
                .append("tspan")
                .text("CPU Load Avg.: " + d.value.toFixed(3))
                .style("opacity", 1)
                .attr("y", height - margin.top)
                .attr("x", margin.left - 50);
            })
            .on("mouseout", function (d) {
              // Resize dot back to normal
              d3.select(this).transition().duration(250).attr("r", 4);

              // Remove tooltip
              d3.selectAll(".tooltip")
                .transition()
                .duration(500)
                .style("opacity", 0);
            });
        },
        shouldRedrawDots ? 500 : 0
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  return <div className="d3-component" ref={d3Container} />;
};
