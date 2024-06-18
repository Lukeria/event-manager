import { EventType } from "./event";
import { UserInfo } from "./userInfo";

export interface RequestData {
    id: number,
    eventName: string,
    eventDescription: string | null,
    type: EventType,
    eventDate: Date,
    eventTime: string | null,
    eventPlace: string,
    status: RequestStatus,
    organizer: UserInfo;
    participant: UserInfo;
}

export enum RequestStatus {
    Created = 'CREATED',
    Declined = 'DECLINED'
}