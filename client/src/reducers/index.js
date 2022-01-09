import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';
import message from './message';
const reducers = combineReducers({ posts, auth,message });
export default reducers;
