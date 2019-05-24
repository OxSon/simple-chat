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

    let response = await genericRequest(api.VERIFY_URL, req);

    console.log("verifyToken: response: ", response);

    return checkStatus(response);
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
        .then(checkStatus)
        .then(response => response.json())
        .then(json => {
            console.log("Token from src/Api: ", json.token);
            localStorage.setItem("token", json.token);

            //FIXME how does return work in promise chains?
            return json.token;
        })
        .catch(error => {
            console.log("Error from src/Api: ", error);
            return false;
        });
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        console.log("checkStatus fail: ", response);
        return false;
    }
}

export { checkStatus };
