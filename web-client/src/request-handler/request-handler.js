import { server } from "../config";
class RequestHandler {
  constructor() {
    if (new.target === RequestHandler) {
      throw Error("RequestHandler is not instantiateable");
    }
    this.url = server.url;
  }
  /**
   * 
   * @param {string} id 
   * @param {Object} dictionary 
   */
  update(id, dictionary) {
    throw Error("update method not implemented");
  }
  watch(id, body) {
    throw Error("watch method not implemented");
  }
  removeWatch(id, body) {
    throw Error("removeWatch method is not implemented");
  }
}

export { RequestHandler };
