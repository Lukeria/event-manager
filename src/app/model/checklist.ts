export interface Checklist {
    id: number,
    name: string,
    description: string,
    taskList: Task[]
}

export interface Task {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    deadline: Date;
    isChecked: boolean;
    checklistId: number
}

export enum TaskStatus {
    Done = 'DONE',
    Progress = 'PROGRESS'
}

export interface ChecklistProgress {
    checklist: Checklist,
    valueNow: number,
    valueMax: number
}
