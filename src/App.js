import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import axios from 'axios/dist/axios.js';
import {getAPIDataUrl} from './utils.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import './App.css';

import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import ScanQR from './ScanQR.jsx';
import Ranking from './Ranking.jsx';
import Collected from './Collected.jsx';
import CollectedAll from './CollectedAll.jsx';
import Toolbar from "./Toolbar.jsx";
import Footer from "./Footer.jsx";
// import CreateQR from "./CreateQR";
import QR from "./QR.jsx";

class App extends Component {
    render() {
        return (
            <BrowserRouter basename="/qrcontest">
                <QRCONTEST/>
            </BrowserRouter>
        );
    }
}

class QRCONTEST extends Component {
    constructor() {
        super();
        this.state = {
            userLogged: false,
            userData: null,
            currentScreen: "",
            lastUrlQRData: null,
            qrContestOpen: true
        };

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleQRConfirm = this.handleQRConfirm.bind(this);
        this.handleQRInput = this.handleQRInput.bind(this);
        this.getActiveSession();
    }

    handleSignIn(signInData) {
        if (signInData.result.hasOwnProperty("ID")) {
            this.setState({
                userLogged: true,
                userData: signInData.result
            });
        }
        else
            console.log("ERROR", signInData);
    }

    handleSignOut(signOutData) {
        if (signOutData.result === 0) {
            this.setState({
                userLogged: false,
                userData: null
            });
        }
        else
            console.log("ERROR", signOutData);
    }

    handleQRConfirm() {
        this.setState({
            lastUrlQRData: null
        });

        this.updateSessionData();
    }

    handleQRInput(qr) {
        this.setState({
            lastUrlQRData: qr
        });
    }

