import { DEBUG_MODE } from "@/utils/global";
import http from "../utils/http";

const USER_API = "/user";

const contact = (data) => {
  return http
    .post(USER_API + "/contact", data)
    .then(
      (res) => {
        return res;
      },
      (err) => {
        if (!DEBUG_MODE) console.clear();
        return err.response;
      }
    )
    .catch((err) => {
      return err;
    });
};

const UserService = { contact };

export default UserService;
