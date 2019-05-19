import React, { Component } from "react";
import Frame from "./Chat";

const defaultChannel = 2;

class App extends Component {
    render() {
        return <Frame channel={defaultChannel}/>;
    }
}

export default App;
