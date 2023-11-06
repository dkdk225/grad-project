import "./PwmPointSet.css";
import { useState } from "react";
import { PwmControl } from "../PwmControl";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

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

function PwmPointSet({ deviceId, point, onApply }) {
  console.log(point)
  const pointStates = {};
  for (let key of Object.keys(point)) {
    const [value, setValue] = useState(point[key]);
    pointStates[key] = { value, setValue };
  }

  return (
    <div className="pwm-point-set">
      <div className="pwm-point-set__actions">
        <TimePicker
          label="Time"
          ampm={false}
          onChange={(newTime) => {
            const milliseconds = newTime.$H * 3600 + newTime.$m * 60;
            pointStates.time.setValue(milliseconds);
            console.log(pointStates)
          }}
        />
        <div>
          <Button
            variant="contained"
            startIcon={<DoneIcon />}
            onClick={() => {
              const pointValues = {};
              for (let key of Object.keys(point)) {
                pointValues[key] = pointStates[key].value;
              }
              onApply(pointValues);
            }}
          >
            Apply
          </Button>
          <IconButton className="pwm-point-set__delete">
            <DeleteIcon className="pwm-point-set__delete-icon" />
          </IconButton>
        </div>
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
                value={pointStates[color].value}
                onPwmUpdate={(pwmValue) => {
                  pointStates[color].setValue(pwmValue);
                }}
              ></PwmControl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PwmPointSet;
