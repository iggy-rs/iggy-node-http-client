export interface TopicRequest {
    topicId: number
    name: string
    partitionsCount: number
}


export interface Topic {
    id: number
    name: number
    size_bytes: number
    messages_count: number
    partitions_count: number
}
