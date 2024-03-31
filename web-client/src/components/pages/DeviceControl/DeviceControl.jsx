import "./DeviceControl.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LightController } from "../../LightController";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { paths } from "../../../requests/paths";
const { client, api } = paths;

function DeviceControl() {
  const { deviceId } = useParams();
  const name = useLocation().state ? useLocation().state.name : "";
  const navigate = useNavigate();
  return (
    <div className="device-control">
      <Tooltip title="Edit connection settings">
        <IconButton
          className="device-control_edit-button"
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
      <LightController deviceId={deviceId}></LightController>
    </div>
  );
}

export default DeviceControl;
