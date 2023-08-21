import { v4 as uuidv4 } from 'uuid';

enum PartitioningKind {
    Balanced = "Balanced",
    PartitionId = "partition_id",
    MessageKey = "MessageKey"
}

export function partitionId(value: number): { kind: PartitioningKind, length: number, value: string } {
    const valBytes = Buffer.alloc(4);
    valBytes.writeInt32LE(value, 0);
    return {
        kind: PartitioningKind.PartitionId,
        length: 4,
        value: valBytes.toString('base64')
    };
}

function entityIdString(value: string): { kind: PartitioningKind, length: number, value: Buffer } {
    if (value.length === 0 || value.length > 255) {
        throw new Error("Value has incorrect size, must be between 1 and 255");
    }
    return {
        kind: PartitioningKind.MessageKey,
        length: value.length,
        value: Buffer.from(value, 'utf-8')
    };
}

function entityIdBytes(value: Buffer): { kind: PartitioningKind, length: number, value: Buffer } {
    if (value.length === 0 || value.length > 255) {
        throw new Error("Value has incorrect size, must be between 1 and 255");
    }
    return {
        kind: PartitioningKind.MessageKey,
        length: value.length,
        value: value
    };
}

function entityIdInt(value: number): { kind: PartitioningKind, length: number, value: Buffer } {
    const valBytes = Buffer.alloc(4);
    valBytes.writeInt32LE(value, 0);
    return {
        kind: PartitioningKind.MessageKey,
        length: 4,
        value: valBytes
    };
}

function entityIdUlong(value: bigint): { kind: PartitioningKind, length: number, value: Buffer } {
    const valBytes = Buffer.alloc(8);
    valBytes.writeBigUInt64LE(value);
    return {
        kind: PartitioningKind.MessageKey,
        length: 8,
        value: valBytes
    };
}

function entityIdGuid(value: string): { kind: PartitioningKind, length: number, value: Buffer } {
    const valBytes = Buffer.from(value, 'hex'); // Assuming the GUID is provided as a hex string
    return {
        kind: PartitioningKind.MessageKey,
        length: 16,
        value: valBytes
    };
}
