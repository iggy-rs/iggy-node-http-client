import {HttpClient} from "../HttpClient/HttpClient";
import {GenericContainer, StartedTestContainer, Wait} from 'testcontainers'


describe('HttpClient', () => {
    let container: StartedTestContainer;
    let httpClient: HttpClient;
    beforeAll(async () => {
        container = await new GenericContainer("iggyrs/iggy:arm64")
            .withExposedPorts(3000)
            .withWaitStrategy(Wait.forLogMessage(`Starting HTTP API on: "0.0.0.0:3000"`))
            .start();
        httpClient = new HttpClient(`http://localhost:${container.getMappedPort(3000)}`);
    });

    afterAll(async () => {
        if (container) {
            await container.stop();
        }
    });

    it('should respond correctly', async () => {
        await httpClient.createStream({ streamId: 5, name: 'Test Stream' });
        const streams = await httpClient.getStreams();
        expect(streams).toHaveLength(1);
    });
});
