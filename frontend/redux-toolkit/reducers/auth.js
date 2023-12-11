import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import AuthService from "../../src/services/Auth";

import {
  AUTH_REGISTER,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  CHANGE_PROFILE,
  CHANGE_PASSWORD,
} from "../types";

const user = JSON.parse(localStorage.getItem("user"));

export const register = createAsyncThunk(
  AUTH_REGISTER,
  async ({ email, firstName, lastName, pwd }, thunkAPI) => {
    return AuthService.register({
      email,
      firstname: firstName,
      lastname: lastName,
      password: pwd,
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return;
        } else if(res.status === 409) {
          thunkAPI.dispatch(setMessage(res.data.message));
        } else if (res.status === 400) {
          thunkAPI.dispatch(setMessage("Please input the valid format!"));
        } else {
          thunkAPI.dispatch(
            setMessage("Sorry, An error occurred while registering you.")
          );
        }
        return thunkAPI.rejectWithValue();
      })
      .catch((err) => {
        thunkAPI.dispatch(
          setMessage("Sorry, but there seem to be some problem on our site.")
        );
        return thunkAPI.rejectWithValue();
      });
  }
);

export const login = createAsyncThunk(
  AUTH_LOGIN,
  async ({ email, password }, thunkAPI) => {
    return AuthService.login({ email, password })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.data.token) {
            localStorage.setItem("user", JSON.stringify(res.data.data));
          }
          return { user: res.data.data };
        } else if (res.status === 404) {
          thunkAPI.dispatch(setMessage("The Email was not found!"));
        } else if (res.status === 403) {
          thunkAPI.dispatch(setMessage("Sorry, You should verify your email. Please check your inbox!"));
        } else if (res.status === 401) {
          thunkAPI.dispatch(setMessage("The password is incorrect!"));
        } else if (res.status === 400) {
          thunkAPI.dispatch(setMessage("Please input the valid format!"));
        } else {
          thunkAPI.dispatch(
            setMessage("Sorry, An error occurred while login you.")
          );
        }
        return thunkAPI.rejectWithValue();
      })
      .catch((err) => {
        thunkAPI.dispatch(
          setMessage("Sorry, but there seem to be some problem on our site.")
        );
        return thunkAPI.rejectWithValue();
      });
  }
);

export const logout = createAsyncThunk(AUTH_LOGOUT, async () => {
  await AuthService.logout();
});

export const changeProfile = createAsyncThunk(
  CHANGE_PROFILE,
  async ({ id, email, firstname, lastname }, thunkAPI) => {
    return AuthService.changeProfile({ id, email, firstname, lastname })
      .then((res) => {
        if (res.status === 200) {
          var profile = JSON.parse(localStorage.getItem("user"));
          profile.email = res.data.data.email;
          profile.firstname = res.data.data.firstname;
          profile.lastname = res.data.data.lastname;
          localStorage.setItem("user", JSON.stringify(profile));
          return { user: profile };
        } else if (res.status === 404) {
          thunkAPI.dispatch(setMessage("This profile was not found!"));
        } else if (res.status === 400) {
          thunkAPI.dispatch(setMessage("Please input the valid format!"));
        } else {
          thunkAPI.dispatch(
            setMessage("Sorry, An error occurred while changing your profile.")
          );
        }
        return thunkAPI.rejectWithValue();
      })
      .catch((err) => {
        thunkAPI.dispatch(
          setMessage("Sorry, but there seem to be some problem on our site.")
        );
        return thunkAPI.rejectWithValue();
      });
  }
);

export const changePassword = createAsyncThunk(
  CHANGE_PASSWORD,
  async ({ id, oldP, newP }, thunkAPI) => {
    return AuthService.changePassword({ id, oldP, newP })
      .then((res) => {
        if (res.status === 200) {
          return;
        } else if (res.status === 404) {
          thunkAPI.dispatch(setMessage("This profile was not found!"));
        } else if (res.status === 400) {
          thunkAPI.dispatch(setMessage("Please input the valid format!"));
        } else if (res.status === 401) {
          thunkAPI.dispatch(setMessage("The old password is incorrect!"));
        } else {
          thunkAPI.dispatch(
            setMessage("Sorry, An error occurred while changing your password.")
          );
        }
        return thunkAPI.rejectWithValue();
      })
      .catch((err) => {
        thunkAPI.dispatch(
          setMessage("Sorry, but there seem to be some problem on our site.")
        );
        return thunkAPI.rejectWithValue();
      });
  }
);

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [changeProfile.fulfilled]: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
