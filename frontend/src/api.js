import { USERNAME, PASSWORD } from "./constants/user_constants";
const API_URL = "http://localhost:8000/";

//FIXME probably a better structure for this process

async function authenticate() {
    if (await verifyToken()) {
        console.log("authenticate: verified token");
        return localStorage.getItem("token");
    } else {
        //FIXME this shit not be necessary yes?
        console.log("authenticate: failed to verify token");
        localStorage.clear();
        await getToken();
    }
}

function getToken() {
    console.log("getToken executed");
    if (localStorage.getItem("token")) {
        return localStorage.getItem("token");
    } else {
        let target_url = `${API_URL}api-token-auth/`;
        let token_req = {
            url: target_url,
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: USERNAME,
                password: PASSWORD
            })
        };

        console.log("ReqInit obj: ", token_req);
        console.log("Request: ", new Request(target_url, token_req));

        fetch(target_url, token_req)
            .then(checkStatus)
            .then(response => response.json())
            .then(json => {
                console.log("Token from src/Api: ", json.token);
                localStorage.setItem("token", json.token);
                return json.token;
            })
            .catch(error => {
                console.log("Error from src/Api: ", error);
                return null;
            });
    }
}

function verifyToken() {
    if (!localStorage.getItem("token")) {
        return false;
    }

    //TODO refactor to use request() custom function
    let target_url = `${API_URL}api-token-verify/`;
    let verify_req = {
        url: target_url,
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: localStorage.getItem("token")
        })
    };

    console.log("ReqInit obj: ", verify_req);
    console.log("Request: ", new Request(target_url, verify_req));

    fetch(target_url, verify_req)
        //FIXME actually don't want to check status here as we don't want to just throw
        //an error on a 400 response
        //.then(checkStatus)
        .then(response => {
            if (response.status === 200) {
                console.log("Verified token");
                return true;
            } else {
                console.log("Could not verify token: ", response.status);
                console.log("Response: ", response);
            }
        })
        .catch(error => console.log("Error from verifyToken(): ", error));

    return false;
}

//FIXME broken, only sends plain GET requests
/*
async function request(endpoint, request = {}, authenticated = false) {
    /*    let config = {};

    if (authenticated) {
        let token = getToken();

        if (token) {
            config = {
                headers: { Authorization: `JWT ${token}` }
            };
        } else {
            throw new Error("No token saved!");
        }
    }

    request.Headers += config;

    return fetch(`${API_URL}${endpoint}`, config);
    return await false;
}
*/

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        response
            .then(response => response.json())
            .then(json => console.log(json.detail));
    }
}

export { authenticate, checkStatus };
//export default request;
