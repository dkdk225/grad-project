import { RequestHandler } from "./request-handler";
import { postRequest, getRequest} from "../requests"
class AjaxHandler extends RequestHandler {
  constructor() {
    super();
  }
  updateDeviceControl(deviceId, dict) {
    postRequest({ deviceId, ...dict }, `/api/device-control/update`);
  }
  watch(id, onUpdate) {
    getRequest(`/api/device-control/${id}`).then(onUpdate);
  }
}
export { AjaxHandler };
