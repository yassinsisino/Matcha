import { createStore, applyMiddleware, compose }  from 'redux';
import thunk from 'redux-thunk';
import auth from './reducers/auth';

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // DEV TOOLS

const store = createStore(
  auth,
  composeEnchancers(applyMiddleware(thunk))
);

export default store;