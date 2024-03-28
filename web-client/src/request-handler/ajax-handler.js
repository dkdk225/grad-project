import { RequestHandler } from "./request-handler";
import { postRequest, getRequest} from "../requests"
class AjaxHandler extends RequestHandler {
  constructor() {
    super();
  }
  update(id, dict) {
    postRequest({ id, ...dict }, `/api/device/update`);
  }
  watch(id, onUpdate) {
    getRequest(`/api/device/${id}`).then(onUpdate);
  }
}
export { AjaxHandler };
