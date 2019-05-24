import "./App.css";
import React, { Component } from "react";
import requests from "./api.js";

const defaultChannelId = 4;

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
        requests.verifyToken(token).then(refresh => {
            console.log("Token valid?: ", refresh.ok);

            if (!refresh.ok) {
                this.updateToken();
            }
        });
    }

    componentDidUpdate({ channel }) {
        if (channel !== this.props.channel) {
            this.fetchMessages();
        }
    }

    updateToken() {
        requests.getToken();
    }

    setChannel(channel) {
        this.setState({ channel });
    }

    //componentDidUpdate({messages}) {
    //}

    render() {
        return (
            <React.Fragment>
                <ChannelMenu
                    channel={this.state.channel}
                    setChannel={this.setChannel}
                />
                <MessageWindow channel={this.state.channel} />
                <InputArea channel={this.state.channel} />
            </React.Fragment>
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
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("ChannelMenu error: ", response.statusText);
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

class MessageWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    componentDidMount() {
        this.fetchMessages();
    }

    componentDidUpdate({ channel }) {
        if (channel !== this.props.channel) {
            this.fetchMessages();
        }
    }

    fetchMessages() {
        requests
            .channelMessages(this.props.channel, localStorage.getItem("token"))
            .then(response => {
                if (response.ok) {
                    console.log(
                        "Message reponse received: ",
                        response.statusText
                    );
                    return response.json();
                } else {
                    throw Error("Could not receive messages");
                }
            })
            .then(json => {
                console.log("Received messages: ", json);

                this.setState({
                    messages: json
                });
            })
            .catch(error => console.log("Did not receive messages: ", error));
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

export default MainContainer;
