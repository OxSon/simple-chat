import React, { Component } from "react";

const API = "http://localhost:8000";

class Frame extends Component {
    constructor(props){
        super(props);

        this.state = {
            channel: null,
        };
    }

    render() {
        return (
            <MainContainer channel={this.state.channel}>
            </MainContainer>
        );
    }

}

async function Channels() {
    const response = await fetch(`${API}/channels`);
    return response.Channels;
}

async function GetMessages(channelID) {
    const response = await fetch(`${API}/channels/${channelID}/messages`);
    return await response.json().messages;
}

class Channel extends Component {
    constructor(props) {
        super(props);
        this.id = props.id;
        this.state = {messages: []};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.refresh(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    refresh() {
        this.setState({
            messages: GetMessages(this.id),
        });
    }


    render() {
        return (
            <React.Fragment>
                <div className="channel-header">
                    <div className="debug">
                        debug: channel-header
                    </div>
                    <h1>{this.props.name}</h1>
                </div>

                <div className="messages">
                    <Messages messages={this.state.messages}>
                </div>
            </React.Fragment>
        );
    }
}

function Messages(props) {
    let messages = [];

    for (let message in props.messages) {
        messages.push(displayMessage(message));
    }

    return messages;
}

/*
async function ChannelDetail(pk) {
    const response = await fetch(`${API}/channels/${pk}`);
    const json = await response.json();
}
*/

class MainContainer extends Component {
    render() {
        return (
            <div className="main-container">
                <Channel id="2" />
            </div>
        );
    }
}

function displayMessage(message) {
    return (
        <p><b>{message.user}({message.timestamp}):</b>{message.text}</p>
    );
}

export default Frame;
