import React, { Component } from "react";
import "./App.css";

const API = "http://localhost:8000";

function Frame(props) {
    return (
        //FIXME to be added later
        //<Menu/>
        <MainContainer channelId={2}>
        </MainContainer>
    );
}

class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channelName: null
            //FIXME to be added
            //text-area
            //submit-button
        };
    }

    componentDidMount() {
        //FIXME hardcording for now
        fetch(`${API}/channels/2`)
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
        this.state = { messages: [] };

        //this.refresh = this.refresh.bind(this);
    }

    //componentDidMount() {
        //this.timerID = setInterval(
            //() => this.refresh(),
            //1000
            //);
        //}

    //componentWillUnmount() {
        //clearInterval(this.timerID);
        //}

    //refresh() {
    //this.setState({
    //messages: this.getMessages(this.props.id),
    //});
    //}

    componentDidMount() {
        this.getMessages(this.props.id);
    }

    getMessages(id) {
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
        return this.state.messages.map(m => <Message message={m} key={m.id}/>);
    }
}

function Message(props) {
    return (
        <div className="message">
            <p>
                <b>{props.message.author}({props.message.timestamp}): </b>
                {props.message.text}
            </p>
        </div>
    );
}

export default Frame;
