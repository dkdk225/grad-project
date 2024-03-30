import "./CreateAccount.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../common/Form";
import { postRequest } from "../../../requests";
import { paths } from "../../../requests/paths";
const {client, api} = paths

function CreateAccount() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  return (
    <>
      <Form
        className="create-account-form"
        fields={["User Name", "Name", "*Password"]}
        onSubmit={(formDict) => {
          postRequest(formDict, api.createUser).then((result) => {
            console.log(result);
            navigate(client.login);
          });
        }}
        submitName="Create Account"
      ></Form>
      {error}
    </>
  );
}

export default CreateAccount;
