import React from 'react';
import ReactDOM from 'react-dom';
import App from './Route/Register/Register';
import Login from './Route/Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';


ReactDOM.render(
    <BrowserRouter>
        <Route exact path="/" component={App}/>
        <Route path="/login" component={Login}/>
    </BrowserRouter>,
    document.getElementById('root'));