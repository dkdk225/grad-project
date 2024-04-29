#include "Loopmanager.h"
#include <algorithm>
using namespace std;

void LoopManager::addFunction(void (*func)()){
  LoopManager::functions.push_back(func);
}

void LoopManager::removeFunction(void (*func)()){
    auto it = std::find(LoopManager::functions.begin(), LoopManager::functions.end(), func);
    if (it != LoopManager::functions.end()) {
        LoopManager::functions.erase(it);
    }
}