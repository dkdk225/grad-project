import { server } from "../config";
import { AjaxHandler } from "./ajax-handler";
import { SocketHandler } from "./socket-handler";
const handlerMap = {
  socket: SocketHandler,
  ajax: AjaxHandler,
};



const RequestHandler = handlerMap[server.requestHandler];

export { RequestHandler };
