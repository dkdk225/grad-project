#include "Httpmixin.h"
#include <iostream>

void HttpMixin::get(string url, void (*callback)(String))
{
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    http.begin(url.c_str());

    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(httpCode);
      Serial.println(payload);
      callback(payload);
    } else {
      Serial.println("Error on HTTP request");
    }

    http.end(); 
  }
}


void HttpMixin::post(string url, void (*callback)(String), JsonDocument body){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    http.begin(url.c_str());
    string serialJSON;
    serializeJson(body, serialJSON);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(serialJSON.c_str());
    std::cout << serialJSON << std::endl;
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(httpCode);
      Serial.println(payload);
      callback(payload);
    } else {
      Serial.println("Error on HTTP request");
    }

    http.end(); 
  }
};
