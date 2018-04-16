import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {FormDataToJSON, getAPIDataUrl} from "./utils.js";

class SignUp extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = FormDataToJSON(new FormData(event.target));
        document.getElementById("signUp").reset();

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "signUp",
                data: data
            }
        })
            .then(function (response) {
                if(response.data.result === 0)
                    alert("Zarejestrowano pomyślnie. Możesz teraz zalogować się na swoje konto.");
                else
                    alert("Błąd rejestracji. Odświerz stronę i spróbuj ponownie.");

                // console.log(response.data);
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
                            <form onSubmit={this.handleSubmit} id="signUp">
                                <h2 className="card-title">Zarejestruj się</h2>
                                <input type="text" className="form-control input-lg" placeholder="Login" name="login" autoComplete="username" required />
                                <input type="text" className="form-control input-lg" placeholder="Imię" name="name" autoComplete="name" required />
                                <input type="password" className="form-control input-lg" placeholder="Hasło" name="password" autoComplete="new-password" required />
                                <select className="custom-select input-lg-b" defaultValue="null" name="class" required >
                                    <option disabled value="null">Klasa</option>
                                    <option value="1 TI">I TI</option>
                                    <option value="2 TI">II TI</option>
                                    <option value="3 TI">III TI</option>
                                    <option value="4 TI">IV TI</option>
                                    <option value="1 aTE">I aTE</option>
                                    <option value="2 aTE">II aTE</option>
                                    <option value="3 aTE">III aTE</option>
                                    <option value="4 aTE">IV aTE</option>
                                    <option value="1 bTE">I bTE</option>
                                    <option value="2 bTE">II bTE</option>
                                    <option value="3 bTE">III bTE</option>
                                    <option value="4 bTE">IV bTE</option>
                                    <option value="1 aTL">I aTL</option>
                                    <option value="2 aTL">II aTL</option>
                                    <option value="3 aTL">III aTL</option>
                                    <option value="4 aTL">IV aTL</option>
                                    <option value="1 bTL">I bTL</option>
                                    <option value="2 bTL">II bTL</option>
                                    <option value="3 bTL">III bTL</option>
                                    <option value="4 bTL">IV bTL</option>
                                    <option value="1 TOR">I TOR</option>
                                    <option value="2 TOR">II TOR</option>
                                    <option value="3 TOR">III TOR</option>
                                    <option value="4 TOR">IV TOR</option>
                                    <option value="1 TH">I TH</option>
                                    <option value="2 TH">II TH</option>
                                    <option value="3 TH">III TH</option>
                                    <option value="4 TH">IV TH</option>
                                    <option value="Inne">Inne</option>
                                </select>
                                <p className="text-center">Rejestracja oraz udział w konkursie równoznaczny jest z akceptacją regulaminu konkursu. Regulamin jest dostępny <a href="https://docs.google.com/document/d/1ESQNgtGWhW8gih0sXi_5HGu8ro9_gvF0IobPM4mQatY/edit?usp=sharing">tutaj</a>.</p>
                                <div className="btn-right">
                                    <button className="btn btn-raised btn-primary">Zarejestruj <i className="icon-plus"/></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;