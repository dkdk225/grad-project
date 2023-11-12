import DisplayChart from "../DisplayChart/DisplayChart";
import Button from "@mui/material/Button";
import { PwmPointSet } from "../PwmPointSet";
import "./PwmSchedule.css";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Schedule } from "../../schedule";

export default function PwmSchedule({ colorMapping, deviceId }) {
  const [schedule, setSchedule] = useState(
    new Schedule({ fields: Object.keys(colorMapping) })
  );
  const onPointChange = (newPoint) => {
    setSchedule((schedule) => schedule.updatePoint(newPoint));
  };
  const onAdd = () => {
    setSchedule((schedule) => schedule.newPoint());
  };
  const onPointRemove = (key) => {
    setSchedule((schedule) => schedule.removePoint(key));
  };
  const parsedSchedule = schedule.parse();
  for (let colorKey of Object.keys(colorMapping)) {
    parsedSchedule[colorKey].chartColor = colorMapping[colorKey];
  }

  return (
    <div className="pwm-schedule">
      <DisplayChart schedule={parsedSchedule}></DisplayChart>
      <div className="point-container">
        <div className="point-manager">
          <Button
            variant="contained"
            className="point-manager__add-button"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add
          </Button>
        </div>
        <ul className="pwm-schedule__point-list">
          {Object.keys(schedule.getPointStorageCopy()).map((key) => {
            const point = schedule.getPointStorageCopy()[key];
            return (
              <li className="pwm-schedule__point-list-item" key={key}>
                <PwmPointSet
                  colorMapping={colorMapping}
                  pwmNamings={schedule.createEssentialFieldNamings()}
                  deviceId={deviceId}
                  point={point}
                  onApply={onPointChange}
                  onRemove={onPointRemove}
                ></PwmPointSet>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
