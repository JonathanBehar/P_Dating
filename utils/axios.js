import axios from "axios";
import { CLOUD_URL } from "../constants";
const api = axios.create({
    baseURL: CLOUD_URL,
    headers: { 
        "Accept": 'application/json',
        'Content-Type': 'application/json',
    },
});
export default api;