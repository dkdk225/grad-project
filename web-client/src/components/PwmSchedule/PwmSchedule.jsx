import DisplayChart from "../DisplayChart/DisplayChart";
import Button from "@mui/material/Button";
import { PwmPointSet } from "../PwmPointSet";
import "./PwmSchedule.css";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Schedule } from "../../schedule";

const colorMapping = {
  red: "color:rgb(255, 0, 0)",
  farmRed: "rgb(211, 33, 45)",
  blueRoyal: "rgb(65, 105, 225)",
  blue: "rgb(0, 0, 255)",
  green: "rgb(0, 255, 0)",
  ultraViolet: "rgb(138, 43, 226)",
  warmWhite: "rgb(245, 222, 179)",
  coldWhite: "rgb(161, 230, 234)",
};

export default function PwmSchedule() {
  const [schedule, setSchedule] = useState(new Schedule({fields: Object.keys(colorMapping)}));
  const onPointChange = (newPoint) => {
    setSchedule(schedule=>schedule.updatePoint(newPoint))
  };
  const onAdd = () => {
    setSchedule((schedule) => schedule.newPoint());
  };
  const parsedSchedule = schedule.parse()
  for (let colorKey of Object.keys(colorMapping)) {
    parsedSchedule[colorKey].chartColor = colorMapping[colorKey]
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
          {schedule.getPointArrCopy().map((point, index) => {
            return (
              <li className="pwm-schedule__point-list-item" key={index}>
                <PwmPointSet
                  deviceId={"dflgh"}
                  point={point}
                  onApply={onPointChange}
                ></PwmPointSet>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
