#include <map>
#include <functional>
#include <vector>
#include <map>
#include <string>
#include <algorithm>
#include <iostream>

using namespace std;
#ifndef LoopTasks_h // Include guard starts
#define LoopTasks_h // Define the macro  LoopTasks_h
class LoopTasks {
  std::map<string,std::function<void()>> task_map;
  std::map<string, vector<std::string>> execution_lists;

private:
  // Static instance pointer
  static LoopTasks *instance;

  // Private constructor to prevent instantiation from outside the class
  LoopTasks()
  {
    this->task_map = {};
    this->execution_lists = {};
  }

    // Delete copy constructor to prevent copying
    LoopTasks(const LoopTasks&) = delete;
    LoopTasks& operator=(const LoopTasks&) = delete;


  public:
    static LoopTasks* getInstance();
    void addTask(std::string name, std::function<void()>task);
    void removeTask(std::string key);
    void addForExecution(std::string list_key,std::string task_key);
    void excludeFromExecution(std::string list_key, std::string task_key);
    void setExecutionList(std::string list_key,std::vector<std::string> new_execution_list);
    void executeAllTasks();
    void executeTaskList(std::string list_key);
};

#endif // LoopTasks_h 
