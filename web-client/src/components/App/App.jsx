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
            <PwmSchedule></PwmSchedule>
          </eventBusContext.Provider>
        </socketContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { socketContext };
export default App;
