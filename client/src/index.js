import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/create';
import Register from './Route/Register/Register';
import Login from './Route/Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route exact path="/" component={Register}/>
            <Route path="/login" component={Login}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));