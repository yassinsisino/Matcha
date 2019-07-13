import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        nom: null,
        prenom: null,
        mail: null,
        login: null,
        mot_de_passe: null,
        errors: {}
    };

    checkRegex = (id, value) => {
        let regex = null;
        let errors = null;

        if (id === 'nom') {
            regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
            regex.test(value);

        }
        else if (id === 'prenom'){
            regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
            if (!regex.test(value))
                errors = 'Prenom incorect';
        }     
        else if (id === 'mail') {
            regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            regex.test(value);
        }
        else if (id === 'login') {
            regex= /^[A-Z][A-Z0-9]*(?:[-_][A-Z0-9]+)*$/i;
            regex.test(value);
        }
        else if (id === 'mot_de_passe') {
            regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
            regex.test(value);
        }
        return errors;
    }

    checkInput = (id, value, min, max) => {
        let errors = null;

        if (value.trim() === '')
            errors = "Vide";
        else if (value.length < min)
            errors = `${min} characters min.`;
        else if (value.length > max)
            errors = `${max} characters max.`;
        else
            errors = this.checkRegex(id, value);
        return errors;
    }

    change = (e, min, max) => {
        const { id, value } = e.target;
        const { errors } = this.state;
 
        let error = null;

        this.setState({ [id]: value });
        error = this.checkInput(id, value, min, max);
        errors[id] = error;
        this.setState({ errors });
        console.log(errors);
    };

    submit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }

    render() {
        const {errors} = this.state; // destructuration.
        return (
            <div className="body">
                <h1>Matcha</h1>
                <h3>Inscription</h3>
                <form onSubmit ={this.submit}>
                    <label htmlFor ="nom">Nom :</label>
                    <input type="text" id="nom" placeholder="Nom" onChange={(e) => this.change(e, 2, 20)} />
                    {this.state.nom}
                    <div>{errors.nom}</div>
                    <br></br>

                    <label htmlFor ="prenom">Prenom :</label>
                    <input type="text" id="prenom" placeholder="Prenom" errors= {errors.prenom} onChange={(e) => this.change(e, 2, 20)} />
                    {this.state.prenom}
                    {errors.prenom}
                    <br></br>

                    <label htmlFor ="mail">Mail :</label>
                    <input type="mail" id="mail" placeholder="Mail" onChange={(e) => this.change(e, null, 40)} />
                    {this.state.mail}
                    {errors.mail}
                    <br></br>

                    <label htmlFor ="login">Login :</label>
                    <input type="text" id="login" placeholder="Login" onChange={(e) => this.change(e, 6, 15)} />
                    {this.state.login}
                    {errors.login}
                    <br></br>

                    <label htmlFor ="mot_de_passe">Mot de passe :</label>
                    <input type="password" id="mot_de_passe" placeholder="Mot de Passe" onChange={(e) => this.change(e, 6, 15)} />
                    {this.state.mot_de_passe}
                    {errors.mot_de_passe}
                    <br></br>
                    
                    <br></br>
                    <button>Envoyez</button>
                </form>
            </div>
        )
    }
}

export default App;