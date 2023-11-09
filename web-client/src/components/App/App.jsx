import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css";
import { PwmControlPanel } from "../PwmControlPanel";
import { io } from "socket.io-client";
import { server } from "../../config";
import { PwmSchedule } from "../PwmSchedule";
import { EventEmitter } from "events";
const eventBus = new EventEmitter();
const eventBusContext = createContext();
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const socket = io(server.url);
const socketContext = createContext();
function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <socketContext.Provider value={socket}>
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
            ></PwmSchedule>
          </eventBusContext.Provider>
        </socketContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { socketContext };
export default App;
