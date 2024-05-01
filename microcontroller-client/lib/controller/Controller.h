#include <string>
#include <map>
#include <vector>
#include <ArduinoJson.h>
#include <iostream>

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

  int mode; //0=manual|1=schedule
  int next_time_point_index;
  std::map<string, int> manual; //manual mode settings
  std::map<string, vector<SchedulePoint>> schedule;
  vector<int> timeVec;
  

private:
  // Static instance pointer
  static Controller* instance;

  // Private constructor to prevent instantiation from outside the class
  Controller()
  {
    this->mode = 1;
    this->manual = this->defaultManual();
    this->schedule = this->defaultSchedule();
    }

    // Delete copy constructor to prevent copying
    Controller(const Controller&) = delete;
    Controller& operator=(const Controller&) = delete;


  public:
    std::map<string, int> defaultManual();
    std::map<string, vector<SchedulePoint>> defaultSchedule();
    void update(JsonDocument doc);
    static Controller *getInstance();
};

