import axios from "axios";
import {HOST} from "../consts/host";

export const API = {
    videos: axios.create({baseURL: `https://${HOST}/api/v1/videos`}),
    user: axios.create({baseURL: `https://${HOST}/api/v1/user`}),
    search: axios.create({baseURL: `https://${HOST}/api/v1/search`}),
    auth: axios.create({baseURL: `https://${HOST}/api/v1/auth`}),
}