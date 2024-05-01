import DisplayChart from "../DisplayChart/DisplayChart";
import Button from "@mui/material/Button";
import { PwmPointSet } from "../PwmPointSet";
import "./ManualPwm.css";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import { Manual } from "../../../manual";
import { PwmControl } from "../PwmControl";
export default function ManualPwm({
  colorMapping,
  deviceId,
  onApplyPoint,
  onMount,
}) {
  console.log("rerendering manual");
  const [manual, setManual] = useState(
    new Manual({ fields: Object.keys(colorMapping) })
  );
  const [render, setRender] = useState(false);
  const onPointChange = (newPoint) => {
    setManual((manual) => manual.updatePoint(newPoint));
  };
  useEffect(() => {
    onMount(setManual);
    setRender(true);
  }, []);
  useEffect(() => {
    console.log("manual updated");
    console.log(manual);
  }, [manual]);

  return (
    <>
      {render && (
        <div className="pwm-manual">
          <ul className="pwm-list">
            {Object.keys(colorMapping).map((color) => {
              const namings = manual.createFieldNamings();
              const pointStorage = manual.getPointStorageCopy();
              return (
                <li className="pwm-list__control" key={deviceId + color}>
                  <span className="pwm-list__control-label text">
                    {namings[color]}
                  </span>
                  <PwmControl
                    deviceId={deviceId}
                    color={colorMapping[color]}
                    value={pointStorage[color]}
                    onPwmUpdate={(pwmValue) => {
                      onPointChange({ color, pwmValue });
                    }}
                  ></PwmControl>
                </li>
              );
            })}
          </ul>

          <div className="point-container">
            <Button
              variant="contained"
              className="point-manager__add-button manual-apply-button"
              startIcon={<DoneIcon />}
              onClick={() => {
                onApplyPoint(manual.getPointStorageCopy());
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
