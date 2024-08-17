import {
    GET_AUTHOR_PORTFOLIO_LIST_FAIL,
    GET_AUTHOR_PORTFOLIO_LIST_SUCCESS,
    GET_PORTFOLIO_LIST_FAIL,
    GET_PORTFOLIO_LIST_SUCCESS,
    GET_PROJECT_FAIL,
    GET_PROJECT_SUCCESS
} from '../actions/portfolio/types'

const initialState = {
    portfolio_list: null,
    author_projects: null,
    project: null,
    count: null,
    next: null,
    previous: null,
};

export default function blog(state = initialState, action) {
    const { type, payload } = action;

    switch(type){
        case GET_PORTFOLIO_LIST_FAIL:
            return {
                ...state,
                portfolio_list: null,
                count: null,
                next: null,
                previous: null,
            }
        case GET_PORTFOLIO_LIST_SUCCESS:
            return {
                ...state,
                portfolio_list: payload.projects,
            }

        case GET_PROJECT_SUCCESS:
            return{
                ...state,
                project: payload.project
            }
        case GET_PROJECT_FAIL:
            return{
                ...state,
                project: null
            }
        case GET_AUTHOR_PORTFOLIO_LIST_SUCCESS:
            return {
                ...state,
                author_projects: payload.author_projects,
                count: payload.count,
                next: payload.next,
                previous: payload.previous
            }
        case GET_AUTHOR_PORTFOLIO_LIST_FAIL:
            return {
                ...state,
                author_projects: null,
                count: null,
                next: null,
                previous: null
            }
        default:
            return state
    }
}
