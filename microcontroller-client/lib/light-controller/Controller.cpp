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

std::map<string, vector<SchedulePoint>> Controller::defaultSchedule(){
  std::map<string, vector<SchedulePoint>> schedule = {};
  for (int i = 0; i < fields.size(); i++) {
    SchedulePoint schedulePoint(0, 0);
    vector<SchedulePoint> fieldSchedule = {schedulePoint};
    schedule.insert(std::pair<string, vector<SchedulePoint>> (fields[i], fieldSchedule));
  }
  return schedule;
}