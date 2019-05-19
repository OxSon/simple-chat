import React, { Component } from "react";
import "./App.css";

const API = "http://localhost:8000";

class Frame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //FIXME to be added later
            //menu: props.menu,
            channel: props.channel,
        };
    }

    render() {
        return (
            //FIXME to be added later
            //<Menu/>
            <MainContainer channelId={this.state.channel}>
            </MainContainer>
        );
    }
}

class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channelId: props.channel,
            channelName: null
            //FIXME to be added
            //text-area
            //submit-button
        };
    }

    componentDidMount() {
        //FIXME hardcording for now
        fetch(`${API}/channels/{${this.channelId}}`)
            .then((response) => {return response.json();})
            .then((json) => this.setState({ channelName: json.name}))
            .catch((ex) => console.log("parse error", ex));
    }

    render() {
        return <Channel id={this.channelId}/>;
    }
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
            messages: this.getMessages(2),
        });
    }

    getMessages() {
        fetch(`${API}/channels/2/messages`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState({
                    messages: json
                });
            })
            .catch((ex) => {
                console.log("Parsing error", ex);
            });
    }


    render() {
        return this.state.messages.map(m => {
            return <p><b>{m.author}({m.timestamp})</b>{m.text}</p>;
        });
    }
}

export default Frame;
