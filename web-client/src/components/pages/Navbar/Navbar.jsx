import "./Navbar.css";
import { Button } from "@mui/material";
import { UserContext, PassUserProvider } from "../../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../requests/paths";
import { postRequest } from "../../../requests/requests";
const { client, api } = paths;

function Navbar() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userName = user ? user.userName : "";
  const login = () => {
    navigate(client.login);
  };

  const logout = () => {
    postRequest({ token: localStorage.getItem("JWT") }, api.logout);
    PassUserProvider.reset();
    navigate(client.login);
  };
  const onClick = user ? logout : login;
  return (
    <nav className="navbar">
      <span className="navbar_user-name">{userName}</span>
      <ul className="navbar_navigation-menu">
        <li>
          <Button
            className="navbar_navigation-button"
            onClick={onClick}
            variant="contained"
          >
            {user ? "Logout" : "Login"}
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
