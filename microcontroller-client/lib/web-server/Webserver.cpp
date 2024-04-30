#include "Webserver.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <string>
#include "Wifimanager.h"
#include "Config.h"
#include "Httpmixin.h"
#include <iostream>
// #include <WebServer.h>


string getPayload(uint8_t *data, size_t len);

AsyncWebServer WebServer::server = AsyncWebServer(80);
void WebServer::start() {
  server.on("/connections", HTTP_GET, [](AsyncWebServerRequest *request) { 
    Serial.print("start scan");
    int n = WiFi.scanNetworks();
    Serial.println("Scan done");
    yield();
    String SSIDs = WiFi.SSID(0);
    for (int i = 1; i < n; ++i)
    {
      yield();
      SSIDs = SSIDs + "," + WiFi.SSID(i);
    }
    request->send(200, "text/plain", SSIDs); 
  }); 

  server.on("/connect", HTTP_POST, [](AsyncWebServerRequest *request) {
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    JsonDocument doc;
    string payload = getPayload(data, len);
    std::cout << payload << std::endl;
    deserializeJson(doc, payload);
    WifiManager::to_STA(doc["ssid"], doc["password"]);
    request->send(200);
  });

  server.on("/set-device-password", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    Serial.println("call to set password");
    JsonDocument doc;
    string payload = getPayload(data, len);
    deserializeJson(doc, payload);
    doc["deviceId"] = WiFi.macAddress();

    string url = Config::server_DNS + "/api/device/create";
    std::cout << url << std::endl;
    HttpMixin::post(url, [](String response) {
      std::cout << response << std::endl;
    },
    doc
    );
    request->send(200); 
  });

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("text/html");
    response->print("<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> :root { --primary-background: white; --border-color: rgba(0, 0, 0, 0.158); --text-color: rgba(0, 0, 0, 0.6); --hover-background: rgba(228, 228, 228, 1); --secondary-background: rgba(0, 0, 0, 0.8); --hover-text-color: rgb(82, 82, 82); --active-text-color: white; --active-background:black; } body, html { background-color: aqua; padding: 0; margin: 0; } .wifi-list-container { position: absolute; left: 50%; top: 100px; transform: translate(-50%); width: 100%; min-height: 100px; background-color: var(--primary-background); border-radius: 0.5em; border: 1px solid var(--border-color); } .wifi-list{ margin-top: 2em; padding:0; list-style: none; } .wifi-list__item { list-style-type: none; font-family: sans-serif; font-size: 1.5em; color: var(--text-color); border-bottom: 1px solid var(--border-color); text-align: center; padding: 0.5em; cursor: pointer; } .wifi-list__item:hover { background-color: var(--hover-background); } .text { font-family: sans-serif; color: var(--text-color); } .refresh-button{ cursor: pointer; width: 2em; height: 2em; border: none !important; } .wifi-list__header, .settings__header{ font-size: 2em; border-bottom: 4px solid var(--border-color); width: 100%; text-align: center; } .settings-menu{ width: 100%; padding: 2em; transform: translate(0, -20%); background-color: var(--primary-background); z-index: 2; display: flex; flex-direction: column; justify-content: center; } .settings-container { background-color: var(--secondary-background); width: 100%; height: 100%; min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 1; display:none; align-items: center; justify-content: center; } .settings-button{ position:absolute; left:1em; top:1em; } .button{ cursor: pointer; font-size:1.5em; border: none; outline: none; padding:0.3em; background: var(--primary-background); border: 1px solid var(--border-color); border-radius: 3px; } .button:hover{ background-color: var(--hover-background); } .button:active{ background-color: var(--active-background); color: var(--active-text-color); } .settings__password{ margin-top: 2em; font-size: 1em; margin-bottom: 1em; } @media screen and (width>400px) { .wifi-list-container { position: absolute; left: 50%; top: 20%; transform: translate(-50%); max-width: 70%; background-color: var(--primary-background); } .settings-menu{ width:60%; z-index: -1; border-radius: 5px; } } </style> <title>Document</title> </head> <body> <button class='button settings-button text'>Settings</button> <div class='settings-container'> <div class='settings-menu'> <div class='text settings__header'>Set password</div> <input class='settings__password' placeholder='password' type='password'> <button type='submit' class='button settings__button text'>Set password</button> </div> </div> <div class='wifi-list-container'> <button class='text refresh-button button'>&#10227</button> <div class='wifi-list__header text'>Wifi list</div> <ul class='wifi-list'> <li class='wifi-list__item'> dummy data</li> <li class='wifi-list__item'> dummy data</li> <li class='wifi-list__item'> dummy data</li> </ul> </div> <script> function buildWifiList(list) { const wifiList = document.querySelector('.wifi-list'); wifiList.innerHTML = ''; console.log(list); for (let item of list) { console.log('add item'); console.log(item); const node = document.createElement('li'); node.className = 'wifi-list__item'; node.innerHTML = item; node.addEventListener('click', (e) => { e.preventDefault(); const password = prompt('Enter password'); console.log(item, password); xhr( 'POST', '/connect', (response) => { console.log(response); }, JSON.stringify({ ssid: item, password }) ); }); wifiList.appendChild(node); } } const settingsContainer = document.querySelector('.settings-container'); document.querySelector('.refresh-button').addEventListener('click', (e) => { updateWifiList(); }); document.querySelector('.settings-button').addEventListener('click', (e) => { showSettings(); }); document.querySelector('.settings__button').addEventListener('click', (e) => { console.log('posting password'); const password = document.querySelector('.settings__password').value; xhr( 'POST', '/set-device-password', (response) => { console.log(response); }, JSON.stringify({ password }) ); }); settingsContainer.addEventListener('click', (e) => { if (e.target == settingsContainer) { hideSettings(); } }); function updateWifiList() { console.log('refresh'); xhr('GET', '/connections', (response) => { const wifis = response.split(','); if (JSON.stringify(wifis) === JSON.stringify([''])) return; buildWifiList(wifis); }); } function xhr(method, path, callback, body = null) { const xhr = new XMLHttpRequest(); xhr.open(method, path); xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); xhr.onreadystatechange = () => { if (xhr.readyState === 4) { callback(xhr.response); } }; xhr.send(body); } function showSettings() { document.querySelector('.settings-container').style.display = 'flex'; } function hideSettings() { document.querySelector('.settings-container').style.display = 'none'; } updateWifiList(); </script> </body> </html>");
    request->send(response);
  });

  server.begin();
}


string getPayload(uint8_t*data, size_t len) {
  string payload;
  for (size_t i = 0; i < len; i++) {
    payload += static_cast<char>(data[i]);
  }
  return payload;
}