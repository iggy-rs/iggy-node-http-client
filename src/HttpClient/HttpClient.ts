import { CreateStreamRequest, StreamDetails, Stream } from '../types/Stream';
import type { Topic, TopicRequest } from '../types/Topic';
import { ApiClient } from '../api/apiClient';
import type { LoginResponse } from '../types/Login';

export class HttpClient {
    /**
     * The baseAddress to use
     */
    private readonly apiClient: ApiClient;
    constructor(baseAddress: string) {
        this.apiClient = new ApiClient(baseAddress);
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        return this.apiClient.post('/users/login', { username, password });
    }

    async getClients(): Promise<unknown[]> {
        return this.apiClient.getMany('/clients');
    }

    async getClient(clientId: number): Promise<unknown> {
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

    async getStream(streamIdOrName: string | number): Promise<StreamDetails> {
        return this.apiClient.getOne(`/streams/${streamIdOrName}`);
    }
    async createStream(data: CreateStreamRequest): Promise<void> {
        return this.apiClient.post('/streams', data);
    }

    async createTopic(data: TopicRequest): Promise<void> {
        return this.apiClient.post(`/streams/${data.topicId}/topics`, data);
    }
    async deleteStream(streamId: number): Promise<unknown> {
        return this.apiClient.delete(`/streams/${streamId}`);
    }

    async getTopics(streamId: number): Promise<Topic[]> {
        return this.apiClient.getMany(`/streams/${streamId}/topics`);
    }

    async getTopic(
        streamId: number,
        topicIdOrName: number | string
    ): Promise<Topic> {
        return this.apiClient.getOne(
            `/streams/${streamId}/topics/${topicIdOrName}`
        );
    }

    async deleteTopic(streamId: number, topicId: number): Promise<void> {
        return this.apiClient.delete(`/streams/${streamId}/topics/${topicId}`);
    }

    async postMessage(
        streamId: number,
        topicId: number,
        payload: unknown
    ): Promise<void> {
        return this.apiClient.post(
            `/streams/${streamId}/topics/${topicId}/messages`,
            payload
        );
    }

    async getMessage(
        streamId: number,
        topicId: number,
        params: Record<string, unknown>
    ): Promise<unknown[]> {
        return this.apiClient.getOne(
            `/streams/${streamId}/topics/${topicId}/messages`
        );
    }

    async putMessageOffset(
        streamId: number,
        topicId: number,
        consumerId: number,
        partitionId: number,
        offset: number = 1
    ): Promise<unknown> {
        return this.apiClient.put(
            `/streams/${streamId}/topics/${topicId}/messages/offsets`,
            'PUT',
            { consumerId, partitionId, offset }
        );
    }

    async getMessageOffset(
        streamId: number,
        topicId: number,
        params: Record<string, unknown>
    ): Promise<unknown[]> {
        return this.apiClient.getOne(
            `/streams/${streamId}/topics/${topicId}/messages/offsets`
        );
    }

    async getConsumerGroups(
        streamId: number,
        topicId: number
    ): Promise<unknown[]> {
        return this.apiClient.getMany(
            `/streams/${streamId}/topics/${topicId}/consumer-groups`
        );
    }

    async getConsumerGroup(
        streamId: number,
        topicId: number,
        consumerGroupId: number
    ): Promise<unknown[]> {
        return this.apiClient.getOne(
            `/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`
        );
    }

    async postConsumerGroup(
        streamId: number,
        topicId: number,
        consumerGroupId: number
    ): Promise<void> {
        return this.apiClient.post(
            `/streams/${streamId}/topics/${topicId}/consumer-groups`,
            { consumerGroupId }
        );
    }

    async deleteConsumerGroup(
        streamId: number,
        topicId: number,
        consumerGroupId: number
    ): Promise<void> {
        return this.apiClient.delete(
            `/streams/${streamId}/topics/${topicId}/consumer-groups/${consumerGroupId}`
        );
    }
}
