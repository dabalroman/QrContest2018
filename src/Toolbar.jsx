import React, {Component} from 'react';

class Toolbar extends Component {
    render() {
        return (
            <div className="toolbar">
                <div className="container">
                    <div className="row">
                        <div className="col-sm logo"><span className="highlight">QR</span>CONTEST</div>
                        <div className="col-sm login"><span className="highlight">{this.props.login}</span></div>
                        <div className="col-sm points"><span className="highlight">{this.props.points}</span> pkt</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Toolbar;