import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {FormDataToJSON, getAPIDataUrl} from "./utils.js";

class CreateQR extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = FormDataToJSON(new FormData(event.target));
        document.getElementById("createQR").reset();

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "createQR",
                data: data
            }
        })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="createQR">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit} id="createQR">
                                <h2 className="card-title">Utwórz QR</h2>
                                <input type="text" className="form-control input-lg" placeholder="Nazwa" name="name" required />
                                <input type="text" className="form-control input-lg" placeholder="Wartość" name="value" required />
                                <input type="text" className="form-control input-lg" placeholder="Opis" name="description"/>
                                <select className="custom-select input-lg-b" defaultValue="1" name="active" required>
                                    <option value="1">Aktywny</option>
                                    <option value="0">Nieaktywny</option>
                                </select>
                                <select className="custom-select input-lg-b" defaultValue="0" name="type" required>
                                    <option value="0">Normalny</option>
                                    <option value="1">Pytanie</option>
                                </select>
                                <div className="btn-right">
                                    <button className="btn btn-raised btn-primary">Utwórz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateQR;