#include <vector>

class LoopManager{
  public:
    static std::vector<void (*)()> functions;
    static void addFunction(void (*func)());
    static void removeFunction(void (*func)());
};