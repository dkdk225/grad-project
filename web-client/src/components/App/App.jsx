import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css";
import { PwmSchedule } from "../PwmSchedule";
import { EventEmitter } from "events";
const eventBus = new EventEmitter();
const eventBusContext = createContext();
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RequestHandler } from "../../request-handler";

const requestHandler = new RequestHandler();
const requestHandlerContext = createContext();
function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <requestHandlerContext.Provider value={requestHandler}>
          <eventBusContext.Provider value={eventBus}>
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
            deviceId="fhgfk"
            onApplySchedule={(schedule) => {
              requestHandler.update("fhgfk", {"schedule": schedule.parse()})
            }}
            ></PwmSchedule>
          </eventBusContext.Provider>
        </requestHandlerContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { requestHandlerContext };
export default App;
