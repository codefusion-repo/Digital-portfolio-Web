import {
    REMOVE_MODAL,
    ADD_MODAL,
    ADD_DELETE_POST_MODAL,
    ADD_MSJ_MODAL
} from '../actions/modal/types'

const initialState = {
    showModal: false,
    message: null,
    slug: null,
    element: null,
}

export default function alert(state = initialState, action){
    const { type, payload } = action;

    switch(type){
        case ADD_MODAL:
            return {
                ...state,
                showModal: payload.showModal,
                message: payload.message,
                slug: null,
                element: null
            }
        case ADD_DELETE_POST_MODAL:
            return {
                ...state,
                showModal: payload.showModal,
                message: payload.message,
                slug: payload.slug,
                element: payload.element
            }
        case ADD_MSJ_MODAL:
            return {
                ...state,
                showModal: payload.showModal,
                message: payload.message,
                slug: null,
                element: null
            }
        case REMOVE_MODAL:
            return {
                ...state,
                showModal: false,
                message: null,
                slug: null,
                element: null
            }

        default:
            return state
    }
}