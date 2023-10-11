import { Topic } from './Topic';

export interface CreateStreamRequest {
    streamId: number;
    name: string;
}

export interface Stream {
    id: number;
    name: string;
    size_bytes: number;
    messages_count: number;
    topics_count: number;
}

export interface StreamDetails extends Stream {
    topics: Topic[];
}
