import "./App.css";
import React, { Component } from "react";
import requests, { checkStatus } from "./api.js";

const defaultChannelId = 4;
//FIXME debugging

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel: defaultChannelId
        };

        this.setChannel = this.setChannel.bind(this);
    }

    componentDidMount() {
        let token = localStorage.getItem("token");
        let refresh = requests.verifyToken(token);
        console.log("Token valid?: ", refresh);

        if (refresh) {
            this.fetchMessages();
        }
    }

    componentDidUpdate({ channel }) {
        if (channel !== this.props.channel) {
            this.fetchMessages();
        }
    }

    async fetchMessages() {
        await requests.getToken();
    }

    setChannel(channel) {
        this.setState({ channel });
    }

    //componentDidUpdate({messages}) {
    //}

    render() {
        return (
            (
                <ChannelMenu
                    channel={this.state.channel}
                    setChannel={this.setChannel}
                />
            ),
            <MessageWindow channel={this.state.channel} />,
            <InputArea channel={this.state.channel} />
        );
    }
}

class ChannelMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { channels: null };
    }

    componentDidMount() {
        requests
            .getChannels()
            .then(response => {
                if (checkStatus(response)) {
                    return response.json();
                } else {
                    console.log("ChannelMenu error: ", response);
                    throw Error(response.statusText);
                }
            })
            .then(channels => this.setState({ channels }));
    }
    render() {
        const { channels } = this.state;
        const channelList =
            channels === null
                ? ""
                : channels.results.map(({ name, id }) => {
                    return (
                        <li
                            className={
                                this.props.channel === id ? "selected" : ""
                            }
                            key={`channel ${id}`}
                            onClick={() => this.props.setChannel(id)}
                        >
                            {name}
                        </li>
                    );
                });

        return <ul className="Channels">{channelList}</ul>;
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
        console.log("Submitting: ", this.state.value);

        let message = {
            body: JSON.stringify({
                channel: this.props.channel,
                text: this.state.value
            })
        };
        console.log("Handling submit: ", message);

        requests
            .postMessage(
                this.props.channel,
                message,
                localStorage.getItem("token")
            )
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

class MessageWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    componentDidMount() {
        requests
            .channelMessages(this.props.channel, localStorage.getItem("token"))
            .then(checkStatus)
            .then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw Error("Could not receive messages");
                }
            })
            .then(json => {
                console.log(json);

                this.setState({
                    messages: json
                });
            })
            .catch(error => console.log(error));
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

export default MainContainer;
