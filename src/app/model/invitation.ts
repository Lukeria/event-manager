import { Guest } from "./guest";

export interface Invitation {
    id: number;
    header: string;
    eventDescription: string;
    eventDate: string;
    eventTime: string;
    eventPlace: string;
    eventPlaceAddress: string;
    imageUrl: string;
    guest: Guest;
}