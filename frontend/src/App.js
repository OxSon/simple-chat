import "./App.css";
import React, { Component } from "react";
//import request, { checkStatus } from "./api.js";
import { checkStatus } from "./api.js";

const defaultChannelId = 4;
//FIXME debugging

function App() {
    return (
        //FIXME to be added later
        //<Menu/>
        <MainContainer />
    );
}
    /*
class Menu extends Component {
    constructor(props) {
        super(props);
    }
}
*/

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { channel: defaultChannelId };
    }

    render() {
        return (
            <React.Fragment>
                <MessageWindow channel={this.state.channel} />
                <InputArea channel={this.state.channel} />
            </React.Fragment>
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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                channel: this.props.channel,
                text: this.state.value
            })
        };
        console.log("Handling submit: ", req);

        //request(`channels/${this.props.channel}/messages`, req, true)
        fetch(`channels/${this.props.channel}/messages`, req)
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
        //request(`channels/${this.props.channel}/messages`, {}, true)
        fetch(`channels/${this.props.channel}/messages`)
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

export default App;
