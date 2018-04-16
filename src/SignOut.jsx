import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {FormDataToJSON, getAPIDataUrl} from "./utils.js";

class SignOut extends Component {
    constructor(props) {
        super(props);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    handleSignOut(event) {
        event.preventDefault();
        const data = FormDataToJSON(new FormData(event.target));
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "signOut",
                data: data
            }
        })
            .then(function (response) {
                if(response.hasOwnProperty("data") && response.data.hasOwnProperty("result"))
                    that.props.onSignOut(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <button type="button" className="btn btn-raised btn-secondary" onClick={this.handleSignOut}>Wyloguj <i className="icon-lock"/></button>
        );
    }
}

export default SignOut;