import "./DeviceControl.css";
import { useParams } from "react-router-dom";
import { LightController } from "../../LightController";
const deviceId = "custom id 2";
function DeviceControl() {
  const {deviceId} = useParams()
  console.log(deviceId)
  return (
    <LightController deviceId={deviceId}></LightController>
  );
}

export default DeviceControl;
