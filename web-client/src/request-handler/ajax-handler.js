import { RequestHandler } from "./request-handler";
import { postRequest} from "../requests"
class AjaxHandler extends RequestHandler {
  constructor() {
    super()
  }
  update(id, dictionary) {
    postRequest({id, ...dict}, this.url)
  }
}
export { AjaxHandler };