    getActiveSession() {
        let that = this;
        console.log("LoadingSession...");

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "getActiveSession",
                data: null
            }
        })
            .then(function (response) {
                if (response.data.result === -1)
                    that.setState({qrContestOpen: false});
                else
                    that.setState({qrContestOpen: true});
                that.handleSignIn(response.data);

                if (response.data.result.hasOwnProperty("ID"))
                    console.log("Found active session");
                else
                    console.log("No active session found");

                // console.log(response.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    updateSessionData() {
        let that = this;
        console.log("UpdateSession...");

        axios.defaults.withCredentials = true;
        axios.post(getAPIDataUrl(), {
            request: {
                type: "updateSessionData",
                data: null
            }
        })
            .then(function (response) {
                if (response.data.result === -1)
                    that.setState({qrContestOpen: false});
                else
                    that.setState({userData: response.data.result, qrContestOpen: true})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    extractQRDataFromURL() {
        let url = window.location.href;
        let temp = url.search("qr/");
        if (temp !== -1)
            this.state.lastUrlQRData = url.slice(temp + 3);
    }

    redirectGuard() {
        this.extractQRDataFromURL();
        let redirectTo = null;

        if ((this.state.userLogged === false || !this.state.qrContestOpen) && this.state.currentScreen !== "/") {
            redirectTo = "/";
        } else {
            if (this.state.qrContestOpen) {
                if (this.state.userLogged === true && this.state.currentScreen === "/") {
                    this.updateSessionData();
                    redirectTo = "/home";
                }

                if (this.state.userLogged === true && this.state.lastUrlQRData !== null && this.state.currentScreen === "/home")
                    redirectTo = "/qr";

                if (this.state.userLogged === true && this.state.lastUrlQRData === null && this.state.currentScreen === "/qr") {
                    this.updateSessionData();
                    redirectTo = "/home";
                }
            }
        }

        if (redirectTo)
            this.state.currentScreen = redirectTo;

        return (redirectTo) ? <Redirect to={redirectTo} push/> : null;
    }

    render() {
        let redirect = this.redirectGuard();

        if (redirect) {
            return redirect;
        }

        return (
            <div>
                <Route exact path="/" render={(routeProps) => (
                    <SignInScreen
                        onSignIn={this.handleSignIn}
                        qrContestOpen={this.state.qrContestOpen}
                    />
                )}/>
                <Route path="/home" render={(routeProps) => (
                    <HomeScreen
                        login={(this.state.userData) ? this.state.userData.login : "Loading..."}
                        points={(this.state.userData) ? this.state.userData.points : "Loading..."}
                        userType={(this.state.userData.type) ? parseInt(this.state.userData.type, 10) : 0}
                        onSignOut={this.handleSignOut}
                        onQRInput={this.handleQRInput}
                    />
                )}/>
                <Route path="/qr" render={(routeProps) => (
                    <QRScreen
                        login={(this.state.userData) ? this.state.userData.login : "Loading..."}
                        points={(this.state.userData) ? this.state.userData.points : "Loading..."}
                        user={(this.state.userData) ? this.state.userData.ID : 0}
                        qr={this.state.lastUrlQRData}
                        onConfirm={this.handleQRConfirm}
                        onSignOut={this.handleSignOut}
                    />
                )}/>
            </div>
        )
    };
}

class SignInScreen extends Component {
    render() {
        return (
            <div>
                <PageHeader/>
                <About/>
                {
                    (this.props.qrContestOpen) ?
                        (
                            <div>
                                <SignIn onSignIn={this.props.onSignIn}/>
                                <SignUp/>
                            </div>
                        ) :
                        <ContestClosed/>
                }
                <Ranking/>
                <Footer noSignOut={true}/>
            </div>
        )
    }
}

class HomeScreen extends Component {
    render() {
        return (
            <div>
                <Toolbar login={this.props.login} points={this.props.points}/>
                <div className="container">
                    <ScanQR
                        onQRInput={this.props.onQRInput}
                    />
                    <Ranking
                        login={this.props.login}
                    />
                    <Collected/>
                </div>
                {
                    (this.props.userType === 1) ?
                        (
                            <div className="container">
                                <SUScreen user={this.props.user}/>
                            </div>
                        ) :
                        null
                }
                <Footer onSignOut={this.props.onSignOut}/>
            </div>
        )
    }
}

class QRScreen extends Component {
    render() {
        return (
            <div>
                <Toolbar login={this.props.login} points={this.props.points}/>
                <QR
                    user={this.props.user}
                    qr={this.props.qr}
                    onConfirm={this.props.onConfirm}
                />
                <Footer onSignOut={this.props.onSignOut}/>
            </div>
        )
    }
}

class SUScreen extends Component {
    render() {
        return (
            <div className="row">
                <div className="col">
                    <CollectedAll/>
                </div>
            </div>
        )
    }
}

// class OpenCloseQR extends Component {
//     constructor(props) {
//         super(props);
//         this.handleOpen = this.handleOpen.bind(this);
//         this.handleClose = this.handleClose.bind(this);
//     }
//
//     handleOpen() {
//         let that = this;
//
//         axios.defaults.withCredentials = true;
//         axios.post(getAPIDataUrl(), {
//             request: {
//                 type: "QRQuestOpen",
//                 data: null
//             }
//         })
//             .then(function (response) {
//                 console.log(response.data.result);
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }
//
//     handleClose() {
//         let that = this;
//
//         axios.defaults.withCredentials = true;
//         axios.post(getAPIDataUrl(), {
//             request: {
//                 type: "QRQuestClose",
//                 data: null
//             }
//         })
//             .then(function (response) {
//                 console.log(response.data.result);
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }
//
//     render(){
//         return(
//             <div className="container">
//                 <div className="card">
//                     <div className="card-body">
//                         <h2 className="card-title mb-4"><span className="highlight">QR</span>CONTEST</h2>
//                         <button type="button" className="btn btn-raised btn-primary" onClick={this.handleOpen}>Otwórz konkurs</button>
//                         <button type="button" className="btn btn-raised btn-primary" onClick={this.handleClose}>Zamknij konkurs</button>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

class PageHeader extends Component {
    render() {
        return (
            <div className="page-header">
                <div className="container">
                    <h1 className="big-logo">
                        <span className="highlight">QR</span>CONTEST
                    </h1>
                    <p className="text">Zbieraj kody, zgarniaj nagrody!</p>
                </div>
            </div>
        )
    }
}

class About extends Component {
    render() {
        return (
            <div className="about">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4"><span className="highlight">QR</span>CONTEST</h2>
                            <p>Konkurs <span className="highlight">QR</span>CONTEST polega na szukaniu kodów QR rozmieszczonych w różnych miejscach w szkole. Każdy kod wart jest określoną liczbę punktów - adekwatnie do trudności znalezienia kodu. Osoba która zdobędzie <span className="highlight">najwięcej punktów</span> wygrywa!</p>
                            <p><span className="highlight">QR</span>CONTEST to nie tylko poszukiwanie kodów, to także test wiedzy, nie tylko z zakresu informatyki. W niektórych kodach ukryte są <span className="highlight">pytania</span> które mogą pomóc Ci szybciej zdobywać cenne punkty!</p>
                            <p>W konkursie może wziąć udział każdy uczeń ZSEO, niezależnie od klasy. Aby wziąć udział wystarczy zarejestrować się poniżej a następnie zalogować na swoje konto.</p>
                            <p>Fundatorem nagród w konkursie jest firma Tip.pl. W puli nagród są m.in. <span className="highlight">myszy optyczne</span> i <span className="highlight">pendrive'y</span>.</p>
                            <b className="m-0">Do zobaczenia na rozdaniu nagród!</b>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ContestClosed extends Component {
    render() {
        return (
            <div className="about">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Konkurs nie jest aktywny.</h2>
                            <p>Dziękujemy wam wszystkim za udział w konkursie <span className="highlight">QR</span>CONTEST!</p>
                            <p className="m-0">
                                Gratulujemy zwycięzcom konkursu, rozdanie nagród odbędzie się w czwartek 08.02.2018 na dużej przerwie. Więcej informacji dostępne na profilu fb <i className="highlight">ZSEO Gniezno</i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
