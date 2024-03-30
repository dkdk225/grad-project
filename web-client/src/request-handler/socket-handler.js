import { RequestHandler } from "./request-handler";
import { io } from "socket.io-client";

class SocketHandler extends RequestHandler {
  #socket;
  constructor() {
    super();
    this.#socket = io(this.url);
  }
  updateDeviceControl(id, dictionary) {
    this.#socket.emit("update", id, dictionary);
  }
  watch(id, onUpdate) {
    this.#socket.emit("watch", id);
    this.#socket.on("update", (updateDict) => {
      onUpdate(id, updateDict);
    });
  }
  stopWatch(onUpdate) {
    this.#socket("unwatch", id);
    this.#socket.off("update", onUpdate);
  }
}
export { SocketHandler };
