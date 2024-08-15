import { combineReducers } from 'redux';
import categories from './categories';
import blog from './blog';
import auth from './auth';
import modal from './modal';
import portfolio from './portfolio';

export default combineReducers({
    categories,
    blog,
    auth,
    modal,
    portfolio
})