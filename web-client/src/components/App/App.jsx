import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css"
import { PwmControlPanel } from "../PwmControlPanel";
import { io } from "socket.io-client";
import { server } from "../../config";
import {EventEmitter} from 'events'
const eventBus = new EventEmitter()

const socket = io(server.url);
const eventBusContext = createContext();
const socketContext = createContext();
function App() {
  return (
    <>
      <socketContext.Provider value={socket}>
        <eventBusContext.Provider value={eventBus}>
          <PwmControlPanel deviceId="deviceId"></PwmControlPanel>
        </eventBusContext.Provider>
      </socketContext.Provider>
    </>
  );
}

export { socketContext };
export default App;
