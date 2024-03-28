import "./LightController.css";
import { useContext } from "react";
import { requestHandlerContext, eventBusContext } from "../App";
import { PwmSchedule } from "../common/PwmSchedule";
const deviceId = "6564gf"
function LightController() {
  const requestHandler = useContext(requestHandlerContext)
  return (
    <PwmSchedule
      colorMapping={{
        red: "rgb(255, 0, 0)",
        farmRed: "rgb(211, 33, 45)",
        blueRoyal: "rgb(65, 105, 225)",
        blue: "rgb(0, 0, 255)",
        green: "rgb(0, 255, 0)",
        ultraViolet: "rgb(138, 43, 226)",
        warmWhite: "rgb(245, 222, 179)",
        coldWhite: "rgb(161, 230, 234)",
      }}
      deviceId={deviceId}
      onApplySchedule={(schedule) => {
        requestHandler.update(deviceId, { schedule: schedule.parse() });
      }}
      onMount={(setSchedule) => {
        requestHandler.watch(deviceId, (response) => {
          const parsedPoints = response.data[0].schedule;
          setSchedule((schedule) => {
            return schedule.buildPointStorage(parsedPoints);
          });
        });
      }}
    ></PwmSchedule>
  );
}

export default LightController;
