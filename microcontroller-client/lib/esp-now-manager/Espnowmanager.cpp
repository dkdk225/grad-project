#include "Espnowmanager.h"
  uint8_t data = 20;

void EspNowManager::scanForSlaves(){
  int8_t scanResults = WiFi.scanNetworks();
  for (int i = 0; i < scanResults; i++){
    String SSID = WiFi.SSID(i);
    String BSSIDstr = WiFi.BSSIDstr(i);
    if (SSID.indexOf(Config::SSID_AP_prefix.c_str()) == 0) {
      int mac[6];
      if ( 6 == sscanf(BSSIDstr.c_str(), "%x:%x:%x:%x:%x:%x", &mac[0], &mac[1], &mac[2],&mac[3], &mac[4], &mac[5], &mac[6])){
        esp_now_peer_info_t* slave = new esp_now_peer_info_t();
        for (int j = 0; j < 6; j++){
          slave->peer_addr[j] = (uint8_t)mac[j];
        }
        slave->channel = Config::ESP_NOW_channel;
        slave->encrypt = 0;
        if(!esp_now_is_peer_exist(slave->peer_addr)) {
          Serial.println("try to add device");
          esp_now_add_peer(slave);
          Serial.println("===========add the device==========");
          continue;
        }
        delete slave;
      }
    }
  }
}


void EspNowManager::propagateState(JsonDocument state){
  Serial.println("attempt esp-now propagation");
  bool fromHead = true;
  esp_now_peer_info_t slave;
  int n = measureJson(state)+1;
  char str[n];
  serializeJson(state, str, n);
  uint8_t u[strlen(str)];
  memcpy(u, str, strlen(str));
  while (esp_now_fetch_peer(fromHead, &slave) == ESP_OK) {
    Serial.println("esp try to send");
    fromHead = false;
    for (int i = 0; i < 6; i++){
      Serial.println(slave.peer_addr[i]);
    }
      esp_now_send(slave.peer_addr, u, sizeof(u));
  }
}