#include "Looptasks.h"

// std::map<string,std::function<void()>> LoopTasks::task_map = {};
LoopTasks* LoopTasks::instance = nullptr;


void LoopTasks::executeAllTasks(){
  for (const auto& pair : task_map) {
    pair.second();
  }
}

void LoopTasks::executeTaskList(std::string list_key){
  for (int i = 0; i < execution_lists[list_key].size();i++)
  {
    task_map[execution_lists[list_key][i]]();
  }
}

void LoopTasks::addTask(std::string name, std::function<void()>task){
  task_map.insert(std::pair<std::string, std::function<void()>>(name, task));
}

void LoopTasks::removeTask(std::string key){
  task_map.erase(task_map.find(key));
}

void LoopTasks::excludeFromExecution(std::string list_key, std::string task_key){
  vector<std::string> execution_list = execution_lists[list_key];
  execution_list.erase(std::remove(execution_list.begin(), execution_list.end(), task_key), execution_list.end());
}

void LoopTasks::addForExecution(std::string list_key, std::string task_key){
  execution_lists[list_key].push_back(task_key);
}

void LoopTasks::setExecutionList(std::string list_key, std::vector<std::string> new_execution_list){
  auto execution_list = execution_lists.find(list_key);
  if(execution_list != execution_lists.end()){
    execution_lists[list_key] = new_execution_list;
  }
  else{
    execution_lists.insert(std::pair<string, std::vector<std::string>>(list_key, new_execution_list));
  }
}


LoopTasks* LoopTasks::getInstance(){
  if (!instance) {
    instance = new LoopTasks();
  }
  return instance;
}