import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenErrors } from "./errors/AuthTokenErrors";
import { signOut } from "../context/AuthContext";

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;
    }, (err: AxiosError) => {
        if(err.response.status === 401){
            if(typeof window !== undefined){
                signOut();
            } else {
                return Promise.reject(new AuthTokenErrors())
            }
        }

        return Promise.reject(err);
    });

    return api;
}