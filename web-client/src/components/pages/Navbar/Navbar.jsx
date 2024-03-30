import "./Navbar.css";
import { Form } from "../../common/Form";
import { getRequest, postRequest } from "../../../requests";
import { Button } from "@mui/material";
function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar_navigation-menu">
        <li>
          <Button className="navbar_navigation-button" variant="contained">
            Logout
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
