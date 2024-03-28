import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css";
import { PwmSchedule } from "../common/PwmSchedule";
import { EventEmitter } from "events";
const eventBus = new EventEmitter();
const eventBusContext = createContext(eventBus);
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RequestHandler } from "../../request-handler";
import {LightController} from "../LightController"

const requestHandler = new RequestHandler();
const requestHandlerContext = createContext(requestHandler);

const deviceId = "fhgfk5";
function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <requestHandlerContext.Provider value={requestHandler}>
          <eventBusContext.Provider value={eventBus}>
            <LightController></LightController>
          </eventBusContext.Provider>
        </requestHandlerContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { requestHandlerContext,eventBusContext };
export default App;
