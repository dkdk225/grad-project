import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css"
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
