import axios from "axios";

export const baseURLs = {
    videos: `https://${process.env.REACT_APP_API_HOST}/api/v1/videos`,
    user: `https://${process.env.REACT_APP_API_HOST}/api/v1/user`,
    search: `https://${process.env.REACT_APP_API_HOST}/api/v1/search`,
    auth: `https://${process.env.REACT_APP_API_HOST}/api/v1/auth`,
}

export const API = {
    videos: axios.create({baseURL: baseURLs.videos}),
    user: axios.create({baseURL: baseURLs.user}),
    search: axios.create({baseURL: baseURLs.search}),
    auth: axios.create({baseURL: baseURLs.auth}),
}