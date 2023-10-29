import "./PwmControlPanel.css";
import { useState } from "react";
import { PwmControl } from "../PwmControl";
import { Stack, Switch } from "@mui/material";
import { ControlChart } from "../ControlChart"
const pwmColors = {
  red: "Red",
  farmRed: "Farm Red",
  blueRoyal: "Royal Blue",
  blue: "Blue",
  green: "Green",
  ultraViolet: "Ultra Violet",
  warmWhite: "Warm White",
  coldWhite: "Cold White",
};

function PwmControlPanel({ deviceId }) {
  const [switchCheck, setSwitchCheck] = useState(false)

  const switchOnChange = (event) => {
    setSwitchCheck(event.target.checked)
  };
  return (
    <>
      <ControlChart></ControlChart>
      <div className="manual-control-aproval">
        <h2 className="manual-control-aproval__header header">Manual Mode</h2>
        <Switch checked={switchCheck} onChange={switchOnChange}></Switch>
      </div>
      <ul className="pwm-list">
        {Object.keys(pwmColors).map((color) => {
          return (
            <li className="pwm-list__control" key={deviceId + color}>
              <span className="pwm-list__control-label text">
                {pwmColors[color]}
              </span>
              <PwmControl
                deviceId={deviceId}
                key={color}
                color={color}
              ></PwmControl>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default PwmControlPanel;
