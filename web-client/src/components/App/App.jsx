import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css"
import { PwmControlPanel } from "../PwmControlPanel";
import { io } from "socket.io-client";
import { server } from "../../config";

const socket = io(server.url);
const socketContext = createContext();
function App() {
  return (
    <>
      <socketContext.Provider value={socket}>
        <PwmControlPanel deviceId="deviceId"></PwmControlPanel>
      </socketContext.Provider>
    </>
  );
}

export { socketContext };
export default App;
