import React, {Component} from 'react';
import {FormDataToJSON} from "./utils.js";

class ScanQR extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = FormDataToJSON(new FormData(event.target));
        this.props.onQRInput(data.qr);
    }

    render() {
        return (
            <div className="container">
                <div className="scan-qr">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Zeskanuj kod QR</h2>
                            <p>Aby zeskanować kod QR <span className="highlight">uruchom aplikacje</span> do skanowania kodów QR na swoim urządzeniu. <span className="highlight">Zeskanuj kod</span>, a on automatycznie zostanie dodany do Twojego konta.</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Wpisz kod QR</h2>
                            <p>Nie możesz zeskanować kodu? <span className="highlight">Nie ma problemu</span>, wpisz jego kod poniżej.</p>

                            <form onSubmit={this.handleSubmit}>
                                <input type="text" className="form-control input-lg" placeholder="Kod QR" name="qr" required/>
                                <div className="btn-right">
                                    <button type="submit" className="btn btn-raised btn-primary">Potwierdź <i className="icon-ok"/></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScanQR;