import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { isAxiosError } from 'axios';

import { HttpClient } from '../HttpClient/HttpClient';
import { TransportType } from '../types/TransportType';
import { CreateStreamRequest } from '../types/Stream';

import { createMessageSendRequest } from './helpers';

const STREAM_ID: number = 1;
const TOPIC_ID: number = 1;
const PARTITION_ID: number = 1;
const PARTITIONS_COUNT: number = 3;
const CONSUMER_ID: number = 1;
const CONSUMER_KIND: (typeof TransportType)[keyof typeof TransportType] =
    TransportType.HTTP;
const STREAM_NAME: string = 'test-stream';
const TOPIC_NAME: string = 'test-topic';
const CONSUMER_GROUP_ID: number = 1;
const MESSAGES_COUNT: number = 10;

describe('System_Scenario HTTP', () => {
    let container: StartedTestContainer;
    let httpClient: HttpClient;
    beforeAll(async () => {
        container = await new GenericContainer('iggyrs/iggy:latest')
            .withExposedPorts(3000)
            .withWaitStrategy(Wait.forListeningPorts())
            .start();
        httpClient = new HttpClient(
            `http://localhost:${container.getMappedPort(3000)}`
        );
    }, 15000);

    afterAll(async () => {
        if (container) {
            await container.stop();
        }
    });

    describe('Users', () => {
        it('should allow to login', async () => {
            const response = await httpClient.login('iggy', 'iggy');
            expect(response.token).toBeTruthy();
            expect(response.user_id).toEqual(1);
        });
    });

    describe('Create and validate streams', () => {
        afterAll(async () => {
            await httpClient.deleteStream(STREAM_ID);
            await httpClient.deleteTopic(STREAM_ID, TOPIC_ID);
        });
        it('Ensure that streams does not exists', async () => {
            const streams = await httpClient.getStreams();
            expect(streams).toHaveLength(0);
        });
        it('Create and validate stream', async () => {
            const createStream: CreateStreamRequest = {
                streamId: STREAM_ID,
                name: STREAM_NAME,
            };
            await httpClient.createStream(createStream);
            const streams = await httpClient.getStreams();
            expect(streams).toHaveLength(1);
            expect(streams[0].id).toEqual(STREAM_ID);
            expect(streams[0].name).toEqual(STREAM_NAME);
            expect(streams[0].topics_count).toEqual(0);
            expect(streams[0].size_bytes).toEqual(0);
            expect(streams[0].messages_count).toEqual(0);

            // Get streamById details by ID
            const streamById = await httpClient.getStream(STREAM_ID);
            expect(streamById.name).toEqual(STREAM_NAME);
            expect(streamById.size_bytes).toEqual(0);
            expect(streamById.messages_count).toEqual(0);
            expect(streamById.topics_count).toEqual(0);
            expect(streamById.id).toEqual(STREAM_ID);

            // Get stream details by name
            const streamByName = await httpClient.getStream(STREAM_ID);
            expect(streamByName.name).toEqual(STREAM_NAME);
            expect(streamByName.size_bytes).toEqual(0);
            expect(streamByName.messages_count).toEqual(0);
            expect(streamByName.topics_count).toEqual(0);
            expect(streamByName.id).toEqual(STREAM_ID);
            // Try to create the stream with the same ID but the different name and validate that it fails
            try {
                await httpClient.createStream({
                    ...createStream,
                    name: createStream.name + '2',
                });
            } catch (error) {
                if (isAxiosError(error) && error.response) {
                    expect(error.response.status).toBe(400);
                    expect(error.response.data.code).toBe(
                        'stream_id_already_exists'
                    );
                } else {
                    fail('Expected an Axios error with a response');
                }
            }
            // Try to create the stream with the same name but the different ID and validate that it fails
            try {
                await httpClient.createStream({
                    ...createStream,
                    streamId: createStream.streamId + 1,
                });
            } catch (error) {
                if (isAxiosError(error) && error.response) {
                    expect(error.response.status).toBe(400);
                    expect(error.response.data.code).toBe(
                        'stream_name_already_exists'
                    );
                } else {
                    fail('Expected an Axios error with a response');
                }
            }
        });
    });
    describe('Create and validate topics', () => {
        beforeAll(async () => {
            await httpClient.createStream({
                streamId: STREAM_ID,
                name: STREAM_NAME,
            });
            const createTopic = {
                streamId: STREAM_ID,
                topicId: TOPIC_ID,
                name: TOPIC_NAME,
                partitionsCount: PARTITIONS_COUNT,
            };
            await httpClient.createTopic(createTopic);
        });
        it('Get topics', async () => {
            const topics = await httpClient.getTopics(STREAM_ID);
            expect(topics).toHaveLength(1);
            expect(topics[0].id).toEqual(TOPIC_ID);
            expect(topics[0].name).toEqual(TOPIC_NAME);
            expect(topics[0].partitions_count).toEqual(PARTITIONS_COUNT);
            expect(topics[0].size_bytes).toEqual(0);
            expect(topics[0].messages_count).toEqual(0);
        });
        it('Get topic detail by ID', async () => {
            const topic = await httpClient.getTopic(STREAM_ID, TOPIC_ID);
            expect(topic.id).toEqual(TOPIC_ID);
            expect(topic.name).toEqual(TOPIC_NAME);
            expect(topic.partitions_count).toEqual(PARTITIONS_COUNT);
            expect(topic.size_bytes).toEqual(0);
            expect(topic.messages_count).toEqual(0);
        });
        it('Get topic detail by name', async () => {
            const topic = await httpClient.getTopic(STREAM_ID, TOPIC_NAME);
            expect(topic.id).toEqual(TOPIC_ID);
            expect(topic.name).toEqual(TOPIC_NAME);
            expect(topic.partitions_count).toEqual(PARTITIONS_COUNT);
            expect(topic.size_bytes).toEqual(0);
            expect(topic.messages_count).toEqual(0);
        });
        it('Get stream details and validate that created topic exists', async () => {
            const stream = await httpClient.getStream(STREAM_ID);
            const topic = await httpClient.getTopic(STREAM_ID, TOPIC_ID);
            expect(stream.id).toEqual(STREAM_ID);
            expect(stream.topics_count).toEqual(1);
            expect(stream.messages_count).toEqual(0);
            const streamTopic = stream.topics[0];
            expect(streamTopic.id).toEqual(TOPIC_ID);
            expect(streamTopic.name).toEqual(TOPIC_NAME);
            expect(streamTopic.partitions_count).toEqual(
                topic.partitions_count
            );
            expect(streamTopic.size_bytes).toEqual(0);
            expect(streamTopic.messages_count).toEqual(0);
        });
    });
    describe.skip('messages', () => {
        beforeAll(async () => {
            await httpClient.createStream({
                streamId: STREAM_ID,
                name: STREAM_NAME,
            });
            const createTopic = {
                streamId: STREAM_ID,
                topicId: TOPIC_ID,
                name: TOPIC_NAME,
                partitionsCount: 100,
            };
            await httpClient.createTopic(createTopic);
        });
        it('send messages', async () => {
            const serializedData = createMessageSendRequest();
            try {
                await httpClient.postMessage(
                    STREAM_ID,
                    TOPIC_ID,
                    serializedData
                );
            } catch (e) {
                console.log(e);
            }
        });
    });
});
