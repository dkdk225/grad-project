const client = {
  login: "/login/",
  createAccount: "/create-account/",
  addDeviceToUser: "/user/devices/add/",
  devices: "/user/devices/",
  deviceControl: "/user/devices/:deviceId",
};

const api = {
  login: "/api/user/login",
  createUserDevice: "/api/user/devices/create",
  createUser: "/api/user/create",
};
const paths = {
  api,
  client,
};
export { paths };
