import "./Redirect.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../common/Form";
import { postRequest } from "../../../requests";
import { paths } from "../../../requests/paths";
const { client, api } = paths;

function Redirect() {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate(client.login)
  },[])
  return <div></div>;
}

export default Redirect;
