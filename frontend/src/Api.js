import user_info from "./config/User.js";
const API_URL = "http://localhost:8000/";

function getToken() {
    if (!localStorage.getItem("jwt_token")) {
        fetch(`${API_URL}api-token-auth/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user_info.username,
                password: user_info.password
            })
        })
            .then(checkStatus)
            .then(response => response.json())
            .then(json => {
                console.log("Token from src/Api: ", json.token);
                localStorage.setItem("jwt_token", json.token);
            })
            .catch(error => console.log("Error from src/Api: ", error));
    }
}

async function request(endpoint, request, authenticated = false) {
    let token = localStorage.getItem("jwt_token") || getToken();
    let config = {};

    if (authenticated) {
        if (token) {
            config = {
                headers: { Authorization: `JWT ${token}` }
            };
        } else {
            throw "No token saved!";
        }
    }

    request.Headers += config;

    return fetch(`${API_URL}${endpoint}`, config);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export { checkStatus, getToken, API_URL };
export default request;
