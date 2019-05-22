import React, { Component } from "react";
import "./App.css";
import request, { checkStatus, getToken, API_URL } from "./Api.js";

const defaultChannelId = 2;

function Frame() {
    return (
        //FIXME to be added later
        //<Menu/>
        <MainContainer />
    );
}

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { channel: defaultChannelId };
        this.setChannel = this.setChannel.bind(this);
    }

    setChannel(channel) {
        this.setState({ channel });
    }

    render() {
        return (
            <React.Fragment>
                <Channels channel={this.state.channel} setChannel={this.setChannel}/>
                <MessageWindow channel={this.state.channel} />
                <InputArea channel={this.state.channel} />
            </React.Fragment>
        );
    }
}

class Channels extends Component {
    constructor(props) {
        super(props);
        this.state = { channels: null };
    }

    componentDidMount() {
        fetch(`${API_URL}channels`)
            .then(checkStatus)
            .then(res => res.json())
            .then(channels => this.setState({channels}));
    }
    render() {
        const { channels } = this.state;
        const channelList = channels === null ? "" : channels.results.map(({name, id}) => {
            return (
                <li className={ this.props.channel === id ? "selected" : "" }
                    key={`channel-${id}`}
                    onClick={() => this.props.setChannel(id)}>{name}</li>
            );
        });
        return (
            <ul className="Channels">
                {channelList}
            </ul>
        );
    }
}

class InputArea extends Component {
    constructor(props) {
        super(props);
        this.state = { value: null };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        let req = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                channel: this.props.channel,
                text: this.state.value,
            }),
        };
        console.log("Handling submit: ", req);

        request(`channels/${this.props.channel}/messages`, req, true)
            .then(checkStatus)
            .then(response => response.json())
            .then(json => console.log(json));
        event.preventDefault();
    }

    handleFocus(event) {
        document.getElementById("input").value = null;
        event.preventDefault();
    }

    render() {
        return (
            //FIXME invalid action, post to api?
            <form>
                <textarea
                    rows="4"
                    cols="80"
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    onFocus={this.handleFocus}
                    id="input"
                    defaultValue="Enter your message here."
                />
                <button onClick={this.handleSubmit}>Send Message</button>
            </form>
        );
    }
}

class MessageWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    fetchMessages() {
        request(`channels/${this.props.channel}/messages`, {
            credentials: "include",
        }, true)
            .then(checkStatus)
            .then(response => {
                return response.json();
            })
            .then(json => {
                console.log(json);
                this.setState({
                    messages: json
                });
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.fetchMessages();
    }

    componentDidUpdate({channel}) {
        if (channel !== this.props.channel) {
            this.fetchMessages();
        }
    }

    render() {
        return (
            <h1>
                {this.state.messages
                    .slice(-3)
                    .map(m => (
                        <Message
                            owner={m.owner}
                            timestamp={m.timestamp}
                            text={m.text}
                            key={m.id}
                        />
                    ))
                    .reverse()}
            </h1>
        );
    }
}

function Message(props) {
    return (
        <p>
            <b>
                {props.owner}({props.timestamp})
            </b>
            {props.text}
        </p>
    );
}

export default Frame;
