import axios from 'axios';

import {CreateStreamRequest} from "../types/Stream";
import {Topic, TopicRequest} from "../types/Topic";
import {Stream} from "../types/Stream";
import {ApiClient} from "../api/apiClient";

export class HttpClient {
    /**
     * The baseAddress to use
     */
    private readonly apiClient: ApiClient
    constructor(baseAddress: string) {
        this.apiClient = new ApiClient(baseAddress);
    }


    async getClients(): Promise<any[]> {
        return this.apiClient.getMany('/clients');
    }

    async getClient(clientId: number): Promise<any> {
        return this.apiClient.getOne(`/clients/${clientId}`);
    }

    async ping(): Promise<string> {
        return this.apiClient.getOne('/ping');
    }

    async getStats(): Promise<Record<string, string | number>> {
        return this.apiClient.getOne('/stats');
    }

    async kill(): Promise<void> {
        return this.apiClient.post('/kill', {});
    }

    async getStreams(): Promise<Stream[]> {
        return this.apiClient.getMany('/streams');
    }

    async getStream(streamId: number): Promise<Stream> {
        return this.apiClient.getOne(`/streams/${streamId}`);
    }
    async createStream(data: CreateStreamRequest): Promise<void> {
        return this.apiClient.post('/streams', data)
    }

    async createTopic(data: TopicRequest): Promise<void> {
        return this.apiClient.post(`/streams/${data.topicId}/topics`, data);
    }
    async deleteStream(streamId: number): Promise<any> {
        return this.apiClient.delete(`/streams/${streamId}`);
    }

    async getTopics(streamId: number): Promise<Topic[]> {
        return this.apiClient.getMany(`/streams/${streamId}/topics`);
    }

    async getTopic(streamId: number, topicId: number): Promise<Topic> {
        return this.apiClient.getOne(`/streams/${streamId}/topics/${topicId}`);
    }

    async deleteTopic(streamId: number, topicId: number): Promise<void> {
        return this.apiClient.delete(`/streams/${streamId}/topics/${topicId}`);
    }

    async postMessage(streamId: number, topicId: number, message: any): Promise<any> {
        return this.apiClient.post(`/streams/${streamId}/topics/${topicId}/messages`, { message });
    }

    async getMessage(streamId: number, topicId: number, params: Record<string, unknown>): Promise<any[]> {
        return this.apiClient.getOne(`/streams/${streamId}/topics/${topicId}/messages`);
    }

    async putMessageOffset(streamId: number, topicId: number, consumerId: number, partitionId: number, offset: number = 1): Promise<any> {
        return this.apiClient.put(`/streams/${streamId}/topics/${topicId}/messages/offsets`, 'PUT', { consumerId, partitionId, offset });
    }

    async getMessageOffset(streamId: number, topicId: number, params: Record<string, unknown>): Promise<any[]> {
        return this.apiClient.getOne(`/streams/${streamId}/topics/${topicId}/messages/offsets`);
    }

    async getConsumerGroups(streamId: number, topicId: number): Promise<any[]> {
        return this.apiClient.getMany(`/streams/${streamId}/topics/${topicId}/consumer-groups`);
    }

    async getConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<any[]> {
        return this.apiClient.getOne(`/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`);
    }

    async postConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<void> {
        return this.apiClient.post(`/streams/${streamId}/topics/${topicId}/consumer-groups`, { consumerGroupId});
    }

    async deleteConsumerGroup(streamId: number, topicId: number, consumerGroupId: number): Promise<void> {
        return this.apiClient.delete(`/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`);
    }
}

