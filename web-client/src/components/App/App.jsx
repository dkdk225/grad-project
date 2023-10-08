import { createContext, useState } from "react";
import "./App.css";
import { PwmControl } from "../PwmControl";
import eventBus from "../../eventBus";
const eventBusContext = createContext(eventBus);

function App() {

  return <PwmControl></PwmControl>;
}

export { eventBusContext };
export default App;
