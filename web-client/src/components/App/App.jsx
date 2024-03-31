import { createContext } from "react";
import "./App.css";
import "./common.css";
import { EventEmitter } from "events";
const eventBus = new EventEmitter();
const eventBusContext = createContext(eventBus);
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RequestHandler } from "../../request-handler";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { UserProvider } from "./UserProvider";

import {
  Login,
  DeviceControl,
  CreateAccount,
  Navbar,
  Redirect,
  Devices,
  UpdateUserDevice,
  AddDeviceToUser,
} from "../pages";
import { paths } from "../../requests/paths";
const { client, api } = paths;
const requestHandler = new RequestHandler();
const requestHandlerContext = createContext(requestHandler);

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <requestHandlerContext.Provider value={requestHandler}>
          <eventBusContext.Provider value={eventBus}>
            <Router>
              <UserProvider>
                <Navbar></Navbar>
                <Routes>
                  <Route path={client.login} element={<Login/>}></Route>
                  <Route path={client.createAccount} element={<CreateAccount/>}></Route>
                  <Route path={client.addDeviceToUser} element={<AddDeviceToUser/>}></Route>
                  <Route path={client.devices} element={<Devices/>}></Route>
                  <Route path={client.deviceControl} element={<DeviceControl/>}></Route>
                  <Route path={client.updateUserDevice(client.extension.deviceId)} element={<UpdateUserDevice/>}></Route>
                  {/* <Route path={"*"} element={<Redirect/>}></Route> */}
                </Routes>
              </UserProvider>
            </Router>

          </eventBusContext.Provider>
        </requestHandlerContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { requestHandlerContext, eventBusContext };
export default App;
