export interface Event {
    id: number,
    name: string,
    description: string | null,
    type: EventType,
    date: Date,
    time: string | null,
    uuid: string,
    place: string,
    plannedBudgetAmount: string,
    requestId: number
}

export interface EventType {
    id: string,
    name: string,
    description: string | null
}