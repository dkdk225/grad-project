import "./LightController.css";
import { useContext, useEffect, useState } from "react";
import { requestHandlerContext, eventBusContext } from "../App";
import { PwmSchedule } from "../common/PwmSchedule";
import Switch from "@mui/material/Switch";
import { ManualPwm } from "../common/ManualPwm";
const colorMapping = {
  red: "rgb(255, 0, 0)",
  farmRed: "rgb(211, 33, 45)",
  blueRoyal: "rgb(65, 105, 225)",
  blue: "rgb(0, 0, 255)",
  green: "rgb(0, 255, 0)",
  ultraViolet: "rgb(138, 43, 226)",
  warmWhite: "rgb(245, 222, 179)",
  coldWhite: "rgb(161, 230, 234)",
};

function LightController({ deviceId }) {
  const [mode, setMode] = useState("manual");
  const switchMode = () => {
    setMode((mode) => (mode == "manual" ? "schedule" : "manual"));
  };
  const isModeManual = mode == "manual";
  const [initialPointState, setInitialPointState] = useState(null);
  const requestHandler = useContext(requestHandlerContext);
  useEffect(() => {
    requestHandler.watch(deviceId, (response) => {
      let data = response.data[0];
      if (!data) data = { mode: "manual" };
      setMode(data.mode);
      setInitialPointState(data);
    });
  }, []);

  return (
    <>
      <div
        className={`mode-switch-container ${
          isModeManual ? "mode-switch-container__manual" : ""
        }`}
      >
        <span
          className={`mode-switch__label text ${
            !isModeManual ? "active-control-mode" : ""
          }`}
        >
          Schedule
        </span>
        <Switch
          checked={isModeManual}
          onChange={switchMode}
          inputProps={{ "aria-label": "controlled" }}
        />
        <span
          className={`mode-switch__label text ${
            isModeManual ? "active-control-mode" : ""
          }`}
        >
          Manual
        </span>
      </div>
      {initialPointState && !isModeManual && (
        <PwmSchedule
          colorMapping={colorMapping}
          deviceId={deviceId}
          onApplySchedule={(schedule) => {
            const parsed = schedule.parse();
            requestHandler.updateDeviceControl(deviceId, {
              mode: mode,
              schedule: parsed,
            });
            setInitialPointState((state) => {
              const newState = { ...state };
              newState.schedule = parsed;
              return newState;
            });
          }}
          onMount={(setSchedule) => {
            requestHandler.watch(deviceId, (response) => {
              const parsedPoints = initialPointState.schedule;
              if (parsedPoints)
                setSchedule((schedule) => {
                  return schedule.buildPointStorage(parsedPoints);
                });
            });
          }}
        ></PwmSchedule>
      )}
      {initialPointState && isModeManual && (
        <ManualPwm
          deviceId={deviceId}
          colorMapping={colorMapping}
          onMount={(setManual) => {
            if (initialPointState.manual) {
              setManual((manual) => {
                return manual.buildPointStorage(initialPointState.manual);
              });
            }
          }}
          onApplyPoint={(manual) => {
            requestHandler.updateDeviceControl(deviceId, {
              mode: mode,
              manual: manual,
            });
            setInitialPointState((state) => {
              const newState = { ...state };
              newState.manual = manual;
              return newState;
            });
          }}
        ></ManualPwm>
      )}
    </>
  );
}

export default LightController;
