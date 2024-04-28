#include <string>
#include <map>
#include <vector>
using namespace std;
class SchedulePoint{
  int time;//min: 0, max: 86400 | time of day in seconds
  int pwm; //min: 0, max: 100 | percentage
  public:
    SchedulePoint(int time, int pwm) {
      this->time = time;
      this->pwm = pwm;
    }
};

class Controller {
  string id;
  int mode; //0=manual|1=schedule
  std::map<string, int> manual; //manual mode settings
  std::map<string, vector<SchedulePoint>> schedule;
public:
  Controller(string id, int mode){
    this->id = id;
    this->mode = mode;
    this->manual = this->defaultManual();
    this->schedule = this->defaultSchedule();
  }
  std::map<string, int> defaultManual();
  std::map<string, vector<SchedulePoint>> defaultSchedule();
};

