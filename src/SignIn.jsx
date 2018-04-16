import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {FormDataToJSON, getAPIDataUrl} from "./utils.js";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = FormDataToJSON(new FormData(event.target));
        document.getElementById("signIn").reset();
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "signIn",
                data: data
            }
        })
            .then(function (response) {
                if (response.hasOwnProperty("data") && response.data.hasOwnProperty("result")) {
                    if (response.data.result === 1)
                        alert("Błędny login / hasło. Spróbuj ponownie.");
                    that.props.onSignIn(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="login">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Zaloguj się</h2>
                            <form onSubmit={this.handleSubmit} id="signIn">
                                <input type="text" className="form-control input-lg" placeholder="Login" name="login" autoComplete="username" required/>
                                <input type="password" className="form-control input-lg" placeholder="Hasło" name="password" autoComplete="new-password" required/>
                                <div className="btn-right">
                                    <button type="submit" className="btn btn-raised btn-primary">Zaloguj <i className="icon-right-open"/></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;