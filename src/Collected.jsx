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
                <td>{props.name}</td>
                <td>{props.value}</td>
            </tr>
        );
    }

    componentWillMount() {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getCollected",
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
                            <h2 className="card-title">Zebrane kody</h2>
                            <div className="overflow">
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <th>#</th>
                                        <th>Data</th>
                                        <th>Nazwa</th>
                                        <th>Ilość punktów</th>
                                    </tr>
                                    {
                                        (this.state.data !== null) ?
                                            (
                                                this.state.data.map((row) =>
                                                    <this.TableRow id={++i} key={i} name={row.name} value={row.value} time={row.time}/>
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