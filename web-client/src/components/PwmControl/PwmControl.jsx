import './PwmControl.css'
import { useState } from "react";
import { postRequest } from '../../requests';

function PwmControl({ className = null }) {
  const [pwm, setPwm] = useState("0");

  // useEffect(() => {})

  const onMouseUp = (event) => {
    console.log(pwm)
    postRequest({pwm}, '/update')
  }

  const handleChange = (event) => {
    setPwm(event.target.value);
  };

  return (
    <div className={className ? className : ""}>
      <input
        type="range"
        min="0"
        max="255"
        value={pwm}
        onMouseUp={onMouseUp}
        onChange={handleChange}
        className="pwm-input__slider"
      />
      <input
        className="pwm-input__number"
        type="number"
        value={pwm}
        onChange={handleChange}
      />
    </div>
  );
}

export default PwmControl;
