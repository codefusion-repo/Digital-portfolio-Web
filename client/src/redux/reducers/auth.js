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
} from '../actions/auth/types'

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: false,
    user: null,
    loading: false,
    user_loading: true,
}

export default function auth(state = initialState, action){
    const { type, payload } = action;
    switch(type) {
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                user_loading: false
            }

        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null,
                user_loading: false
            }
        case SET_AUTH_LOADING:
            return {
                state,
                loading: true
            }
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case AUTHENTICATED_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                isAuthenticated: false,
                access: null,
                refresh: null
            }
        case GET_LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: localStorage.getItem('access'),
                refresh: localStorage.getItem('refresh'),
            }
        case GET_RESET_PASSWORD_SUCCESS:
        case GET_RESET_PASSWORD_FAIL:
        case GET_RESET_PASSWORD_CONFIRM_SUCCESS:
        case GET_RESET_PASSWORD_CONFIRM_FAIL:
            return{
                ...state
            }

        case REFRESH_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state,
                access: localStorage.getItem('access'),
            }
        
        case GET_LOGIN_FAIL:
        case REFRESH_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        default:
            return state
    }
}