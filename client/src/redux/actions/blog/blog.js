import axios from 'axios';
import {
    GET_BLOG_SUCCESS,
    GET_BLOG_FAIL,
    GET_BLOG_LIST_SUCCESS,
    GET_BLOG_LIST_FAIL,
    GET_BLOG_LIST_BY_CATEGORIES_SUCCESS,
    GET_BLOG_LIST_BY_CATEGORIES_FAIL,
    GET_SEARCH_BLOG_SUCCESS,
    GET_SEARCH_BLOG_FAIL,
    GET_AUTHOR_BLOG_SUCCESS,
    GET_AUTHOR_BLOG_FAIL,
} from './types'

export const get_blog_list = () => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/list`, config)
        if (res.status === 200){
            dispatch ({
                type: GET_BLOG_LIST_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_BLOG_LIST_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_BLOG_LIST_FAIL
        });
    }
}

export const get_blog_list_page = (p) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/list?p=${p}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_BLOG_LIST_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_BLOG_LIST_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_BLOG_LIST_FAIL
        });
    }
}

export const get_blog_list_by_category = (slug) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/by_category?slug=${slug}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_BLOG_LIST_BY_CATEGORIES_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_BLOG_LIST_BY_CATEGORIES_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_BLOG_LIST_BY_CATEGORIES_FAIL
        });
    }
}

export const get_blog_list_by_category_page = (slug, currentPage) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/by_category?slug=${slug}&p=${currentPage}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_BLOG_LIST_BY_CATEGORIES_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_BLOG_LIST_BY_CATEGORIES_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_BLOG_LIST_BY_CATEGORIES_FAIL
        });
    }
}

export const get_blog = (slug) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/detail/${slug}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_BLOG_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_BLOG_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_BLOG_FAIL
        });
    }
}

export const get_search_blog = (term) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/search?s=${term}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_SEARCH_BLOG_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_SEARCH_BLOG_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_SEARCH_BLOG_FAIL
        });
    }
}

export const get_search_blog_page = (term, p) => async dispatch =>{
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/search?s=${term}&p=${p}`, config)

        if (res.status === 200){
            dispatch ({
                type: GET_SEARCH_BLOG_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_SEARCH_BLOG_FAIL
            });
        }

    }catch(err){
        dispatch({
            type: GET_SEARCH_BLOG_FAIL
        });
    }
}

export const get_author_blog_list = () => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/author_posts`, config);
        if (res.status === 200){
            dispatch({
                type: GET_AUTHOR_BLOG_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_AUTHOR_BLOG_FAIL,
            });
        }
    } catch(err){
        dispatch({
            type: GET_AUTHOR_BLOG_FAIL,
        });
    }
};

export const get_author_blog_list_page = (p) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/author_posts?p=${p}`, config);
        if (res.status === 200){
            dispatch({
                type: GET_AUTHOR_BLOG_SUCCESS,
                payload: res.data
            });
        }else{
            dispatch({
                type: GET_AUTHOR_BLOG_FAIL,
            });
        }
    } catch(err){
        dispatch({
            type: GET_AUTHOR_BLOG_FAIL,
        });
    }
};