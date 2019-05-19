import React, { Component } from "react";
import "./App.css";

const API = "http://localhost:8000";
const defaultChannelId = 4;

function Frame() {
    return (
        //FIXME to be added later
        //<Menu/>
        <MainContainer channelId={defaultChannelId} />
    );
}

class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: { id: defaultChannelId }
            //FIXME to be added
            //text-area
            //submit-button
        };
    }

    componentDidMount() {
        fetch(`${API}/channels/${defaultChannelId}`)
            .then(response => {
                return response.json();
            })
            .then(json => this.setState({ channel: json.Channel }))
            .catch(ex => console.log("parse error", ex));
    }

    render() {
        return <Channel id={this.state.channel.id} />;
    }
}

class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //FIXME ask joe what this is all about?
            loadingData: true,
            messages: []
        };
    }

    componentDidMount() {
        //FIXME ask joe what this is all about?
        this._isMounted = true;

        fetch(`${API}/channels/${this.props.id}/messages`)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.setState({
                    loadingData: false,
                    messages: json.messages
                });
            })
            .catch(ex => {
                console.log("Parsing error", ex);
            });
    }

    render() {
        //FIXME ask joe what this is all about?
        if (!this.state.loadingData) {
            return this.state.messages.map(m => (
                <Message message={m} key={m.id} />
            ));
        } else {
            return null;
        }
    }
}

function Message(props) {
    return (
        <React.Fragment>
            <div className="message-header">
                <b>
                    {props.message.author}({props.message.timestamp}):{" "}
                </b>
            </div>
            <div className="message-body">{props.message.text}</div>
        </React.Fragment>
    );
}

export default Frame;
