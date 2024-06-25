#include <string>
#include <map>
#include <vector>
#include <ArduinoJson.h>
#include <iostream>
#include <Ntptimemanager.h>

#ifndef Controller_h // Include guard starts
#define Controller_h // Define the macro
using namespace std;
class SchedulePoint{
  int time;//min: 0, max: 86400 | time of day in seconds
  int pwm; //min: 0, max: 100 | percentage
  public:
    SchedulePoint(int time, int pwm) {
      this->time = time;
      this->pwm = pwm;
    }
    int getTime();
    int getPwm();
};

class Controller {

  int mode; //0=manual|1=schedule
  int next_time_point_index;
  boolean manual_update;
  std::map<string, int> manual; //manual mode settings
  std::map<string, vector<SchedulePoint>> schedule;
  vector<int> timeVec;
  vector<string> fields;
  std::map<string, int> pin_map;
  JsonDocument currentPwm; //currently brightnes values of colors 0-100

private:
  // Static instance pointer
  static Controller* instance;

  // Private constructor to prevent instantiation from outside the class
  Controller() {
    this->mode = 0;
    this->manual = this->defaultManual();
    this->schedule = this->defaultSchedule();
    this->timeVec = this->defaultTimeVec();
    this->next_time_point_index = 0;
    this->fields = this->defaultFields();
    this->pin_map = this->defaultPinMap();
    this->manual_update = false;
    this->currentPwm = this->defaultCurrentPwm();
    this->setupChannels();
  }

  // Delete copy constructor to prevent copying
  Controller(const Controller&) = delete;
  Controller& operator=(const Controller&) = delete;
  void setupChannels();

public:
  static Controller *getInstance();
  std::map<string, int> defaultManual();
  std::map<string, vector<SchedulePoint>> defaultSchedule();
  std::vector<int> defaultTimeVec();
  std::vector<string> defaultFields();
  std::map<string, int> defaultPinMap();
  JsonDocument defaultCurrentPwm();
  void updateSchedule(JsonObject scheduleJsonObj);
  void updateManual(JsonDocument pwmValues);
  void update(JsonDocument doc);
  void executeSchedule();
  void executeManual();
  void executeState();
  void setFields(vector<string> fields);
  JsonDocument getCurrentPwmsAsJSON();
};

#endif // Controller_h // Include guard ends
