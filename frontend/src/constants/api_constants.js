const BASE_URL = "http://localhost:8000/";

export const user = {
    USERNAME: "oxson",
    PASSWORD: "newports"
};

export const api = {
    BASE_URL: BASE_URL,
    AUTH_URL: BASE_URL + "api-token-auth/",
    REFRESH_URL: BASE_URL + "api-token-refresh/",
    VERIFY_URL: BASE_URL + "api-token-verify/",
    USER_URL: BASE_URL + "users/",
    CHANNELS_URL: BASE_URL + "channels/",

    channelDetail: (pk) => BASE_URL + `channels/${pk}/`,
    messagesURL: (pk) => BASE_URL + `channels/${pk}/messages/`
};

export default {
    user,
    api
};
