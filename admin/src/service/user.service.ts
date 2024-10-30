import axios from "axios";
import { Method } from "axios";
import e from "express";

export class UserService {
    static async request(method: Method, url: string, data = {}, cookie = '') {

        let headers = {};

        if (cookie != '') {
            headers = {
                'Cookie': `user_session=${cookie}`
            };
        }

        try {
            const response = await axios.request({
                method,
                url,
                baseURL: process.env.USERS_MS + '/api/',
                headers,
                data
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw {
                    status: error.response.status,
                    data: error.response.data
                };
            } else {
                throw {
                    status: 500,
                    data: { message: "Internal Server Error" }
                };
            }
        }
    }

    static async post(url: string, data = {}, cookie = '') {
        return this.request('post', url, data, cookie);
    }

    static async put(url: string, data = {}, cookie = '') {
        return this.request('put', url, data, cookie);
    }

    static async get(url: string, cookie = '') {
        return this.request('get', url, {}, cookie);
    }
}