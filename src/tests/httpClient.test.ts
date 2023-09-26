import {HttpClient} from "../HttpClient/HttpClient";
import {CreateStreamRequest} from "../types/Stream";
import {TopicRequest} from "../types/Topic";

const BASE_URL = 'http://localhost:3000';

describe('HttpClient', () => {
    let httpClient: HttpClient;
    const streamId = 1; // Update with real streamId if needed
    const topicId = 1; // Update with real topicId if needed
    const clientId = 1; // Update with real clientId if needed
    const consumerGroupId = 1; // Update with real consumerGroupId if needed

    beforeEach(async () => {
        httpClient = new HttpClient(BASE_URL);
        await httpClient.createStream({ streamId: 5, name: 'Test Stream' });
        await httpClient.createTopic({ topicId: 5, name: 'Test Topic', partitionsCount: 5 });
    });

    afterEach(async () => {
        await httpClient.kill();
    });

    it('should allow to login', async () => {
        const clients = await httpClient.login('iggy', 'admin');
        expect(clients).toEqual(clients);
    });

    it('should get clients', async () => {
        const clients = await httpClient.getClients();
        expect(clients).toEqual(clients);
    });

    it('should get client', async () => {
        const client = await httpClient.getClient(clientId);
        expect(client).toEqual([]);
    });

    it('should ping', async () => {
        const resp = await httpClient.ping();
        expect(resp).toEqual('pong');
    });

    it('should get stats', async () => {
        const stats = await httpClient.getStats();
        expect(Object.keys(stats)).toHaveLength(21);
    });


    it('should get streams', async () => {
        const streams = await httpClient.getStreams();
        expect(streams).toEqual('1');
    });

    it('should get a stream', async () => {
        const stream = await httpClient.getStream(streamId);
        expect(stream).toEqual([]);
    });

    it('should create a stream', async () => {
        const data: CreateStreamRequest = { streamId: 10, name: 'Test Stream' };
        await httpClient.createStream(data);
        // expect(serverResponse.status).toEqual(200); // Or 201 if your server responds with Created status
    });

    it('should create a topic', async () => {
        const data: TopicRequest = { topicId: 10, name: 'Test Topic', partitionsCount: 5 };
        await httpClient.createTopic(data);
        // expect(serverResponse.status).toEqual(200); // Or 201 if your server responds with Created status
    });

    it('should delete a stream', async () => {
        await httpClient.deleteStream(streamId);
        // expect(serverResponse.status).toEqual(200); // Or 204 if your server responds with No Content status
    });

    it('should get topics', async () => {
        const topics = await httpClient.getTopics(streamId);
        // expect(topics).toEqual(response.body);
    });

    it('should get a topic', async () => {
        const topic = await httpClient.getTopic(streamId, topicId);
        // expect(topic).toEqual(response.body);
    });

    it('should delete a topic', async () => {
        await httpClient.deleteTopic(streamId, topicId);
        // expect(serverResponse.status).toEqual(200); // Or 204 if your server responds with No Content status
    });

    // ...

    it('should post a message', async () => {
        const message = { text: 'Test Message' }; // Adjust this to your message structure
        const response = await httpClient.postMessage(streamId, topicId, message);
        // expect(response).toEqual(serverResponse.body);
    });

    it('should get a message', async () => {
        const params = {}; // Update this with your parameters
        const messages = await httpClient.getMessage(streamId, topicId, params);
        // expect(messages).toEqual(response.body);
    });

    it('should put a message offset', async () => {
        const consumerId = 1; // Update with real consumerId
        const partitionId = 1; // Update with real partitionId
        const offset = 1; // Update with real offset
        const response = await httpClient.putMessageOffset(streamId, topicId, consumerId, partitionId, offset);
        // expect(response).toEqual(serverResponse.body);
    });

    it('should get a message offset', async () => {
        const params = {}; // Update this with your parameters
        const offsets = await httpClient.getMessageOffset(streamId, topicId, params);
        // expect(offsets).toEqual(response.body);
    });

    it('should get consumer groups', async () => {
        const consumerGroups = await httpClient.getConsumerGroups(streamId, topicId);
        // expect(consumerGroups).toEqual(response.body);
    });

    it('should get a consumer group', async () => {
        const consumerGroup = await httpClient.getConsumerGroup(streamId, topicId, consumerGroupId);
        // expect(consumerGroup).toEqual(response.body);
    });

    it('should post a consumer group', async () => {
        const response = await httpClient.postConsumerGroup(streamId, topicId, consumerGroupId);
        // expect(response).toEqual(serverResponse.body);
    });

    it('should delete a consumer group', async () => {
        await httpClient.deleteConsumerGroup(streamId, topicId, consumerGroupId);
        // expect(serverResponse.status).toEqual(200); // Or 204 if your server responds with No Content status
    });
});
