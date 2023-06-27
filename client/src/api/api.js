import axios from "axios";

export const API = {
    videos: axios.create({baseURL: `https://${process.env.REACT_APP_API_HOST}/api/v1/videos`}),
    user: axios.create({baseURL: `https://${process.env.REACT_APP_API_HOST}/api/v1/user`}),
    search: axios.create({baseURL: `https://${process.env.REACT_APP_API_HOST}/api/v1/search`}),
    auth: axios.create({baseURL: `https://${process.env.REACT_APP_API_HOST}/api/v1/auth`}),
}