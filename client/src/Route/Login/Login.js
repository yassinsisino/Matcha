import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../../store/actions/auth';

class Login extends Component {
    state = {
        email: 'test@test.com',
        password: '123456'
    }

    submit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        this.props.loginStart(email, password);
    }

    render() {
        const { loading } = this.props;

        return (
            <div>
                <form>
                    <label htmlFor ="mail">Mail :</label>
                    <input type="mail" id="mail" placeholder="Mail" />
                    <br></br>

                    <label htmlFor ="mot_de_passe">Mot de passe :</label>
                    <input type="password" id="mot_de_passe" placeholder="Mot de Passe" />
                    <br></br>

                    <button type="submit" onClick={this.submit}> Login </button>
                </form>
                {loading ? 'Chargement' : 'Terminer'}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        loading: state.loading
    })
}

const mapDispatchToProps = (dispatch) => { // acceder au fonction du store
    return ({
        loginStart: (email, password) => dispatch(auth(email, password)), 
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
