#include "Controller.h"
vector<string> fields = {
    "red",
    "farmRed",
    "blueRoyal",
    "blue",
    "green",
    "ultraViolet",
    "warmWhite",
    "coldWhite",
  };
std::map<string, int> Controller::defaultManual(){
  std::map<string, int> manual = {};
  for (int i = 0; i < fields.size(); i++) {
    manual.insert(std::pair<string, int> (fields[i], 0));
  }
  return manual;
};
Controller* Controller::instance = nullptr;
std::map<string, vector<SchedulePoint>> Controller::defaultSchedule(){
  std::map<string, vector<SchedulePoint>> schedule = {};
  for (int i = 0; i < fields.size(); i++) {
    SchedulePoint schedulePoint(0, 0);
    vector<SchedulePoint> fieldSchedule = {schedulePoint};
    schedule.insert(std::pair<string, vector<SchedulePoint>> (fields[i], fieldSchedule));
  }
  return schedule;
}

Controller* Controller::getInstance(){
    if (!instance) {
      instance = new Controller();
    }
    return instance;
}

void Controller::update(JsonDocument doc){
  // declare time array
  vector<int> timeVec = {};
  std::map<string, vector<SchedulePoint>> schedule = {};
  std::map<string, int> manual = {};
  JsonObject scheduleJsonObj = doc["schedule"].as<JsonObject>();
  JsonObject manualJsonObj = doc["manual"].as<JsonObject>();


  for (int i = 0; i < fields.size();i++){
    string field = fields[i];
    schedule.insert(std::pair<string, vector<SchedulePoint>> (field, {}));
    manual.insert(pair<string, int>(field, manualJsonObj[field]));
  }

  for (int i = 0; i < scheduleJsonObj[fields[0]].size(); i++){
    int time = scheduleJsonObj[fields[0]][i]["x"];
    timeVec.insert(timeVec.end(), time);

    for (int j = 0; j < fields.size();j++){
      string field = fields[j];
      int time = scheduleJsonObj[field][i]["x"];
      int pwm = scheduleJsonObj[field][i]["y"];
      SchedulePoint schedulePoint(time, pwm);
      schedule[field].insert(schedule[field].end(), schedulePoint);
    }
  }

  this->timeVec = timeVec;
  this->manual = manual;
  this->schedule = schedule;
  this->mode = doc["mode"];
  for (const auto& pair : manual) {
    std::cout << pair.first << ": " << pair.second << std::endl;
  }
}

