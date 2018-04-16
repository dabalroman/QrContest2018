import React, {Component} from 'react';

class StatefulButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            state: -1,
            // timeout: null
        }
    }

    componentWillReceiveProps() {
        // let that = this;
        // clearTimeout(this.state.timeout);
        this.setState({
            state: this.props.state,
            // timeout: setTimeout(() => {that.setState({state: -1}); console.log("JUZ")}, 5000)
        });
        console.log("PROPS" + this.props.state + "v" + this.state.state);
    }


    render() {
        let content = null;

        if(this.state.state === 0)
            content = <span><i className="icon-ok"/> {this.props.text}</span>;
        else if(this.state.state === 1 || this.state.state === 2)
            content = <span><i className="icon-cancel"/> {this.props.text}</span>;
        else if(this.state.state === 3)
            content = <span><i className="icon-spin animate-spin"/> {this.props.text}</span>;
        else
            content = <span>{this.props.text}</span>;

        return (
            <button type={this.props.type} className="btn btn-raised btn-primary">
                {content}
            </button>
        );
    }
}

export default StatefulButton;