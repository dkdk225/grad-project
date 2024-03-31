import "./Login.css";
import { Form } from "../../common/Form";
import { getRequest, postRequest } from "../../../requests";
import { useNavigate } from "react-router-dom";
import { PassUserProvider } from "../../App";
import { paths } from "../../../requests/paths";
const { client, api } = paths;

function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Form
        className="login-form"
        fields={["User Name", "*Password"]}
        onSubmit={(formDict) => {
          postRequest(formDict, api.login).then((result) => {
            if (result.data) {
              localStorage.setItem("JWT", result.data);
              navigate(client.devices);
              PassUserProvider.getUser();
            }
          });
        }}
        submitName="Login"
      ></Form>
    </>
  );
}

export default Login;
