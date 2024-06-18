import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from '../service/checklist.service';
import { Checklist, Task, TaskStatus } from '../model/checklist';
import { AppMessageService } from '../service/app-message.service';
import { TaskService } from '../service/task.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../service/date.service';
import { LocaleService } from '../service/locale.service';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrl: './checklists.component.css'
})
export class ChecklistsComponent implements OnInit {

  taskStatus = TaskStatus;
  eventUuid: string = '';
  checklists: Checklist[] = [];

  newChecklist = {} as Checklist;
  newTask = {} as Task;
  selectedDate?: NgbDateStruct;
  selectedTime?: string;

  constructor(private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private errorService: AppMessageService,
    private taskService: TaskService,
    private dateService: DateService,
    private localeService: LocaleService) {

  }

  ngOnInit(): void {
    this.eventUuid = this.route.snapshot.params['uuid'];
    this.getList();
  }

  private getList() {
    this.checklistService.getList(this.eventUuid).subscribe({
      next: (data) => {
        this.checklists = data;
        this.checklists.forEach(item => {
          item.taskList.forEach(task =>
            task.isChecked = (task.status === TaskStatus.Done)
          );
        });
      },
      error: (error) => {
        this.errorService.showFetchErrorMessageWithRedirect(error);
      }
    });
  }

  clearAddListForm() {
    this.newChecklist = {} as Checklist;
  }


  editChecklist(checklist: Checklist) {
    this.newChecklist.id = checklist.id;
    this.newChecklist.name = checklist.name;
    this.newChecklist.description = checklist.description;
  }

  onAddChecklistFormSubmit() {
    if (this.newChecklist.name !== undefined) {
      if (this.newChecklist.id !== undefined) {
        this.updateChecklist();
      } else {
        this.createChecklist();
      }
    }
  }

  private updateChecklist() {
    this.checklistService.update(this.eventUuid, this.newChecklist).subscribe({
      next: data => {
        const index = this.checklists.findIndex(item => item.id === data.id);
        this.checklists[index] = data;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  private createChecklist() {
    this.checklistService.create(this.eventUuid, this.newChecklist).subscribe({
      next: data => {
        this.checklists.push(data);
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  deleteChecklist(id: number) {
    this.checklistService.deleteById(this.eventUuid, id).subscribe({
      next: data => {
        this.checklists = this.checklists.filter(item => item.id !== id);
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  onTaskStatusChange(checklistId: number, task: Task) {
    this.taskService.updateStatus(this.eventUuid, checklistId, task).subscribe({
      next: (data) => {
        const checklistIndex = this.checklists.findIndex(item => item.id === checklistId);
        const checklist = this.checklists[checklistIndex];
        const index = checklist.taskList.findIndex(item => item.id === data.id);
        checklist.taskList[index].status = data.status;
      },
      error: (error) => {
        task.isChecked = !task.isChecked;
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  onDateChanged() {
    if (this.selectedDate != null) {
      if (this.selectedTime != null) {
        const time = this.dateService.convertTimeStringToObj(this.selectedTime);
        this.newTask.deadline = new Date(this.selectedDate?.year, this.selectedDate?.month - 1, this.selectedDate?.day, time?.hours, time?.minutes);
      } else {
        this.newTask.deadline = new Date(this.selectedDate?.year, this.selectedDate?.month - 1, this.selectedDate?.day, 12, 0);
      }
    }
  }

  deleteTask(checklistId: number, id: number) {
    this.taskService.deleteById(this.eventUuid, checklistId, id).subscribe({
      next: data => {
        const checklistIndex = this.checklists.findIndex(item => item.id === checklistId);
        const checklist = this.checklists[checklistIndex];
        checklist.taskList = checklist.taskList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  editTask(checklistId: number, task: Task) {
    this.newTask.id = task.id;
    this.newTask.name = task.name;
    this.newTask.description = task.description;
    this.newTask.deadline = task.deadline;
    this.newTask.status = task.status;
    this.newTask.checklistId = checklistId;
    this.selectedDate = this.dateService.convertDateToNgbDateStruct(task.deadline);
    this.selectedTime = this.dateService.convertDateToTimeString(task.deadline);
  }

  openAddTaskForm(checklistId: number) {
    this.clearAddTaskForm();
    this.newTask.checklistId = checklistId;
  }

  clearAddTaskForm() {
    this.newTask = {} as Task;
    this.selectedDate = {} as NgbDateStruct;
    this.selectedTime = undefined;
  }

  onAddTaskFormSubmit() {
    if (this.newTask.name !== undefined) {
      if (this.newTask.id !== undefined) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  private updateTask() {
    this.taskService.update(this.eventUuid, this.newTask.checklistId, this.newTask).subscribe({
      next: data => {
        const checklistIndex = this.checklists.findIndex(item => item.id === data.checklistId);
        const checklist = this.checklists[checklistIndex];
        const index = checklist.taskList.findIndex(item => item.id === data.id);
        checklist.taskList[index] = data;
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  private createTask() {
    this.taskService.create(this.eventUuid, this.newTask.checklistId, this.newTask).subscribe({
      next: data => {
        const checklistIndex = this.checklists.findIndex(item => item.id === data.checklistId);
        const checklist = this.checklists[checklistIndex];
        if (checklist.taskList == null) {
          checklist.taskList = [];
        }
        checklist.taskList.push(data);
      },
      error: (error) => {
        this.errorService.showProcessErrorMessageWithRedirect(error);
      }
    });
  }

  getTaskBg(task: Task): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    if (task.status === TaskStatus.Done) {
      return 'text-bg-success';
    } else if (this.isExpired(task.deadline)) {
      return 'text-bg-danger';
    }
    return 'd-none';
  }

  getTaskStatus(task: Task): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    const locale = this.localeService.getLocale();
    if (task.status === TaskStatus.Done) {
      if (locale === 'ru') {
        return 'Сделано';
      } else {
        return 'Done';
      }
    } else if (this.isExpired(task.deadline)) {
      if (locale === 'ru') {
        return 'Просрочено';
      } else {
        return 'Expired';
      }
    }
    return '';
  }

  isExpired(deadline: Date | string): boolean {
    const currentDate = new Date();
    return new Date(deadline) < currentDate;
  }
}
