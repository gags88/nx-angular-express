import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '@perch/shared-types';
import { of } from 'rxjs';

@Injectable()
export class TaskService {
  private http = inject(HttpClient);

  loadTasks() {
    return this.http.get<Task[]>('/api/tasks');
  }

  addTask(task: Omit<Task, 'id'>) {
    return this.http.post<Task>('/api/tasks', task);
  }

  toggleComplete(id: string) {
    if (!id) {
      return of({});
    }
    return this.http.patch(`/api/tasks/${id}/toggle`, {});
  }

  deleteTask(id: string) {
    if (!id) {
      return of({});
    }
    return this.http.delete(`/api/tasks/${id}`);
  }
}
