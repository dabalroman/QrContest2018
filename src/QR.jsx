import React, {Component} from 'react';
import axios from 'axios/dist/axios.js';
import {getAPIDataUrl} from "./utils.js";

class QR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrData: 0,
            exists: 0,
            alreadyCollected: 0,
            question: 0,
            answer: null
        };

        this.handleAnswerA = this.handleAnswerA.bind(this);
        this.handleAnswerB = this.handleAnswerB.bind(this);
        this.handleAnswerC = this.handleAnswerC.bind(this);
        this.handleAnswerD = this.handleAnswerD.bind(this);
    }

    collectQRCode(user, data) {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "collectQRCode",
                data: {
                    user: user,
                    qr: data
                }
            }
        })
            .then(function (response) {
                if (response.data.result === 2)
                    that.setState({alreadyCollected: 1});
            })
            .catch(function (error) {
                console.log(error);
            });

        return 0;
    }

    getQRCodeData(data) {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getQRCodeData",
                data: data
            }
        })
            .then(function (response) {
                if (response.hasOwnProperty("data") && response.data.hasOwnProperty("result")) {
                    that.setState({
                        qrData: response.data.result,
                        exists: response.data.result.hasOwnProperty("ID")
                    });

                    if (that.state.exists) {
                        that.collectQRCode(that.props.user, that.props.qr);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        return 0;
    }

    componentWillMount() {
        if (this.props.user && this.props.qr) {
            this.getQRCodeData(this.props.qr);
        }
    }

    collectQuestion(answer) {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "collectQuestion",
                data: {
                    question: that.state.question.ID,
                    user: this.props.user,
                    answer: answer
                }
            }
        })
            .then(function (response) {
                // if (response.hasOwnProperty("data") && response.data.hasOwnProperty("result")) {
                //     console.log(response);
                // }
            })
            .catch(function (error) {
                console.log(error);
            });

        return 0;
    }

    handleAnswerA() {
        this.handleAnswer(0);
    }

    handleAnswerB() {
        this.handleAnswer(1);
    }

    handleAnswerC() {
        this.handleAnswer(2);
    }

    handleAnswerD() {
        this.handleAnswer(3);
    }

    handleAnswer(answer) {
        console.log(answer, this.state.question.correctAnswer);
        this.collectQuestion(answer);
        this.setState({
            answer: (answer === parseInt(this.state.question.correctAnswer, 10))
        })
    }

    getQuestion() {
        let that = this;

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getQuestion",
                data: null
            }
        })
            .then(function (response) {
                if (response.hasOwnProperty("data") && response.data.hasOwnProperty("result")) {
                    console.log(response.data.result);
                    that.setState({
                        question: response.data.result
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        return 0;
    }

    qrQuestion() {
        if (this.state.question === 0) {
            this.getQuestion();
        } else if (this.state.answer === true) {
            return (
                <div className="quiz">
                    <h2 className="card-title">Pytanie dodatkowe</h2>
                    <div className="quiz-points">Do zdobycia jest <span className="highlight">{this.state.question.points} pkt</span></div>
                    <div className="quiz-question">
                        {this.state.question.question}
                    </div>
                    <div className="answer">
                        Brawo! Ta odpowiedź jest <span className="highlight">poprawna</span>.
                    </div>
                </div>
            );
        } else if (this.state.answer === false) {
            return (
                <div className="quiz">
                    <h2 className="card-title">Pytanie dodatkowe</h2>
                    <div className="quiz-points">Do zdobycia jest <span className="highlight">{this.state.question.points} pkt</span></div>
                    <div className="quiz-question">
                        {this.state.question.question}
                    </div>
                    <div className="answer">
                        Niestety, ta odpowiedź jest <span className="highlight">błędna</span>. Poprawna odpowiedź to "<span className="highlight">{this.state.question.answers[this.state.question.correctAnswer]}</span>"
                    </div>
                </div>
            );
        } else {
            return (
                <div className="quiz">
                    <h2 className="card-title">Pytanie dodatkowe</h2>
                    <div className="quiz-points">Do zdobycia jest <span className="highlight">{this.state.question.points} pkt</span></div>
                    <div className="quiz-question">
                        {this.state.question.question}
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="quiz-answer quiz-answer-a" onClick={this.handleAnswerA}>
                                {this.state.question.answers[0]}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="quiz-answer quiz-answer-b" onClick={this.handleAnswerB}>
                                {this.state.question.answers[1]}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="quiz-answer quiz-answer-c" onClick={this.handleAnswerC}>
                                {this.state.question.answers[2]}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="quiz-answer quiz-answer-d" onClick={this.handleAnswerD}>
                                {this.state.question.answers[3]}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }


    qrExists() {
        return (
            <div>
                <div className="congratulations">Gratulacje, udało Ci się znaleźć kod!</div>
                <div className="name">{(this.state.qrData) ? this.state.qrData.name : "Loading..."}</div>
                <div className="value highlight">{(this.state.qrData) ? this.state.qrData.value : "Loading..."} pkt</div>
                {(this.state.qrData && this.state.qrData.type === "1") ?
                    this.qrQuestion() :
                    (
                        (this.state.qrData && this.state.qrData.description !== "") ?
                            <div className="description">{this.state.qrData.description}</div> :
                            null
                    )
                }
                <div className="text-right">
                    <button className="btn btn-raised btn-primary" onClick={this.props.onConfirm}>Potwierdź <i className="icon-ok"/></button>
                </div>
            </div>
        )
    }

    qrNotExists() {
        return (
            <div>
                <p>Niestety, taki kod nie istnieje.</p>
                <div className="text-right">
                    <button className="btn btn-raised btn-primary" onClick={this.props.onConfirm}>Potwierdź <i className="icon-ok"/></button>
                </div>
            </div>
        )
    }

    qrAlreadyCollected() {
        return (
            <div>
                <p>Ten kod został już zebrany!</p>
                <div className="text-right">
                    <button className="btn btn-raised btn-primary" onClick={this.props.onConfirm}>Potwierdź <i className="icon-ok"/></button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="qr">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Kod QR</h2>
                            <div className="qr-data">
                                {(this.state.exists) ?
                                    (
                                        (this.state.alreadyCollected) ?
                                            this.qrAlreadyCollected() :
                                            this.qrExists()
                                    ) :
                                    this.qrNotExists()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QR;