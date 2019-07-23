import React, { Component } from 'react';
import './Register.css';

class App extends Component {
    state = {
        nom: null,
        prenom: null,
        mail: null,
        login: null,
        mot_de_passe: null,
        errors: {},
        disable: true,
        errorBack: null
    };

    checkRegex = (id, value) => {
        let regex = null;
        let errors = null;

        if (id === 'nom') {
            regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
            if (!regex.test(value))
                errors = '* Nom incorect';
        }
        else if (id === 'prenom'){
            regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
            if (!regex.test(value))
                errors = '* Prenom incorect';
        }   
        else if (id === 'mail') {
            regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            if (!regex.test(value))
                errors = '* Adresse Mail incorect';
        }
        else if (id === 'login') {
            regex= /^[A-Z][A-Z0-9]*(?:[-_][A-Z0-9]+)*$/i;
            if (!regex.test(value))
                errors = '* Login incorect';
        }
        else if (id === 'mot_de_passe') {
            regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
            if (!regex.test(value))
                errors = '* Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
        }
        return errors;
    }

    checkInput = (id, value, min, max) => {
        let error = null;

        if (value.length < min)
            error = `${min} characters min.`;
        else if (value.length > max)
            error = `${max} characters max.`;
        else {
            error = this.checkRegex(id, value);
        }

        return error;
    }

    checkForm () {
        let { errors } = this.state;
        let valid = true;

        this.setState({ disable: true });

        for(let field in errors) { // object[property];
            if (errors[field] !== null) valid = false;
        }

        if (valid && Object.keys(errors).length === 5) this.setState({ disable: false });
    }

    change = (e, min, max) => {
        const { id, value } = e.target;
        const { errors } = this.state;
 
        let error = null;

        this.setState({ [id]: value }, () => {
            error = this.checkInput(id, value, min, max);
            errors[id] = error;
            this.setState({ errors }, () => {
                this.checkForm();
            });
        });
    };

    submit = (e) => {
        e.preventDefault();
        const { disable } = this.state;
    
        if (!disable) {
            // axios
            // post('', { nom, prenom .... })
            // .then()  Redirection
            // .catch(err => {  this.setState({ errorBack:  err.response.data.error })  })
        }
    }

    render() {
        const {errors, disable, errorBack } = this.state;
        return (
            <div className="body">
                <h1>Matcha</h1>
                <h3>Inscription</h3>
                <form onSubmit ={this.submit}>
                    <label htmlFor ="nom">Nom :</label>
                    <input type="text" id="nom" placeholder="Nom" onChange={(e) => this.change(e, 2, 20)} />
                    <div>{errors.nom}</div>
                    <br></br>

                    <label htmlFor ="prenom">Prenom :</label>
                    <input type="text" id="prenom" placeholder="Prenom"  onChange={(e) => this.change(e, 2, 20)} />
                    <div>{errors.prenom}</div>
                    <br></br>

                    <label htmlFor ="mail">Mail :</label>
                    <input type="mail" id="mail" placeholder="Mail" onChange={(e) => this.change(e, null, 40)} />
                    <div>{errors.mail}</div>
                    <br></br>

                    <label htmlFor ="login">Login :</label>
                    <input type="text" id="login" placeholder="Login" onChange={(e) => this.change(e, 6, 15)} />
                    <div>{errors.login}</div>
                    <br></br>

                    <label htmlFor ="mot_de_passe">Mot de passe :</label>
                    <input type="password" id="mot_de_passe" placeholder="Mot de Passe" onChange={(e) => this.change(e, 6, 15)} />
                    <div>{errors.mot_de_passe}</div>
                    <br></br>

                    <button disabled={disable}>Envoyez</button>
                    <div>{errorBack}</div>

                </form>
            </div>
        )
    }
}

export default App;