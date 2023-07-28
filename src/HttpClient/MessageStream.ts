import axios from 'axios';

import {Stream} from "../types/Stream";
import {toSnakeCase} from "../utils/toSnakeCase";
import {Topic} from "../types/Topic";

export class HttpClient {
    /**
     * The baseAddress to use
     */
    private readonly baseAddress: string
    constructor(baseAddress: string) {
        this.baseAddress = baseAddress;
    }

    private async sendHttpRequest<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: T, params?: Record<string, unknown>): Promise<any> {
        try {
            const response = await axios({
                method,
                params,
                url: `${this.baseAddress}${endpoint}`,
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
    async getClients(): Promise<any[]> {
        return this.sendHttpRequest('/clients', 'GET');
    }

    async getClient(clientId: number): Promise<any> {
        return this.sendHttpRequest(`/clients/${clientId}`, 'GET');
    }

    async ping(): Promise<any> {
        return this.sendHttpRequest('/ping', 'GET');
    }

    async getStats(): Promise<any> {
        return this.sendHttpRequest('/stats', 'GET');
    }

    async kill(): Promise<any> {
        return this.sendHttpRequest('/kill', 'POST');
    }

    async getStreams(): Promise<any> {
        return this.sendHttpRequest('/streams', 'GET');
    }

    async getStream(streamId: number): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}`, 'GET');
    }

    async deleteStream(streamId: number): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}`, 'DELETE');
    }

    async getTopics(streamId: number): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}/topics`, 'GET');
    }

    async getTopic(streamId: number, topicId: number): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}`, 'GET');
    }

    async deleteTopic(streamId: number, topicId: number): Promise<void> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}`, 'DELETE');
    }

    async postMessage(streamId: number, topicId: number, message: any): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/messages`, 'POST', message);
    }

    async getMessage(streamId: number, topicId: number, params: Record<string, unknown>): Promise<any[]> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/messages`, 'GET', params);
    }

    async putMessageOffset(streamId: number, topicId: number, consumerId: number, partitionId: number, offset: number = 1): Promise<any> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/messages/offsets`, 'PUT', { consumerId, partitionId, offset });
    }

    async getMessageOffset(streamId: number, topicId: number, params: Record<string, unknown>): Promise<any[]> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/messages/offsets`, 'GET', undefined, params);
    }

    async getConsumerGroups(streamId: number, topicId: number): Promise<any[]> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/consumer-groups`, 'GET');
    }

    async getConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<any[]> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`, 'GET');
    }

    async postConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<void> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/consumer-groups`, 'POST', { consumerGroupId});
    }

    async deleteConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<void> {
        return this.sendHttpRequest(`/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`, 'DELETE');
    }
    async createStream(request: Stream): Promise<void> {
        return this.sendHttpRequest('/streams', 'POST', request)
    }

    async createTopic(topic: Topic): Promise<void> {
        return this.sendHttpRequest(`/streams/${topic.topicId}/topics`, 'POST', topic);
    }
}
