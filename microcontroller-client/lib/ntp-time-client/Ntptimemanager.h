#include <NTPClient.h>
#include <WiFiUdp.h>

#ifndef NTPTimeManager_h // Include guard starts
#define NTPTimeManager_h // Define the macro
class NTPTimeManager {
  private:
    static NTPTimeManager* instance;

    WiFiUDP _udp;
    NTPClient _ntp;
    NTPClient _createNtpClient();
    void _update();
    
    // Private constructor to prevent instantiation from outside the class
    NTPTimeManager();

    // Delete copy constructor to prevent copying
    NTPTimeManager(const NTPTimeManager &) = delete;
    NTPTimeManager &operator=(const NTPTimeManager &) = delete;

  public:
    static NTPTimeManager* getClient();
    void begin();
    int seconds();


};
#endif // NTPTimeManager_h // Include guard ends