import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainContainer from "./App";
import * as serviceWorker from "./serviceWorker";

//authenticate()
//.then(response => {
//console.log("authenticate; response: ", response);
////FIXME

ReactDOM.render(<MainContainer />, document.getElementById("root"));
//})
//.then(json => {
//       console.log("authenticate finished; json: ", json);
//       ReactDOM.render(<App />, document.getElementById("root"));
//   })
//.catch(error => console.log("authenticate: encountered error: ", error));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
