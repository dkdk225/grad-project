deviceParams = {
  mode: 0,
  channel: 0,
  prefix: "controller",
};

function buildWifiList(list) {
  const wifiList = document.querySelector(".wifi-list");
  wifiList.innerHTML = "";
  console.log(list);
  for (let item of list) {
    console.log("add item");
    console.log(item);
    const node = document.createElement("li");
    node.className = "wifi-list__item";
    node.innerHTML = item;
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const password = prompt("Enter password");
      console.log(item, password);
      xhr(
        "POST",
        "/connect",
        (response) => {
          console.log(response);
        },
        JSON.stringify({ ssid: item, password })
      );
    });
    wifiList.appendChild(node);
  }
}
//====================================================================
// ==========================EVENT LISTENERS==========================
//====================================================================
const settingsContainer = document.querySelector(".settings-container");
document.querySelector(".refresh-button").addEventListener("click", (e) => {
  updateWifiList();
});
document.querySelector(".settings-button").addEventListener("click", (e) => {
  showSettings();
});
document
  .querySelector(".set-password__button")
  .addEventListener("click", (e) => {
    console.log("posting password");
    const passwordField = document.querySelector(".settings__password");
    const password = passwordField.value;
    passwordField.value = "";
    xhr(
      "POST",
      "/set-device-password",
      (response) => {
        console.log(response);
        hideSettings();
      },
      JSON.stringify({ password })
    );
  });

document.querySelector(".set-mode__button").addEventListener("click", (e) => {
  const modeEnum = {
    closed: 0,
    master: 1,
    slave: 2,
  };
  const modeField = document.querySelector(".settings__mode");
  const mode = modeEnum[modeField.value];

  console.log(mode);
  xhr(
    "POST",
    "/set-device-esp-now-mode",
    (response) => {
      console.log(response);
      deviceParams.mode = mode;
    },
    JSON.stringify({ mode })
  );
});

document
  .querySelector(".set-channel__button")
  .addEventListener("click", (e) => {
    const channelField = document.querySelector(".settings__channel");
    const channel = channelField.value;
    console.log(channel);
    xhr(
      "POST",
      "/set-device-esp-now-channel",
      (response) => {
        console.log(response);
        deviceParams.channel = channel;
      },
      JSON.stringify({ channel })
    );
  });

document.querySelector(".set-prefix__button").addEventListener("click", (e) => {
  const prefixField = document.querySelector(".settings__prefix");
  const prefix = prefixField.value;
  console.log(prefix);
  xhr(
    "POST",
    "/set-device-esp-now-prefix",
    (response) => {
      console.log(response);
      deviceParams.prefix = prefix;
    },
    JSON.stringify({ prefix })
  );
});

settingsContainer.addEventListener("click", (e) => {
  if (e.target == settingsContainer) {
    hideSettings();
  }
});

document
  .querySelector(".settings-list__item.set-password")
  .addEventListener("click", (e) => {
    console.log("try set password");
  });

document
  .querySelector(".settings-list__item.esp-now-settings")
  .addEventListener("click", (e) => {
    console.log("esp-now-settings");
  });
//====================================================================
//====================================================================
//====================================================================

function updateWifiList() {
  console.log("refresh");
  xhr("GET", "/connections", (response) => {
    console.log(response);
    const wifis = response.split(",");
    if (JSON.stringify(wifis) === JSON.stringify([""])) return;
    buildWifiList(wifis);
  });
}

function updateDeviceParams() {
  let mode;
  if (deviceParams.mode == 0) {
    mode = "closed";
  }
  if (deviceParams.mode == 1) {
    mode = "master";
  }
  if (deviceParams.mode == 2) {
    mode = "slave";
  }
  console.log(mode);
  document.querySelector(".settings__mode").value = mode;
  document.querySelector(".settings__channel").value = deviceParams.channel;
  document.querySelector(".settings__prefix").value = deviceParams.prefix;
}

function xhr(method, path, callback, body = null) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, path);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      callback(xhr.response);
    }
  };
  xhr.send(body);
}

function showSettings() {
  document.querySelector(".settings-container").style.display = "flex";
}

function hideSettings() {
  document.querySelector(".settings-container").style.display = "none";
}
updateWifiList();
updateDeviceParams();
