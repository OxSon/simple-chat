import React, { Component } from 'react';
import './App.css';

const API = "http://localhost:8000";

function App() {
    let channel = 2;
    return (
        <Messages id={channel}/>
    );
}

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            messages: [],
        };
    }

    getMessages(id) {
        fetch(`${API}/channels/${id}/messages`)
            .then( (response) => {
                return response.json()
            })
            .then( (json) => {
                this.setState({
                    messages: json
                });
                //                console.log("parsed json", json);
            })
            .catch( (ex) => {
                console.log("???", ex)
            })

        //console.log(this.state.messages);
    }

    renderMessages(messages) {
        let elem = [];
        for(let m in messages) {
            elem.push(
                <div>
                    <p><b>{m.author}({m.timestamp})</b>{m.text}</p>
                </div>
            );
        }

        return elem;
    }

    render() {
        this.getMessages(this.state.id);

        return (
            <div id="messages">
                {this.renderMessages(this.state.messages)}
            </div>
        );
    }
}

export default App;
