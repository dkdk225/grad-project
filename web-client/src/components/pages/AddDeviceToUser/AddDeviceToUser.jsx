import "./AddDeviceToUser.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../common/Form";
import { postRequest } from "../../../requests";
import { paths } from "../../../requests/paths";
const {client, api} = paths

function AddDeviceToUser() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  return (
    <>
      <Form
        className="add-device-form"
        fields={["Device Id", "Name", "*Password"]}
        onSubmit={(formDict) => {
          postRequest(formDict, api.createUserDevice).then((result) => {
            console.log(result);
            navigate(client.devices);
          });
        }}
        submitName="Add Device"
      ></Form>
      {error}
    </>
  );
}

export default AddDeviceToUser;
