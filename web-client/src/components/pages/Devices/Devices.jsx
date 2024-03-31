import "./Devices.css";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getRequest, postRequest } from "../../../requests";
import { useNavigate } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { paths } from "../../../requests/paths";
import { deleteRequest } from "../../../requests/requests";
const { client, api } = paths;

function Devices() {
  const [devices, setDevices] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    getRequest(api.userDevices).then((result) => {
      if (result.data.length > 0) setDevices(result.data);
    });
  }, []);
  return (
    <section>
      {devices ? (
        <ul className="device-card-list">
          {devices.map((device, index) => {
            const { deviceId, name } = device;
            const nameToDisplay =
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            return (
              <li className="device-card-list_element" key={index}>
                <div className="device-card">
                  <h1 className="device-card_title">{nameToDisplay}</h1>
                  <div className="device-card_button-container">
                    <Tooltip title="Settings and remote control">
                      <IconButton
                        onClick={() =>
                          navigate(`${client.devices}${deviceId}`, {
                            state: { name, deviceId },
                          })
                        }
                        aria-label="settings"
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit connection settings">
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          navigate(client.updateUserDevice(deviceId), {
                            state: { name, deviceId },
                          });
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          deleteRequest(
                            { deviceId },
                            api.removeUserDevice
                          ).then((result) => {
                            setDevices((devices) =>
                              devices.filter(
                                (device) => device.deviceId !== deviceId
                              )
                            );
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div> loading ...</div>
      )}
      <Button
        variant="contained"
        className="device-card_add-button"
        startIcon={<AddIcon />}
        onClick={() => navigate(client.addDeviceToUser)}
      >
        Add
      </Button>
    </section>
  );
}

export default Devices;
