import { createContext, useEffect, useState } from "react";
import "./App.css";
import { PwmControl } from "../PwmControl";
import { io } from "socket.io-client";
import { server } from "../../config";

const socket = io(server.url);
const socketContext = createContext();
function App() {
  return (
    <>
      <socketContext.Provider value={socket}>

      </socketContext.Provider>
    </>
  );
}

export { socketContext };
export default App;
