import axios from "axios";
import { server } from "../config";

/**
 * Send an post request to specified path
 *
 * @param {Object} data The object to be sent
 * @param {string} path The path to send the request
 */
const postRequest = (data, path = null) => {
  const url = path ? server.url + path : server.url;
  const jwt = localStorage.getItem("JWT");
  return axios({
    method: "post",
    url: url,
    data: data,
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });
};


/**
 * Send an post request to specified path
 *
 * @param {string} path The path to send the request
 */
const getRequest = (path = null) => {
  const url = path ? server.url + path : server.url;
  const jwt = localStorage.getItem("JWT");
  return axios({
    method: "get",
    url: url,
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });
};


export { postRequest, getRequest };
