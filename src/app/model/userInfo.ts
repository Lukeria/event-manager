export interface UserInfo {
    id: number,
    name?: string,
    surname?: string,
    description?: string;
    email?: string;
    phone?: string;
    login?: string;
    password?: string;
    confirmPassword?: string;
    roleName?: string;
}

export interface Role {
    name: string,
    id: number,
    description: string
}

export interface ParticipantInvitationInfo {
    email: string,
    participantConfirmationLink: string,
}

export enum RoleNames {
    User = 'ROLE_USER',
    Organizer = 'ROLE_ORGANIZER'
}

