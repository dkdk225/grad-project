import "./UpdateUserDevice.css";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Form } from "../../common/Form";
import { postRequest } from "../../../requests";
import { paths } from "../../../requests/paths";
const { client, api } = paths;

function UpdateUserDevice() {
  const { deviceId } = useParams();
  const name = useLocation().state ? useLocation().state.name : "";
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  return (
    <>
      <Form
        className="update-device-form"
        fields={["Device Id", "Name", "*Password"]}
        onMount={(states) => {
          states["Device Id"].setValue((value) => deviceId);
          states["Name"].setValue((value) => name);
        }}
        onSubmit={(formDict) => {
          const { name, password } = formDict;
          const body = {
            name,
            password,
            newDeviceId: formDict.deviceId,
            deviceId,
          };
          postRequest(body, api.updateUserDevice).then((result) => {
            console.log(result);
            navigate(client.devices);
          });
        }}
        submitName="Update Device"
      ></Form>
      {error}
    </>
  );
}

export default UpdateUserDevice;
