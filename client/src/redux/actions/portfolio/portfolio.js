import axios from "axios";
import {
  GET_AUTHOR_PORTFOLIO_LIST_FAIL,
  GET_AUTHOR_PORTFOLIO_LIST_SUCCESS,
  GET_PORTFOLIO_LIST_FAIL,
  GET_PORTFOLIO_LIST_SUCCESS,
  GET_PROJECT_FAIL,
  GET_PROJECT_SUCCESS,
} from "./types";

export const get_portfolio_list = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
    },
  };
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/portfolio/list`,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: GET_PORTFOLIO_LIST_SUCCESS,
        payload: res.data.projects,
      });
    } else {
      dispatch({
        type: GET_PORTFOLIO_LIST_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_PORTFOLIO_LIST_FAIL,
    });
  }
};

export const get_portfolio_list_page = (p) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
    },
  };
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/portfolio/list?p=${p}`,
      config
    );

    if (res.status === 200) {
      dispatch({
        type: GET_PORTFOLIO_LIST_SUCCESS,
        payload: res.data.projects,
      });
    } else {
      dispatch({
        type: GET_PORTFOLIO_LIST_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_PORTFOLIO_LIST_FAIL,
    });
  }
};

export const get_project_detail = (slug) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/portfolio/project/${slug}`,
      config
    );

    if (res.status === 200) {
      dispatch({
        type: GET_PROJECT_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: GET_PROJECT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_PROJECT_FAIL,
    });
  }
};

export const get_author_portfolio_list = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/portfolio/author_projects`,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: GET_AUTHOR_PORTFOLIO_LIST_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: GET_AUTHOR_PORTFOLIO_LIST_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_AUTHOR_PORTFOLIO_LIST_FAIL,
    });
  }
};

export const get_author_portfolio_list_page = (p) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/portfolio/author_projects?p=${p}`,
      config
    );

    if (res.status === 200) {
      dispatch({
        type: GET_AUTHOR_PORTFOLIO_LIST_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: GET_AUTHOR_PORTFOLIO_LIST_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_AUTHOR_PORTFOLIO_LIST_FAIL,
    });
  }
};
