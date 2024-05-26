#include "Controller.h"


int SchedulePoint::getTime(){
  return time;
}

int SchedulePoint::getPwm(){
  return pwm;
}

Controller* Controller::instance = nullptr;

std::map<string, int> Controller::defaultManual(){
  std::map<string, int> manual = {};
  for (int i = 0; i < fields.size(); i++) {
    manual.insert(std::pair<string, int> (fields[i], 0));
  }
  return manual;
};

std::map<string, vector<SchedulePoint>> Controller::defaultSchedule(){
  std::map<string, vector<SchedulePoint>> schedule = {};
  for (int i = 0; i < fields.size(); i++) {
    SchedulePoint firstSchedulePoint(0, 0);
    SchedulePoint lastSchedulePoint(86400, 0);
    vector<SchedulePoint> fieldSchedule = {firstSchedulePoint, lastSchedulePoint};
    schedule.insert(std::pair<string, vector<SchedulePoint>> (fields[i], fieldSchedule));
  }
  return schedule;
}

std::vector<int> Controller::defaultTimeVec(){
  return vector<int>{0, 86400};
};

std::vector<string> Controller::defaultFields(){
  return vector<string>{
    "red",
    "farmRed",
    "blueRoyal",
    "blue",
    "green",
    "ultraViolet",
    "warmWhite",
    "coldWhite",
  };
};

std::map<string, int> Controller::defaultPinMap(){
  std::map<string, int> default_pin_map = {};
  std::vector<int> pins = {12,15,2,0,3,14,5,13};
  for (int i = 0; i < fields.size();i++){
    default_pin_map.insert(std::pair<string, int>(fields[i], pins[i]));
  }
  return default_pin_map;
};

JsonDocument Controller::defaultCurrentPwm(){
  JsonDocument doc;
  for (int i = 0; i < fields.size();i++){
    doc[fields[i]] = 0;
  }
  return doc;
}

void Controller::updateSchedule(JsonObject scheduleJsonObj){
  vector<int> timeVec = {};
  std::map<string, vector<SchedulePoint>> schedule = {};
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

  //add first and last points as zeroes if they dont exist
  if(timeVec.front() != 0){
    timeVec.insert(timeVec.begin(), 0);
    for (int j = 0; j < fields.size();j++){
      string field = fields[j];
      SchedulePoint schedulePoint(0, 0);
      schedule[field].insert(schedule[field].begin(), schedulePoint);
    }
  }
  if(timeVec.back() != 86400){
    timeVec.insert(timeVec.end(), 86400);
    for (int j = 0; j < fields.size();j++){
      string field = fields[j];
      SchedulePoint schedulePoint(86400, 0);
      schedule[field].insert(schedule[field].end(), schedulePoint);
    }
  }
  this->schedule = schedule;
  this->timeVec = timeVec;
};

Controller* Controller::getInstance(){
  if (!instance) {
    instance = new Controller();
  }
  return instance;
}

void Controller::update(JsonDocument doc){
  
  std::map<string, int> manual = {};
  JsonObject scheduleJsonObj = doc["schedule"].as<JsonObject>();
  JsonObject manualJsonObj = doc["manual"].as<JsonObject>();

  boolean update_mode = doc.containsKey("mode");
  boolean update_schedule = doc.containsKey("schedule");
  boolean update_manual = doc.containsKey("manual");

  if(update_manual){
    for (int i = 0; i < fields.size();i++){
      string field = fields[i];
      schedule.insert(std::pair<string, vector<SchedulePoint>> (field, {}));
      manual.insert(pair<string, int>(field, manualJsonObj[field]));
    }
    this->manual_update = true;
    this->manual = manual;
  }

  if(update_schedule){
    updateSchedule(scheduleJsonObj);
  }

  if(update_mode) {
    if(doc["mode"] == "schedule"){
      this->mode = 1;
    }
    else{
      this->mode = 0;
    }
  }
}

void Controller::executeSchedule(){
  int seconds = (NTPTimeManager::getClient()->seconds()%60)*86400/60;
  if(timeVec[next_time_point_index]<seconds){
    next_time_point_index++;
    this->executeSchedule();
  }else if(timeVec[next_time_point_index - 1] > seconds){
    next_time_point_index--;
    this->executeSchedule();
  }
  else if(timeVec[next_time_point_index - 1] <= seconds&&timeVec[next_time_point_index] >= seconds){
    // if the time interval is correct
    int previous_point = timeVec[next_time_point_index - 1];
    int next_point = timeVec[next_time_point_index];
    double time_multiplier = double(seconds - previous_point) / double(next_point - previous_point);
    JsonDocument doc;
    for (const auto& pair : schedule) {
      string field = pair.first;
      vector<SchedulePoint>pwm_points = pair.second;
      int next_pwm = pwm_points[next_time_point_index].getPwm();
      int previous_pwm = pwm_points[next_time_point_index - 1].getPwm();
      int pwm_diff = next_pwm - previous_pwm;
      double current_pwm = double(previous_pwm)+(time_multiplier * double(pwm_diff));
      int brightness = int(double(current_pwm) * double(255) / double(100));
      ledcWrite(pin_map[field], brightness);
      doc[field] = brightness;
    }
    currentPwm = doc;
  }
}

void Controller::executeManual(){
  if(manual_update){
    JsonDocument doc;
    for (int i = 0; i < fields.size();i++) {
      string field = fields[i];
      int current_pwm = manual[field];
      int brightness = int(double(current_pwm) * double(255) / double(100));
      ledcWrite(pin_map[field], brightness);
      doc[field] = brightness;
    }
    currentPwm = doc;
  }
  manual_update = false;
}

void Controller::setFields (vector<string> fields){
  this->fields = fields;
}

void Controller::setupChannels(){
  for (int i = 0; i < fields.size();i++)
  {
    int pin_number = pin_map[fields[i]];
    ledcSetup(pin_number, 5000, 8); 
    ledcAttachPin(pin_number, pin_number);
  }
};

void Controller::executeState (){
  if(this->mode == 0){
    executeManual();
  }else if(this->mode == 1){
    executeSchedule();
  }
}

JsonDocument Controller::getCurrentPwmsAsJSON () {
  return currentPwm;
}
