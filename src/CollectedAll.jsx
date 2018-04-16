import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {getAPIDataUrl} from "./utils.js";

class Collected extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
    }

    TableRow(props) {
        return (
            <tr>
                <td>{props.id}</td>
                <td>{props.time}</td>
                <td>{props.login}</td>
                <td>{props.name}</td>
                <td>{props.class}</td>
                <td>{(props.qr) ? props.qr : props.question}</td>
                <td className="text-center">
                    {(props.qr) ?
                        props.value :
                        (
                            (props.value !== 0) ?
                                <span><i className="icon-ok color-green"/><br/>{props.value}</span> :
                                <span><i className="icon-cancel color-red"/><br/>{props.value}</span>
                        )

                    }</td>
            </tr>
        );
    }

    componentWillMount() {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getAllCollected",
                data: null
            }
        })
            .then(function (response) {
                if (response.hasOwnProperty("data") && response.data.hasOwnProperty("result"))
                    that.setState({data: response.data.result});
                // console.log(that.state.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let i = 0;
        return (
            <div className="container">
                <div className="ranking">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Log</h2>
                            <div className="overflow">
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <th>#</th>
                                        <th>Data</th>
                                        <th>Login</th>
                                        <th>Imię</th>
                                        <th>Klasa</th>
                                        <th>QR / Pytanie</th>
                                        <th>Pkt</th>
                                    </tr>
                                    {
                                        (this.state.data !== null) ?
                                            (
                                                this.state.data.map((row) =>
                                                    <this.TableRow
                                                        id={++i}
                                                        key={i}
                                                        qr={(row.qr) ? row.qr : null}
                                                        question={(row.question) ? row.question : null}
                                                        login={row.login}
                                                        class={row.class}
                                                        name={row.name}
                                                        value={row.value}
                                                        time={row.time}/>
                                                )
                                            ) :
                                            null
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Collected;