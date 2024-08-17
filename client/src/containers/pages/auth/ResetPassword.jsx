import Layout from "hocs/layouts/Layout";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { reset_password } from "redux/actions/auth/auth";
import { Helmet } from "react-helmet-async";
import {
  GET_RESET_PASSWORD_FAIL,
  GET_RESET_PASSWORD_SUCCESS,
  REMOVE_AUTH_LOADING,
  SET_AUTH_LOADING,
} from "redux/actions/auth/types";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
import axios from "axios";

function ResetPassword({ reset_password }) {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    const sendResetPassword = async () => {
      dispatch({
        type: SET_AUTH_LOADING,
      });

      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const formData = new FormData();
      formData.append("email", email);

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/send_reset_email`,
          formData,
          config
        );

        if (res.status === 200) {
          dispatch({
            type: GET_RESET_PASSWORD_SUCCESS,
          });

          dispatch({
            type: ADD_MSJ_MODAL,
            payload: {
              showModal: true,
              message: "Correo de recuperación enviado.",
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
            type: ADD_MSJ_MODAL,
            payload: {
              showModal: true,
              message:
                "El correo electrónico proporcionado no existe en nuestra base de datos.",
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
          type: ADD_MSJ_MODAL,
          payload: {
            showModal: true,
            message:
              "El correo electrónico proporcionado no existe en nuestra base de datos.",
          },
        });

        dispatch({
          type: REMOVE_AUTH_LOADING,
        });
      }
    };
    sendResetPassword();
  };

  return (
    <Layout>
      <Helmet>
        <title>Name | Forgot Password </title>
      </Helmet>
      <section
        className="flex column a-center j-center four-bg base-color"
        id="login"
      >
        <div className="flex column third-bg padding-l border-radius-xs gap-s">
          <h3>
            Enter your email address, if it is associated with a user, we will
            send a recovery email.
          </h3>
          <form
            className="flex column gap-m"
            onSubmit={(e) => {
              onSubmit(e);
            }}
            method="POST"
            action="#"
            encType="multipart/form-data"
          >
            <div className="flex column gap-xxs box-xxl">
              <h2 className="second-color">Email</h2>
              <input
                onChange={(e) => {
                  onChange(e);
                }}
                className="input-large"
                type="text"
                id="email"
                name="email"
                value={email}
                placeholder="Email"
                required
              />
            </div>

            <Link className="btn-small" to="/login">
              <h4>Back to login</h4>
            </Link>
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
  reset_password,
})(ResetPassword);
