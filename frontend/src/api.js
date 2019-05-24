import { user, api } from "./constants/api_constants.js";

export default {
    getChannels,
    channelDetail,
    channelMessages,
    verifyToken,
    refreshToken,
    getToken,
    postMessage
};

function genericRequest(target, options = {}, token = false) {
    let defaultOpts = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    };

    if (token) {
        console.log(
            "token: ",
            localStorage.getItem("token"),
            "defaultHeaders: ",
            defaultOpts
        );
        //defaultOpts.headers["Authorization"] = "JWT " + token;
        defaultOpts.headers["Authorization"] =
            "JWT " + localStorage.getItem("token");
    }

    options.headers = { ...defaultOpts.headers, ...options.headers };

    return fetch(target, options);
}

function getChannels() {
    return genericRequest(api.CHANNELS_URL);
}

function channelDetail(pk) {
    return genericRequest(api.channelDetail(pk));
}

function channelMessages(pk, token) {
    return genericRequest(api.messagesURL(pk), {}, token);
}

function postMessage(pk, message, token) {
    message.method = "POST";
    return genericRequest(api.messagesURL(pk), message, token);
}

async function verifyToken(_token) {
    if (!_token) {
        return false;
    }

    let req = {
        method: "POST",
        body: JSON.stringify({
            token: _token
        })
    };

    console.log("verifyToken: req: ", req);

    return await genericRequest(api.VERIFY_URL, req);
}

function refreshToken(token) {
    let options = {
        method: "POST",
        body: JSON.stringify({
            token: token
        })
    };

    return genericRequest(api.REFRESH_URL, options);
}

function getToken() {
    console.log("getToken: executed");

    let token_req = {
        method: "POST",
        body: JSON.stringify({
            username: user.USERNAME,
            password: user.PASSWORD
        })
    };

    console.log("ReqInit obj: ", token_req);

    genericRequest(api.AUTH_URL, token_req)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.status, response.statusText);
            }
        })
        .then(json => {
            localStorage.setItem("token", json.token);

            return json.token;
        })
        .then(token => { //is this necessary? promises are confusing maaaan
            return token;
        })
        .catch(error => {
            console.log("Error from src/Api: ", error);
            return false;
        });
}
