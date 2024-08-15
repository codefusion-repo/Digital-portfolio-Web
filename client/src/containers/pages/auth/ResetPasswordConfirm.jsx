import Layout from "hocs/layouts/Layout"
import { useNavigate, useParams } from 'react-router-dom';

import { useState } from 'react';
import { connect, useDispatch } from "react-redux";
import { reset_password_confirm } from "redux/actions/auth/auth";
import { Helmet } from "react-helmet-async";
import { ADD_MODAL, ADD_MSJ_MODAL } from "redux/actions/modal/types";
import axios from "axios";
import { GET_RESET_PASSWORD_CONFIRM_FAIL, GET_RESET_PASSWORD_CONFIRM_SUCCESS, REMOVE_AUTH_LOADING } from "redux/actions/auth/types";

function ResetPasswordConfirm({
    reset_password_confirm
}) {

    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const {
        new_password,
        re_new_password
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const uid = params.uid;
    const token = params.token;

    const onSubmit = e => {
        e.preventDefault();

        if(new_password === re_new_password){
            const fetchNewPassword = async()=>{

                const formData = new FormData()
                formData.append('uid', uid)
                formData.append('token', token)
                formData.append('new_password', new_password)
                formData.append('re_new_password', re_new_password)

                const config = {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                };

                try{
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/reset_password_confirm/`, formData, config);

                    if (res.status === 200) {
                        dispatch({
                            type: GET_RESET_PASSWORD_CONFIRM_SUCCESS
                        });
                        dispatch({
                            type: REMOVE_AUTH_LOADING
                        });
                        dispatch({
                            type: ADD_MSJ_MODAL,
                            payload: {
                                showModal: true,
                                message: 'Contraseña cambiada.'
                            }
                        });
        
                    }else{
                        dispatch({
                            type: GET_RESET_PASSWORD_CONFIRM_FAIL
                        });
                        dispatch({
                            type: REMOVE_AUTH_LOADING
                        });
                        dispatch({
                            type: ADD_MSJ_MODAL,
                            payload: {
                                showModal: true,
                                message: 'La contraseña debe tener al menos 8 caracteres. Debe incluir letras y números.'
                            }
                        });
                    }

                }catch(err){
                    dispatch({
                        type: GET_RESET_PASSWORD_CONFIRM_FAIL
                    });
                    dispatch({
                        type: REMOVE_AUTH_LOADING
                    });
                    dispatch({
                        type: ADD_MSJ_MODAL,
                        payload: {
                            showModal: true,
                            message: 'La contraseña debe tener al menos 8 caracteres. Debe incluir letras y números.'
                        }
                    });
                }
            }

            fetchNewPassword();
        }else{
            new_pass_fail();
        }

    };

    function new_pass_fail(){
        dispatch({
            type: ADD_MODAL,
            payload: {
                showAlert: true,
                message: 'Las contraseñas no coinciden.'
            }
        });
    };

    return (
        <Layout>
        <Helmet>
            <title>Firu Dev | Confirm New Password </title>
        </Helmet>
    <section className="login" id="login">
            
        <div className="login-box">

            <h3>Ingresa tu nueva contraseña.</h3>
            <form onSubmit={e=>{onSubmit(e)}} action="#" encType="multipart/form-data">

                <h2>Nueva contraseña</h2>
                <input onChange={e=>{onChange(e)}} type="password" id="new_password" name="new_password" value={new_password} autoComplete="current-password" placeholder="Nueva contraseña" required />
                <h2>Reescribir nueva contraseña</h2>
                <input onChange={e=>{onChange(e)}} type="password" id="re_new_password" name="re_new_password" value={re_new_password} autoComplete="current-password" placeholder="Reescribir nueva contraseña" required />
                <button type="submit" className="btn">Enviar</button>

            </form>

            </div>

    </section>
    </Layout>
    )
}

const mapStateToProps=state=>({

})
export default connect(mapStateToProps, {
    reset_password_confirm
}) (ResetPasswordConfirm)