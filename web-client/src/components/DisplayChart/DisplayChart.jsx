import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-dragdata";
import { Line, Scatter } from "react-chartjs-2";
import "./DisplayChart.css";
import { secondsToHourClock } from "../../utils";

//=================
/**
 * Transforms the given value within given interval into HH:MM format
 * @param {number} value - Number to be transformed into HH:MM form
 * @param {number} min - Lower limit of the interval containing value
 * @param {number} max - Upper limit of the interval containing value
 * @returns
 */

const mapToTime = (value, min, max) => {
  const scale = (num, from, to) => {
    return (
      ((num - from.min) * (to.max - to.min)) / (from.max - from.min) + to.min
    );
  };
  //there are 86,400 seconds in a day
  //Map min-max into date
  const newValue = scale(value, { min: min, max: max }, { min: 0, max: 86400 });
  return secondsToHourClock(newValue);
};

const mapDateConfig = (min, max) => {
  const config = {
    scales: {
      x: {
        type: "linear",
        min: min,
        max: max,
        ticks: {
          stepSize: (max - min) / 24,
          callback: function (value, index, ticks) {
            return mapToTime(value, min, max);
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function (value, index, ticks) {
            return "%" + value;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            const title = context[0].label;
            return mapToTime(Number(title), min, max);
          },
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label = "%" + context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };
  return config;
};

/**
 * Displays a given set of data on a chart
 */
export default function DisplayChart({ schedule }) {
  console.log(schedule);
  const config = mapDateConfig(0, 86400);

  const points = {
    datasets: [],
  };
  for (let dataset of Object.keys(schedule)) {
    points.datasets.push({
      tension: 0.3,
      borderColor: schedule[dataset].chartColor,
      data: [{ x: -1000, y: 0 }, ...schedule[dataset], { x: 87400, y: 0 }],
    });
  }

  return (
    <div className="display-chart">
      <Line data={points} options={config} />
    </div>
  );
}
