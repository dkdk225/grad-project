import './PwmControl.css'
import { useState, useContext } from "react";
import { socketContext } from '../App';

function PwmControl({ deviceId, className = null }) {
  const [pwm, setPwm] = useState("0");
  const socket = useContext(socketContext)

  const onMouseUp = (event) => {
    socket.emit('update', deviceId, {pwm:Number(pwm)})
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
