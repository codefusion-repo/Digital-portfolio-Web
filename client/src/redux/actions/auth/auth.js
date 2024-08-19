import {
  ADD_MODAL,
  ADD_MSJ_MODAL,
  REMOVE_MODAL,
} from "redux/actions/modal/types";
import {
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAIL,
  GET_RESET_PASSWORD_SUCCESS,
  GET_RESET_PASSWORD_FAIL,
  GET_RESET_PASSWORD_CONFIRM_SUCCESS,
  GET_RESET_PASSWORD_CONFIRM_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  LOGOUT,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  REFRESH_SUCCESS,
  REFRESH_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
} from "./types";

import axios from "axios";

export const load_user = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/users/me/`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: USER_LOADED_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: USER_LOADED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const body = JSON.stringify({
    email,
    password,
  });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/login`,
      body,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch({
        type: GET_LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: REMOVE_MODAL,
      });
      dispatch(load_user());
    } else {
      dispatch({
        type: GET_LOGIN_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch({
        type: ADD_MSJ_MODAL,
        payload: {
          showModal: true,
          message: "Invalid email or password",
        },
      });
    }
  } catch (err) {
    dispatch({
      type: GET_LOGIN_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    dispatch({
      type: ADD_MSJ_MODAL,
      payload: {
        showModal: true,
        message: "Invalid email or password",
      },
    });
  }
};

export const check_authenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      token: localStorage.getItem("access"),
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const refresh = () => async (dispatch) => {
  if (localStorage.getItem("refresh")) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      refresh: localStorage.getItem("refresh"),
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`,
        body,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: REFRESH_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: REFRESH_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: REFRESH_FAIL,
      });
    }
  } else {
    dispatch({
      type: REFRESH_FAIL,
    });
  }
};

export const reset_password = (email) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    email,
  });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/send_reset_email/`,
      body,
      config
    );

    if (res.status === 204) {
      dispatch({
        type: GET_RESET_PASSWORD_SUCCESS,
      });

      dispatch({
        type: ADD_MODAL,
        payload: {
          showModal: true,
          message: "Recovery mail sent",
        },
      });

      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    } else {
      dispatch({
        type: GET_RESET_PASSWORD_FAIL,
      });
      dispatch({
        type: ADD_MODAL,
        payload: {
          showModal: true,
          message: "The e-mail address provided does not exist in our database",
        },
      });

      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_RESET_PASSWORD_FAIL,
    });

    dispatch({
      type: ADD_MODAL,
      payload: {
        showModal: true,
        message: "The e-mail address provided does not exist in our database",
      },
    });

    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
  }
};

export const reset_password_confirm =
  (uid, token, new_password, re_new_password) => async (dispatch) => {
    dispatch({
      type: SET_AUTH_LOADING,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      uid,
      token,
      new_password,
      re_new_password,
    });

    if (new_password !== re_new_password) {
      dispatch({
        type: GET_RESET_PASSWORD_CONFIRM_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch({
        type: ADD_MODAL,
        payload: {
          showModal: true,
          message: "Passwords do not match",
        },
      });
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/reset_password_confirm/`,
          body,
          config
        );

        if (res.status === 200) {
          dispatch({
            type: GET_RESET_PASSWORD_CONFIRM_SUCCESS,
          });
          dispatch({
            type: REMOVE_AUTH_LOADING,
          });
          dispatch({
            type: ADD_MODAL,
            payload: {
              showModal: true,
              message: "Password updated",
            },
          });
        } else {
          dispatch({
            type: GET_RESET_PASSWORD_CONFIRM_FAIL,
          });
          dispatch({
            type: REMOVE_AUTH_LOADING,
          });
          dispatch({
            type: ADD_MODAL,
            payload: {
              showModal: true,
              message:
                "The password must be at least 8 characters long. It must include letters and numbers",
            },
          });
        }
      } catch (err) {
        dispatch({
          type: GET_RESET_PASSWORD_CONFIRM_FAIL,
        });
        dispatch({
          type: REMOVE_AUTH_LOADING,
        });
        dispatch({
          type: ADD_MODAL,
          payload: {
            showModal: true,
            message:
              "The password must be at least 8 characters long. It must include letters and numbers",
          },
        });
      }
    }
  };

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });

  dispatch({
    type: ADD_MODAL,
    payload: {
      showModal: true,
      message: "Closed session",
    },
  });
};
