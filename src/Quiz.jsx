import React, {Component} from 'react';

class Quiz extends Component {
    render() {
        return (
            <div className="container">
                <div className="quiz">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Pytanie</h2>
                            <div className="quiz-points">Do zdobycia jest <span className="highlight">{this.props.question.value} pkt</span></div>
                            <div className="quiz-question">
                                {this.props.question.question}
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="quiz-answer quiz-answer-a">
                                        {this.props.question.answer.a}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="quiz-answer quiz-answer-b">
                                        {this.props.question.answer.b}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="quiz-answer quiz-answer-c">
                                        {this.props.question.answer.c}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="quiz-answer quiz-answer-d">
                                        {this.props.question.answer.d}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Quiz;