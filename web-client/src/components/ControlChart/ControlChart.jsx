import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-dragdata";
import { Line, Scatter } from "react-chartjs-2";
import "./ControlChart.css";
const hours = () => {
  const hours = [];
  for (let i = 0; i <= 24; i++) {
    const hour = String(i) + ":00";
    hours.push(hour);
  }
  return hours;
};
const defaultPwms = (value) => {
  const pwms = [];
  for (let i = 0; i <= 24; i++) {
    pwms.push(value);
  }
  return pwms;
};

const options = {
  scales: {
    y: {
      min: 0,
      max: 100,
    },
    x: {
      min: 0,
      max: 24,
    },
  },
  onHover: function (e) {
    const point = e.chart.getElementsAtEventForMode(
      e,
      "nearest",
      { intersect: true },
      false
    );
    if (point.length) e.native.target.style.cursor = "grab";
    else e.native.target.style.cursor = "default";
  },
  plugins: {
    dragData: {
      round: 0,
      showTooltip: true,
      onDragStart: function (e, datasetIndex, index, value) {},
      onDrag: function (e, datasetIndex, index, value) {
        e.target.style.cursor = "grabbing";
      },
      onDragEnd: function (e, datasetIndex, index, value) {
        e.target.style.cursor = "default";
      },
    },
  },
};

const data = {
  labels: hours(),
  datasets: [
    {
      label: "First dataset",
      data: defaultPwms(50),
      // fill: true,
      // backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      pointHitRadius: 25,
      tension: 0.5,
    },
    {
      label: "First dataset",
      data: defaultPwms(50),
      // fill: true,
      // backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      pointHitRadius: 25,
      tension: 0.5,
    },
  ],
};

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

  const secondsToHours = (seconds) => {
    let hours = String(Math.floor(seconds / 3600));
    if (hours.length === 1) hours = "0" + hours;
    return hours;
  };
  const secondsToMinutes = (seconds) => {
    let mins = String(Math.floor((seconds / 60) % 60));
    if (mins.length === 1) mins = "0" + mins;
    return mins;
  };
  //there are 86,400 seconds in a day
  //Map min-max into date
  const newValue = scale(value, { min: min, max: max }, { min: 0, max: 86400 });
  return secondsToHours(newValue) + ":" + secondsToMinutes(newValue);
};

const points = {
  datasets: [
    {
      tension: 0.3,
      borderColor: "rgba(75,192,192,1)",
      data: [
        { x: -10, y: 20 },
        { x: 0, y: 6 },
        { x: 50, y: 10 },
        { x: 100, y: 10 },
        { x: 150, y: 10 },
        { x: 200, y: 20 },
        { x: 210, y: 20 },
      ],
    },
  ],
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
            return mapToTime(Number(title), min, max)
          },
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label = "%" + context.parsed.y
            }
            return label;
          },
        },
      },
      dragData: {
        round: 0,
        dragX: true,
      },
    },
  };
  return config;
};

export default function ControlChart() {
  const config = mapDateConfig(0, 200)
  const chartRef = useRef(null)
  useEffect(() => {
    const chart = chartRef.current

    if(chart){
      config.plugins.dragData.onDrag = (e, datasetIndex, index, value) => {
        const dataset = chart.data.datasets[datasetIndex];
        console.log(dataset)
        const {x, y} = dataset.data[index]
        console.log(x,y)

        
        // dataset has extra elements at the start and end in order to provide extending feeling
        // in order to provide correct extending feeling we change the extra points when the first and last points change

        //when the first element is changing mirror the extending element at the end of the list
        if (index === 1){

        }
        //when the last element is changing mirror the extending element at the start of the list
        if (index === dataset.length - 2) {

        }
      }
      // console.log(chart.data.datasets[0].data.splice(3,0,{ x: 170, y: 50 },))
    }
  },[]);
  return (
    <div className="control-chart">
      <Line ref={chartRef} data={points} options={config} />
    </div>
  );
}
