#include "Ntptimemanager.h"
//ntp time client begins when wifi mode switches to STA
NTPTimeManager* NTPTimeManager::instance = nullptr;


NTPTimeManager::NTPTimeManager() : 
  _ntp(_createNtpClient())
{
}

NTPClient NTPTimeManager::_createNtpClient() {
  NTPClient ntp(_udp, "pool.ntp.org", 10800, 86400000);
  return ntp;
}

void NTPTimeManager::begin() {
  _update();
}

void NTPTimeManager::_update() {
  _ntp.begin(); // Throws an exception
  if(_ntp.update()) {
    long time = _ntp.getEpochTime();
  } else {
    Serial.print("Failed to get time from server.\n");
  }
}

int NTPTimeManager::seconds() {
  _ntp.begin(); // Throws an exception
  return _ntp.getSeconds() + _ntp.getMinutes() * 60 + _ntp.getHours() * 3600;
}

NTPTimeManager* NTPTimeManager::getClient(){
  if (!instance) {
    instance = new NTPTimeManager();
  }
  return instance;
}