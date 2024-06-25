#include "Espnowmanager.h"

void onDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("I sent data:");
}

void onDataRecv(const uint8_t *mac_addr, const byte *data, int data_len){
  Serial.print("I just recieved ->");

  std::string payload;
  for (size_t i = 0; i < data_len; i++) {
    payload += static_cast<char>(data[i]);
  }
  std::cout << payload << std::endl;
  JsonDocument doc;
  deserializeJson(doc, payload);
  doc["mode"] == "manual";
  Controller::getInstance()->updateManual(doc);
}

EspNowManager* EspNowManager::instance = nullptr;
EspNowManager* EspNowManager::getInstance(){
  if (!instance) {
    instance = new EspNowManager();
  }
  return instance;
}

void EspNowManager::scanForSlaves(){
  Serial.println("look for slaves");
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
          this->slaves.push_back(slave);
          Serial.println("===========add the device==========");
          continue;
        }
        delete slave;
      }
    }
  }
}

void EspNowManager::openMaster(){
  esp_wifi_set_ps(WIFI_PS_NONE); // wifi congestion solution
  delay(100);
  if(WiFi.getMode() != WIFI_STA) WifiManager::to_ESPNOW_STA();
  esp_now_init();
  esp_now_register_send_cb(onDataSent);
  this->scanForSlaves();
  LoopTasks::getInstance()->addForExecution("each_loop", "propogate_state_via_esp_now");
  std::cout << this->slaves.size() << std::endl;
  for (int i = 0; i < this->slaves.size();i++){
    std::cout << "SLAVE ADRESS" << std::endl;
    for (int j = 0; j < 6; j++){
      Serial.println(this->slaves[i]->peer_addr[j]);
    }
  }
};


void EspNowManager::close(){  
  LoopTasks::getInstance()->excludeFromExecution("each_loop", "propogate_state_via_esp_now");
  esp_now_deinit();
  //remove slaves from heap to prevent memory leak
  for (int i = 0; i < this->slaves.size();i++){
    delete this->slaves[i];
  }
  esp_wifi_set_ps(WIFI_PS_MIN_MODEM);
};

void EspNowManager::openSlave(){
  WifiManager::to_ESPNOW_AP();
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_wifi_set_ps(WIFI_PS_MIN_MODEM);
  LoopTasks::getInstance()->excludeFromExecution("each_loop", "monitor_mqtt");
};

void EspNowManager::deleteSlaves() {
  for (int i = 0; i < this->slaves.size();i++){
    esp_now_del_peer(this->slaves[i]->peer_addr);
    delete this->slaves[i];
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