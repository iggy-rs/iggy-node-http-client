import { v4 as uuidv4 } from 'uuid';

enum PartitioningKind {
    PartitionId = "partition_id"
}


function createDummyObject(): any {
    return { key: "value" };
}


function generateRandomBase64Content(byteLength: number) {
    const randomBuffer = Buffer.alloc(byteLength);
    for (let i = 0; i < byteLength; i++) {
        randomBuffer[i] = Math.floor(Math.random() * 256);
    }
    return randomBuffer.toString('base64');
}
export function createMessageSendRequest() {
    const val = Math.floor(Math.random() * 68) + 1;
    const valBytes = Buffer.alloc(4);
    valBytes.writeInt32LE(val, 0);

    const partitioning = {
        kind: PartitioningKind.PartitionId,
        length: 4,
        value: valBytes.toString('base64')
    };

    const messages = [
        {
            id: 0,
            payload: generateRandomBase64Content(4)
        },
        {
            id: 0,
            payload: generateRandomBase64Content(4)
        }
    ];

    return {
        partitioning: partitioning,
        messages: messages
    };
}

