import { RequestHandler } from "./request-handler";
import { io } from "socket.io-client";

class SocketHandler extends RequestHandler {
  #socket;
  constructor() {
    super();
    this.#socket = io(this.url);
  }
  update(id, dictionary) {
    console.log("a call from SocketHandler")
    console.log(id, dictionary)
    this.#socket.emit("update", id, dictionary);
  }
  watch(id, body) {
    this.#socket.emit("watch", id);
    this.#socket.on("update", (updateDict) => {
      body(id, updateDict);
    });
  }
  stopWatch(body) {
    this.#socket("unWatch", id);
    this.#socket.off("update", body);
  }
}
export { SocketHandler };
