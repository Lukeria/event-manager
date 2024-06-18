import { RVSPStatus } from "./guest";

export interface RvspInfo {
    guestUuid: string;
    name: string;
    surname: string;
    rvspStatus: RVSPStatus
}