import React, {Component} from 'react';
import SignOut from './SignOut';

class Toolbar extends Component {
    render() {
        return (
            <div className="footer">
                <div className="container">
                    {
                        (!this.props.noSignOut) ?
                        <SignOut onSignOut={this.props.onSignOut}/> :
                        null
                    }
                    <p className="QR"><span className="highlight">QR</span>CONTEST</p>
                    <p>IT DAY 2018 - ZSEO Gniezno</p>
                    <p>Roman Dąbal</p>
                    <p>Specjalne podziękowania dla:
                        <br/>
                        Basia Hanusko,
                        Ramzes Łagiewski,
                        Adrian Rosiński,
                        Krystian Bielaś,
                        Krystian Banaszak,
                        Dawid Borzykowski,
                        Marcin Meller
                    </p>
                </div>
            </div>
        );
    }
}

export default Toolbar;