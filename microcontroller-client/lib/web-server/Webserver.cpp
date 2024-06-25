#include "Webserver.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <string>
#include "Wifimanager.h"
#include "Config.h"
#include "Httpmixin.h"
#include <iostream>
#include "Espnowmanager.h"

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

  //==============================ENDPOINT FOR================================
  //=============================DEVICE SETTINGS==============================
  //==========================================================================

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

  server.on("/set-device-esp-now-mode", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    Serial.println("call to set ESPNOW mode");
    JsonDocument doc;
    string payload = getPayload(data, len);
    deserializeJson(doc, payload);
    int mode = int(doc["mode"]);
    EspNowManager *espNowManager = EspNowManager::getInstance();

    Config::updateESP_NOW_mode(mode);

    std::cout << payload << std::endl;
    Serial.println(mode);
    Serial.println(Config::ESP_NOW_mode);
    //update device function cycle according to the mode
    espNowManager->close();
    if(mode == 1){
      espNowManager->openMaster();
    }
    if(mode ==2){
      espNowManager->openSlave();
    }
    request->send(200); 
  });

  server.on("/set-device-esp-now-channel", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    Serial.println("call to set ESPNOW channel");
    JsonDocument doc;
    string payload = getPayload(data, len);
    deserializeJson(doc, payload);
    EspNowManager *espNowManager = EspNowManager::getInstance();
    int channel = int(doc["channel"]);
    if(channel != Config::ESP_NOW_channel){
      Config::updateESP_NOW_channel(channel);
      if(Config::ESP_NOW_mode == 1){
        espNowManager->deleteSlaves();
        espNowManager->scanForSlaves();
      }
      if(Config::ESP_NOW_mode == 2){
        espNowManager->close();
        espNowManager->openSlave();
      }
    }

    std::cout << payload << std::endl;
    Serial.println(channel);
    Serial.println(Config::ESP_NOW_channel);
    request->send(200); 
  });

  server.on("/set-device-esp-now-prefix", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    Serial.println("call to set ESPNOW channel");
    JsonDocument doc;
    string payload = getPayload(data, len);
    deserializeJson(doc, payload);
    string prefix = doc["prefix"];
    Config::updateSSID_AP_prefix(prefix);
    EspNowManager *espNowManager = EspNowManager::getInstance();
    
    if(prefix != Config::SSID_AP_prefix){
      Config::updateSSID_AP_prefix(prefix);
      if(Config::ESP_NOW_mode == 0){

      }
      if(Config::ESP_NOW_mode == 1){
        espNowManager->deleteSlaves();
        espNowManager->scanForSlaves();
      }
      if(Config::ESP_NOW_mode == 2){
        espNowManager->close();
        espNowManager->openSlave();
      }
    }


    std::cout << payload << std::endl;
    Serial.println(int(doc["prefix"]));
    std::cout << Config::SSID_AP_prefix << std::endl;
    request->send(200); 
  });


  //==========================================================================
  //==========================================================================
  //==========================================================================


  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("text/html");
    
    response->print("<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> :root { --primary-background: white; --border-color: rgba(0, 0, 0, 0.158); --text-color: rgba(0, 0, 0, 0.6); --hover-background: rgba(228, 228, 228, 1); --secondary-background: rgba(0, 0, 0, 0.8); --hover-text-color: rgb(82, 82, 82); --active-text-color: white; --active-background:black; } body, html { background-color: aqua; padding: 0; margin: 0; } .wifi-list-container { position: absolute; left: 50%; top: 100px; transform: translate(-50%); width: 100%; min-height: 100px; background-color: var(--primary-background); border-radius: 0.5em; border: 1px solid var(--border-color); } .wifi-list{ margin-top: 2em; padding:0; list-style: none; } .wifi-list__item { list-style-type: none; font-family: sans-serif; font-size: 1.5em; color: var(--text-color); border-bottom: 1px solid var(--border-color); text-align: center; padding: 0.5em; cursor: pointer; } .wifi-list__item:hover { background-color: var(--hover-background); } .settings-list{ margin-top: 2em; padding:0; list-style: none; } .settings-list__item { list-style-type: none; font-family: sans-serif; font-size: 1.5em; color: var(--text-color); border-bottom: 1px solid var(--border-color); padding: 0.2em; } .text { font-family: sans-serif; color: var(--text-color); } .refresh-button{ cursor: pointer; width: 2em; height: 2em; border: none !important; } .wifi-list__header, .settings__header{ font-size: 2em; border-bottom: 4px solid var(--border-color); width: 100%; text-align: center; } .settings-menu{ width: 100%; padding: 2em; transform: translate(0, -20%); background-color: var(--primary-background); z-index: 2; display: flex; flex-direction: column; justify-content: center; } .settings-container { background-color: var(--secondary-background); width: 100%; height: 100%; min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 1; display:none; align-items: center; justify-content: center; } .settings-button{ position:absolute; left:1em; top:1em; } .button{ cursor: pointer; font-size:1.5em; border: none; outline: none; padding:0.3em; background: var(--primary-background); border: 1px solid var(--border-color); border-radius: 3px; } .button:hover{ background-color: var(--hover-background); } .button:active{ background-color: var(--active-background); color: var(--active-text-color); } .settings__password, .settings__channel, .settings__prefix{ margin-top: 2em; font-size: 1em; margin-bottom: 1em; } .settings__mode{ width: 195px; box-sizing: content-box; padding: 2px; margin-top: 2em; font-size: 1em; margin-bottom: 1em; } @media screen and (width>400px) { .wifi-list-container { position: absolute; left: 50%; top: 20%; transform: translate(-50%); max-width: 70%; background-color: var(--primary-background); } .settings-menu{ width:60%; z-index: -1; border-radius: 5px; } } </style> <title>Document</title> </head> <body> <button class='button settings-button text'>Settings</button> <div class='settings-container'> <div class='settings-menu'> <ul class='settings-list'> <li class='settings-list__item set-password'> Set Password</li> <div class='settings__submenu set-password__menu'> <input class='settings__password' placeholder='Password' type='password'> <button type='submit' class='button settings__button text set-password__button'>Set password</button> </div> <li class='settings-list__item esp-now-settings'> ESP-NOW Settings</li> <div class='settings__submenu set-password__menu'> <select name='settings__mode' id='settings__mode' class='settings__mode'> <option value='closed'>Closed</option> <option value='master'>Master</option> <option value='slave'>Slave</option> </select> <button type='submit' class='button settings__button text set-mode__button'>Set Mode</button> </div> <div class='settings__submenu set-password__menu'> <input class='settings__channel' placeholder='Channel' type='text'> <button type='submit' class='button settings__button text set-channel__button'>Set Channel</button> </div> <div class='settings__submenu set-password__menu'> <input class='settings__prefix' placeholder='Prefix' type='text'> <button type='submit' class='button settings__button text set-prefix__button'>Set Prefix</button> </div> </ul> </div> </div> <div class='wifi-list-container'> <button class='text refresh-button button'>&#10227</button> <div class='wifi-list__header text'>Wifi list</div> <ul class='wifi-list'> <li class='wifi-list__item'> dummy data</li> <li class='wifi-list__item'> dummy data</li> <li class='wifi-list__item'> dummy data</li> </ul> </div> <script> deviceParams = { mode:" + String(Config::ESP_NOW_mode)+ ", channel:" + String(Config::ESP_NOW_channel) + ", prefix: '" + String(Config::SSID_AP_prefix.c_str()) + "', }; function buildWifiList(list) { const wifiList = document.querySelector('.wifi-list'); wifiList.innerHTML = ''; console.log(list); for (let item of list) { console.log('add item'); console.log(item); const node = document.createElement('li'); node.className = 'wifi-list__item'; node.innerHTML = item; node.addEventListener('click', (e) => { e.preventDefault(); const password = prompt('Enter password'); console.log(item, password); xhr( 'POST', '/connect', (response) => { console.log(response); }, JSON.stringify({ ssid: item, password }) ); }); wifiList.appendChild(node); } } const settingsContainer = document.querySelector('.settings-container'); document.querySelector('.refresh-button').addEventListener('click', (e) => { updateWifiList(); }); document.querySelector('.settings-button').addEventListener('click', (e) => { showSettings(); }); document .querySelector('.set-password__button') .addEventListener('click', (e) => { console.log('posting password'); const passwordField = document.querySelector('.settings__password'); const password = passwordField.value; passwordField.value = ''; xhr( 'POST', '/set-device-password', (response) => { console.log(response); hideSettings(); }, JSON.stringify({ password }) ); }); document.querySelector('.set-mode__button').addEventListener('click', (e) => { const modeEnum = { closed: 0, master: 1, slave: 2, }; const modeField = document.querySelector('.settings__mode'); const mode = modeEnum[modeField.value]; console.log(mode); xhr( 'POST', '/set-device-esp-now-mode', (response) => { console.log(response); deviceParams.mode = mode; }, JSON.stringify({ mode }) ); }); document .querySelector('.set-channel__button') .addEventListener('click', (e) => { const channelField = document.querySelector('.settings__channel'); const channel = channelField.value; console.log(channel); xhr( 'POST', '/set-device-esp-now-channel', (response) => { console.log(response); deviceParams.channel = channel; }, JSON.stringify({ channel }) ); }); document.querySelector('.set-prefix__button').addEventListener('click', (e) => { const prefixField = document.querySelector('.settings__prefix'); const prefix = prefixField.value; console.log(prefix); xhr( 'POST', '/set-device-esp-now-prefix', (response) => { console.log(response); deviceParams.prefix = prefix; }, JSON.stringify({ prefix }) ); }); settingsContainer.addEventListener('click', (e) => { if (e.target == settingsContainer) { hideSettings(); } }); document .querySelector('.settings-list__item.set-password') .addEventListener('click', (e) => { console.log('try set password'); }); document .querySelector('.settings-list__item.esp-now-settings') .addEventListener('click', (e) => { console.log('esp-now-settings'); }); function updateWifiList() { console.log('refresh'); xhr('GET', '/connections', (response) => { console.log(response); const wifis = response.split(','); if (JSON.stringify(wifis) === JSON.stringify([''])) return; buildWifiList(wifis); }); } function updateDeviceParams() { let mode; if (deviceParams.mode == 0) { mode = 'closed'; } if (deviceParams.mode == 1) { mode = 'master'; } if (deviceParams.mode == 2) { mode = 'slave'; } console.log(mode); document.querySelector('.settings__mode').value = mode; document.querySelector('.settings__channel').value = deviceParams.channel; document.querySelector('.settings__prefix').value = deviceParams.prefix; } function xhr(method, path, callback, body = null) { const xhr = new XMLHttpRequest(); xhr.open(method, path); xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); xhr.onreadystatechange = () => { if (xhr.readyState === 4) { callback(xhr.response); } }; xhr.send(body); } function showSettings() { document.querySelector('.settings-container').style.display = 'flex'; } function hideSettings() { document.querySelector('.settings-container').style.display = 'none'; } updateWifiList(); updateDeviceParams(); </script> </body> </html>");
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