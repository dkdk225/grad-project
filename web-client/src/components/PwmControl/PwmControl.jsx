import "./PwmControl.css";
import { useRef, useState } from "react";

import { Box, Slider } from "@mui/material";
const pwmColorClassNames = {
  red: "pwm-input__slider_color-red",
  farmRed: "pwm-input__slider_color-farm-red",
  blueRoyal: "pwm-input__slider_color-royal-blue",
  blue: "pwm-input__slider_color-blue",
  green: "pwm-input__slider_color-green",
  ultraViolet: "pwm-input__slider_color-ultra-violet",
  warmWhite: "pwm-input__slider_color-warm-white",
  coldWhite: "pwm-input__slider_color-cold-white",
};
const max = 100;
const min = 0;

function PwmControl({ deviceId, color, className = null, onPwmUpdate = null }) {
  const [pwm, setPwm] = useState(0);
  

  const handleChange = (event) => {
    const newValue = Number(event.target.value);// typecast incoming value from textfield
    if (newValue <= 100 && newValue >= 0) {
      setPwm(newValue);
      return newValue;
    }
    setPwm(max);
    return max;
  };

  return (
    <div className={className ? className : ""}>
      <Box className="pwm-input__container">
        <Slider
          ref={self}
          orientation="vertical"
          aria-label="Intensity"
          valueLabelDisplay="auto"
          onChange={handleChange}
          className={"pwm-input__slider " + pwmColorClassNames[color]}
          value={pwm}
          onChangeCommitted={(event, newPwm)=>{
            onPwmUpdate(newPwm);
          }}

        />
        <input
          className="pwm-input__number text"
          type="number"
          min={min}
          max={max}
          value={String(pwm)}
          onChange={(event) => {
            const newPwm = handleChange(event);
            onPwmUpdate(newPwm);
          }}
        />
      </Box>
    </div>
  );
}

export default PwmControl;
