import Layout from "hocs/layouts/Layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { reset_password_confirm } from "redux/actions/auth/auth";
import { Helmet } from "react-helmet-async";
import { ADD_MODAL, ADD_MSJ_MODAL } from "redux/actions/modal/types";
import axios from "axios";
import {
  GET_RESET_PASSWORD_CONFIRM_FAIL,
  GET_RESET_PASSWORD_CONFIRM_SUCCESS,
  REMOVE_AUTH_LOADING,
} from "redux/actions/auth/types";

function ResetPasswordConfirm({ reset_password_confirm }) {
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const uid = params.uid;
  const token = params.token;

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("start");
    if (new_password === re_new_password) {
      const fetchNewPassword = async () => {
        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("token", token);
        formData.append("new_password", new_password);

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/user/reset_password_confirm`,
            formData,
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
              type: ADD_MSJ_MODAL,
              payload: {
                showModal: true,
                message: "Contraseña cambiada.",
              },
            });
            navigate("/login");
          } else {
            dispatch({
              type: GET_RESET_PASSWORD_CONFIRM_FAIL,
            });
            dispatch({
              type: REMOVE_AUTH_LOADING,
            });
            dispatch({
              type: ADD_MSJ_MODAL,
              payload: {
                showModal: true,
                message:
                  "La contraseña debe tener al menos 8 caracteres. Debe incluir letras y números.",
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
            type: ADD_MSJ_MODAL,
            payload: {
              showModal: true,
              message:
                "La contraseña debe tener al menos 8 caracteres. Debe incluir letras y números.",
            },
          });
        }
      };

      fetchNewPassword();
    } else {
      new_pass_fail();
    }
  };

  function new_pass_fail() {
    dispatch({
      type: ADD_MODAL,
      payload: {
        showModal: true,
        message: "Las contraseñas no coinciden.",
      },
    });
  }

  return (
    <Layout>
      <Helmet>
        <title>Name | Confirm New Password </title>
      </Helmet>
      <section
        className="flex column a-center j-center four-bg base-color"
        id="login"
      >
        <div className="flex column third-bg padding-l border-radius-xs gap-s">
          <h3>Enter your new password</h3>
          <form
            className="flex column gap-m"
            onSubmit={(e) => {
              onSubmit(e);
            }}
            action="#"
            encType="multipart/form-data"
          >
            <div className="flex column gap-xxs box-xxl">
              <h2>New password</h2>
              <input
                onChange={(e) => {
                  onChange(e);
                }}
                className="input-large"
                type="password"
                id="new_password"
                name="new_password"
                value={new_password}
                autoComplete="current-password"
                placeholder="New password"
                required
              />
            </div>
            <div className="flex column gap-xxs box-xxl">
              <h2>Repeat new password</h2>
              <input
                onChange={(e) => {
                  onChange(e);
                }}
                className="input-large"
                type="password"
                id="re_new_password"
                name="re_new_password"
                value={re_new_password}
                autoComplete="current-password"
                placeholder="Repeat new password"
                required
              />
            </div>
            <button type="submit" className="btn-small">
              <h2>Send</h2>
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {
  reset_password_confirm,
})(ResetPasswordConfirm);
