export interface Guest {
    id: number;
    name: string;
    surname: string;
    gender: string;
    rvspStatus: RVSPStatus;
    uuid: string;
    email: string;
}

export enum RVSPStatus {
    Confirmed = 'CONFIRMED',
    Declined = 'DECLINED',
    Unknown = 'UNDEFINED'
}