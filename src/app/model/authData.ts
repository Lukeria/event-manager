import { UserInfo } from "./userInfo"

export interface AuthDataRequest {
    login: string,
    password: string
}

export interface AuthDataResponse {
    token: string,
    userInfo: UserInfo
}