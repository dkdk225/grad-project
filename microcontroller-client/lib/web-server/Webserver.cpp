#include "Webserver.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <string>
#include "Wifimanager.h"

#include <iostream>
using namespace std;

AsyncWebServer WebServer::server = AsyncWebServer(80);
void WebServer::start() {
  server.on("/connections", HTTP_GET, [](AsyncWebServerRequest *request) { 
    Serial.print("start scan");
    int n = WiFi.scanNetworks();
      Serial.println("Scan done");
      String SSIDs = WiFi.SSID(0);
      for (int i = 1; i < n; ++i) {
        SSIDs = SSIDs+","+WiFi.SSID(i);
      }
    request->send(200, "text/plain", SSIDs); 
  }); 

  server.on("/connect", HTTP_POST, [](AsyncWebServerRequest *request) {
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    JsonDocument doc;
    string payload;
    for (size_t i = 0; i < len; i++) {
      payload += static_cast<char>(data[i]);
    }
    std::cout << payload << std::endl;
    std::cout << doc["ssid"] << std::endl;
    deserializeJson(doc, payload);
    server.end();
    delay(1000);
    WifiManager::to_STA(doc["ssid"], doc["password"]);
    request->send(200);
  });
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("text/html");
    response->print("<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8' /> <meta name='viewport' content='width=device-width, initial-scale=1.0' /> <style> :root { --primary-background: white; --border-color: rgba(0, 0, 0, 0.158); --text-color: rgba(0, 0, 0, 0.6); --hover-background: rgba(228, 228, 228, 1); } body { background-color: aqua; } .wifi-list { position: absolute; left: 50%; top: 100px; transform: translate(-50%); width: 100%; min-height: 100px; background-color: var(--primary-background); } @media screen and (width>400px) { .wifi-list { padding: 0; position: absolute; left: 50%; top: 30%; transform: translate(-50%, -50%); max-width: 70%; background-color: var(--primary-background); } } .wifi-list__item { list-style-type: none; font-family: sans-serif; font-size: 1.5em; color: var(--text-color); border-bottom: 1px solid var(--border-color); text-align: center; padding: 0.5em; cursor: pointer; } .wifi-list__item:hover { background-color: var(--hover-background); } .text { font-family: sans-serif; color: var(--text-color); } .refresh-button { cursor: pointer; } </style> <title>Document</title> </head> <body> <div class='wifi-list-container'> <div class='text refresh-button'>refresh</div> <ul class='wifi-list'> <li class='wifi-list__item'>dummy data</li> <li class='wifi-list__item'>dummy data</li> <li class='wifi-list__item'>dummy data</li> </ul> </div> <script> function buildWifiList(list) { const wifiList = document.querySelector('.wifi-list'); wifiList.innerHTML = ''; for (let item of list) { const node = document.createElement('li'); node.className = 'wifi-list__item'; node.innerHTML = item; node.addEventListener('click', (e) => { e.preventDefault(); const password = prompt('Enter password'); console.log(item, password); xhr( 'POST', '/connect', (response) => { console.log(response); }, JSON.stringify({ ssid: item, password }) ); }); wifiList.appendChild(node); } } document .querySelector('.refresh-button') .addEventListener('click', (e) => { console.log('refresh'); xhr('GET', '/connections', (response) => { const wifis = response.split(','); buildWifiList(wifis); }); }); function xhr(method, path, callback, body = null) { const xhr = new XMLHttpRequest(); xhr.open(method, path); xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); xhr.onreadystatechange = () => { if (xhr.readyState === 4) { callback(xhr.response); } }; xhr.send(body); } </script> </body> </html> ");
    request->send(response);
  });

  server.begin();
}

