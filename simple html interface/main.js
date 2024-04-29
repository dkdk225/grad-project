function buildWifiList(list) {
  const wifiList = document.querySelector(".wifi-list");
  wifiList.innerHTML = "";
  for (let item of list) {
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
const settingsContainer = document.querySelector(".settings-container");
document.querySelector(".refresh-button").addEventListener("click", (e) => {
  updateWifiList();
});
document.querySelector(".settings-button").addEventListener("click", (e)=>{
  showSettings()
});
settingsContainer.addEventListener("click", (e)=>{
  
  console.log(e.target)
  console.log(e.target == settingsContainer)
  if(e.target == settingsContainer){
    hideSettings()
  }
})


function updateWifiList() {
  console.log("refresh");
  xhr("GET", "/connections", (response) => {
    const wifis = response.split(",");
    buildWifiList(wifis);
  });
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

function showSettings(){
  document.querySelector(".settings-container").style.display = "flex";
}

function hideSettings() {
  document.querySelector(".settings-container").style.display = "none";
}


updateWifiList()
