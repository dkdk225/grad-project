import './PwmControl.css'
import { useState, useContext } from "react";
import { socketContext } from '../App';
const max = 100;
const min = 0;

function PwmControl({ deviceId, color, className = null }) {
  const [pwm, setPwm] = useState("0");
  const socket = useContext(socketContext)

  const sendPwm = (pwmValue) => {
    const update = {}
    update[color] = Number(pwmValue)
    socket.emit('update', deviceId, update)
  }

  const handleChange = (event) => {
    const newValue = event.target.value;
    if(newValue <= 100 && newValue >= 0){
      setPwm(newValue);
      return newValue
    }
    setPwm(String(max))
    return String(max)
    
  };

  return (
    <div className={className ? className : ""}>
      <input
        type="range"
        value={pwm}
        onMouseUp={()=>{
          sendPwm(pwm)
        }}
        onChange={handleChange}
        className="pwm-input__slider"
      />
      <input
        className="pwm-input__number"
        type="number"
        min={min}
        max={max}
        value={pwm}
        onChange={(event)=>{
          const newPwm = handleChange(event)
          sendPwm(newPwm)
        }}
      />
    </div>
  );
}

export default PwmControl;
