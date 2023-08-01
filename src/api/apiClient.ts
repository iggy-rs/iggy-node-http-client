import axios from "axios";
import {toSnakeCase} from "../utils/toSnakeCase";

export class ApiClient {
    baseUrl: string
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }
    private async sendHttpRequest<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', data?: any): Promise<T> {
        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}/${endpoint}`,
                headers: { 'Content-Type': 'application/json' },
                data: data ? toSnakeCase(data) : undefined,
            });
            return response.data;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                throw new Error(e.message);
            }
            throw new Error('Unknown error occurred.');
        }
    }


    patch<T>(url: string, data: unknown): Promise<T> {
        return this.sendHttpRequest<T>(url, 'PATCH', data)
    }
    put<T>(url: string, data: unknown, params?: Record<string, unknown>): Promise<T> {
        return this.sendHttpRequest<T>(url, 'PUT', data)
    }
    post<T>(url: string, data: unknown): Promise<T> {
        return this.sendHttpRequest<T>(url, 'POST', data)
    }
    getOne<T>(url: string): Promise<T> {
        return this.sendHttpRequest<T>(url, 'GET')
    }
    getMany<T>(url: string): Promise<T[]> {
        return this.sendHttpRequest<T[]>(url, 'GET')
    }
    delete<T>(url: string): Promise<T> {
        return this.sendHttpRequest<T>(url, 'DELETE')
    }
}
