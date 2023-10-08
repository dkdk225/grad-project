import axios from "axios";
import {server} from "../config";


/**
 * Send an post request to specified path
 * 
 * @param {Object} data The object to be sent
 * @param {string} path The path to send the request
 */
const postRequest = (data, path = null) => {
  const url = path ? server.url + path : server.url;
  axios({
    method: "post",
    url: url,
    data: data,
  });
};

export {postRequest}