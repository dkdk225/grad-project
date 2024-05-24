#include <ESPAsyncWebServer.h>
using namespace std;


class WebServer {
  

public:
  static AsyncWebServer server;
  static void start();
  static void stop();
};