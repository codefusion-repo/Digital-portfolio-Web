import Layout from "hocs/layouts/Layout"
import { Link, Navigate } from 'react-router-dom';

import { useState } from 'react';
import { connect, useDispatch } from "react-redux";
import { load_user, login } from "redux/actions/auth/auth";
import { Helmet } from "react-helmet-async";
import { ADD_MSJ_MODAL, REMOVE_MODAL } from "redux/actions/modal/types";
import { GET_LOGIN_FAIL, GET_LOGIN_SUCCESS, REMOVE_AUTH_LOADING, SET_AUTH_LOADING } from "redux/actions/auth/types";
import axios from "axios";

function Login({
    login,
    isAuthenticated,
    loading
}) {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const {
        username,
        password
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const dispatch = useDispatch();

    const onSubmit = e => {
        e.preventDefault();
        dispatch({
            type: ADD_MSJ_MODAL,
            payload: {
                showModal: true,
                message: 'Logging in.'
            }
        });

        const Login = async()=>{
            dispatch({
                type: SET_AUTH_LOADING
            });
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            };
        
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)
        
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, formData, config);
                if (res.status === 200) {
                    dispatch({
                        type: REMOVE_AUTH_LOADING
                    });
                    dispatch({
                        type: GET_LOGIN_SUCCESS,
                        payload: res.data
                    });
                    dispatch({
                        type: REMOVE_MODAL,
                    });
                    dispatch(load_user());
                }else{
                    dispatch({
                        type: GET_LOGIN_FAIL,
                    });
                    dispatch({
                        type: REMOVE_AUTH_LOADING
                    })
                    dispatch({
                        type: ADD_MSJ_MODAL,
                        payload: {
                            showModal: true,
                            message: 'Invalid email or password.'
                        }
                    });
                }
            }catch(err){
                dispatch({
                    type: GET_LOGIN_FAIL,
                });
                dispatch({
                    type: REMOVE_AUTH_LOADING
                })
                dispatch({
                    type: ADD_MSJ_MODAL,
                    payload: {
                        showModal: true,
                        message: 'Fail while logging in.'
                    }
                });
            }
        }
        Login();
    };

    if (!isAuthenticated) {
        // Redirigir al usuario a la página de inicio de sesión
    }else{
        return <Navigate to="/dashboard" />;
    };

    return (
        <Layout>
        <Helmet>
        <title>Firu Dev | Login </title>
        </Helmet>
    <section className="login" id="login">
            
        <div className="login-box">

            <h4>Example name, Log in!</h4>
            <form onSubmit={e=>{onSubmit(e)}} action="#" encType="multipart/form-data">

                <h1>Username</h1>
                <input onChange={e=>{onChange(e)}} type="text" id="username" name="username" value={username} placeholder="Username" required />
                <h1>Password</h1>
                <input onChange={e=>{onChange(e)}} type="password" id="password" name="password" value={password} placeholder="Password" required />

                <Link to="/reset_password"><h1>Forgot your password?</h1></Link>

                <button type="submit" className="btn">Log in</button>

            </form>

            </div>

    </section>
    </Layout>
    )
}

const mapStateToProps=state=>({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
})
export default connect(mapStateToProps, {
    login
}) (Login)