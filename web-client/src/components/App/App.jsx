import { createContext, useEffect, useState } from "react";
import "./App.css";
import "./common.css";
import { EventEmitter } from "events";
const eventBus = new EventEmitter();
const eventBusContext = createContext(eventBus);
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RequestHandler } from "../../request-handler";
import { LightController } from "../LightController";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Login,
  DeviceControl,
  CreateAccount,
  Navbar,
  Redirect,
  Devices,
} from "../pages";
import { paths } from "../../requests/paths";
import { AddDeviceToUser } from "../pages/AddDeviceToUser";
const {client, api} = paths

const router = createBrowserRouter([
  {
    path: client.login,
    element: <Login></Login>,
  },
  {
    path: client.createAccount,
    element: <CreateAccount></CreateAccount>,
  },
  {
    path: client.addDeviceToUser,
    element: <AddDeviceToUser></AddDeviceToUser>,
  },
  {
    path: client.devices,
    element: <Devices></Devices>,
  },
  {
    path: client.deviceControl,
    element: <DeviceControl></DeviceControl>,
  },
  // {
  //   path: "*",
  //   element: <Redirect></Redirect>,
  // },
]);

const requestHandler = new RequestHandler();
const requestHandlerContext = createContext(requestHandler);

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <requestHandlerContext.Provider value={requestHandler}>
          <eventBusContext.Provider value={eventBus}>
            <Navbar></Navbar>
            <RouterProvider router={router} />
          </eventBusContext.Provider>
        </requestHandlerContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { requestHandlerContext, eventBusContext };
export default App;
