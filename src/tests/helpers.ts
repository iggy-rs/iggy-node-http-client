import { v4 as uuidv4 } from 'uuid';

enum PartitioningKind {
    PartitionId = "PartitionId"
}


function createDummyObject(): any {
    return { key: "value" };
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
            id: uuidv4(),
            payload: Buffer.from(JSON.stringify(createDummyObject()), 'utf-8')
        },
        {
            id: uuidv4(),
            payload: Buffer.from(JSON.stringify(createDummyObject()), 'utf-8')
        }
    ];

    return {
        partitioning: partitioning,
        messages: messages
    };
}

