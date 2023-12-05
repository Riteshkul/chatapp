import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';

import chatReducer from '../reducers';

const store = createStore(
  chatReducer,
  applyMiddleware(thunk)
);

export default store;