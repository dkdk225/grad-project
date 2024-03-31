function extend(baseUrl) {
  return function (extend = "") {
    return baseUrl + extend;
  };
}

const client = {
  login: "/login/",
  createAccount: "/create-account/",
  addDeviceToUser: "/user/devices/add/",
  devices: "/user/devices/",
  updateUserDevice: extend("/user/devices/edit/"),
  deviceControl: "/user/devices/:deviceId/",
  extension: {
    deviceId: ":deviceId/",
  },
};

const api = {
  login: "/api/user/login",
  userDevices: "/api/user/devices/",
  createUserDevice: "/api/user/devices/create/",
  createUser: "/api/user/create/",
  updateUserDevice: "/api/user/devices/update/",
  removeUserDevice: "/api/user/devices/remove/",
  userInfo: "/api/user-info",
  logout: "/api/user/logout",
};
const paths = {
  api,
  client,
};

export { paths };
