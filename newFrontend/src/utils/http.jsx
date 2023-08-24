import axios from "axios";

import { BASE_URL } from "./global";

export default axios.create({
  baseURL: BASE_URL + "/api",
});
