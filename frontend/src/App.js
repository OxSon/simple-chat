import "./App.css";
import React, { Component } from "react";
import requests, { checkStatus } from "./api.js";

const defaultChannelId = 4;
//FIXME debugging

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel: defaultChannelId,
            components: []
        };
    }

    componentDidMount() {
        let token = localStorage.getItem("token");
        let refresh = requests.verifyToken(token);
        console.log("Token valid?: ", refresh);

        if (refresh) {
            this.fetchMessages();
        } else {
            this.setState({
                message_window: <MessageWindow channel={defaultChannelId} />,
                input_area: <InputArea channel={defaultChannelId} />
            });
        }
    }

    async fetchMessages() {
        await requests.getToken();

        let comps = [
            <MessageWindow channel = {defaultChannelId} />,
            <InputArea channel = {defaultChannelId} />
        ];

        this.setState({
            components: comps
        });
    }

    //componentDidUpdate({messages}) {
    //}

    render() {
        let activeComponents = [];

        this.state.components.forEach(comp => {
            if (comp) {
                activeComponents.push(comp);
            }
        });

        return activeComponents;
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
