import React from "react";
import { scaleLinear } from "d3-scale";

const polar2cartesian = (angle, radius) => [
  radius * Math.cos(angle),
  radius * Math.sin(angle)
];

const defaultTextProps = {
  textAnchor: "middle",
  dy: ".37em",
  fill: "#ccc",
  fontFamily: "Avenir, 'Helvetica Neue', Helvetica, sans-serif",
  x: 0
};

const Dial = ({ r = 400, data, name }) => {
  const n = data.length;
  const color = scaleLinear()
    .domain([-40, 0, 10, 20, 30, 40, 60])
    .range([
      "#012035",
      "#54B8E8",
      "#94DCA2",
      "#FCD660",
      "#E97055",
      "#A63C2C",
      "#742A18"
    ]);
  const tempScale = scaleLinear()
    .domain([-40, 60])
    .range([0, r])
    .clamp(true);

  const precScale = scaleLinear()
    .domain([0, 300])
    .range([0, 100]);

  const ticks = tempScale.ticks().filter(t => t >= -20 && t <= 40);

  return (
    <svg width={r * 2} height={r * 2}>
      <g transform={`translate(${r}, ${r})`}>
        <g>
          {ticks.map((tick, i) => (
            <circle
              key={i}
              cx={0}
              cy={0}
              r={tempScale(tick)}
              fill="none"
              stroke="#ccc"
              strokeOpacity={tick === 0 ? 1 : 0.5}
            />
          ))}
        </g>
        <rect x={-15} y={-r} height={r * 2} width={30} fill="white" />
        <g>
          {ticks
            .filter(t => t % 20 === 0)
            .map((tick, i) => (
              <React.Fragment key={i}>
                <text {...defaultTextProps} y={tempScale(tick)}>
                  {tick}&deg;
                </text>
                <text {...defaultTextProps} y={-tempScale(tick)}>
                  {tick}&deg;
                </text>
              </React.Fragment>
            ))}
        </g>
        {data.map((day, index) => {
          const [cx, cy] = polar2cartesian(
            (index / n) * 2 * Math.PI,
            tempScale(day.airTemperature.avg)
          );

          return (
            <circle
              key={index}
              r={precScale(day.precipitation.sum)}
              cx={cx}
              cy={cy}
              fill="#7fa5dd"
              fillOpacity={0.1}
            />
          );
        })}
        {data.map((day, index) => {
          const [x1, y1] = polar2cartesian(
            (index / n) * 2 * Math.PI,
            tempScale(day.airTemperature.min)
          );
          const [x2, y2] = polar2cartesian(
            (index / n) * 2 * Math.PI,
            tempScale(day.airTemperature.max)
          );

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color(day.airTemperature.avg)}
              strokeWidth={2}
            />
          );
        })}
        <text
          {...defaultTextProps}
          y={0}
          textAnchor="middle"
          fontWeight="100"
          fontSize="42px"
          fontFamily="'Avenir Light', 'Helvetica Neue', Helvetica, sans-serif"
          fill="#77797c"
        >
          {name.toUpperCase()}
        </text>
      </g>
    </svg>
  );
};

export default Dial;
