import React, { Component } from "react";
import "./App.css";
import "whatwg-fetch";

const API = "http://localhost:8000";
const defaultChannelId = 4;

function Frame() {
    return (
        //FIXME to be added later
        //<Menu/>
        <MainContainer/>
    );
}

function MainContainer(props) {
    return (
        //Message display area
        <MessageWindow channel={defaultChannelId}/>
        //user interaction area
        //<InputArea/>
    );
}

class MessageWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: []};
    }

    componentDidMount() {
        fetch(`${API}/channels/${this.props.channel}/messages`)
            .then(checkStatus)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log(json);
                this.setState({
                    messages: json
                });
            })
            .catch((error) => console.log(error));
    }

    componentWillUnmount() {
    }

    render() {
        //FIXME
        return <h1>{this.state.messages.map(
            m => <Message owner={m.owner} timestamp={m.timestamp} text={m.text}/>
        )}</h1>;
    }
}

function Message(props) {
    return (
        <p><b>{props.owner}({props.timestamp})</b>{props.text}</p>
    );
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export default Frame;
