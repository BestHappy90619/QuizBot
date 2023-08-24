import { DEBUG_MODE } from "@/utils/global";
import http from "../utils/http";

const AUTH_API = "/auth";

const register = (data) => {
  return http
    .post(AUTH_API + "/signup", data)
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

const login = (data) => {
  return http
    .post(AUTH_API + "/signin", data)
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

const logout = () => {
  localStorage.removeItem("user");
};

const changeProfile = (data) => {
  return http
    .post(AUTH_API + "/updateProfile", data)
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

const changePassword = (data) => {
  return http
    .post(AUTH_API + "/updatePassword", data)
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

const AuthService = {
  register,
  login,
  logout,
  changeProfile,
  changePassword,
};

export default AuthService;
