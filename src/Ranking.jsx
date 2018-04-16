import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {getAPIDataUrl} from "./utils.js";

class Ranking extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
    }

    TableRow(props) {
        return (
            <tr className={(props.login === props.name) ? "highlight" : null}>
                <td>{props.id}</td>
                <td>{props.name}</td>
                <td>{props.class}</td>
                <td>{props.points}</td>
            </tr>
        );
    }

    componentWillMount() {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getRanking",
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
                            <h2 className="card-title">Ranking</h2>
                            <div className="overflow">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>#</th>
                                    <th>Nick</th>
                                    <th>Klasa</th>
                                    <th>Ilość punktów</th>
                                </tr>
                                {
                                    (this.state.data !== null) ?
                                        (
                                            this.state.data.map((row) =>
                                                <this.TableRow id={++i} key={i} name={row.login} class={row.class} points={row.points} login={(this.props.login) ? this.props.login : null}/>
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

export default Ranking;