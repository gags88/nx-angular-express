import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { Task } from '@perch/shared-types';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'lib-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzDividerModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    TaskListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-manager.component.html',
})
export class TaskManagerComponent implements OnInit {
  tasks = signal<Task[]>([]);
  taskForm!: FormGroup;
  private idCounter = 0;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: ++this.idCounter,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description || '',
        completed: false,
      };
      this.tasks.update((tasks) => [...tasks, newTask]);
      this.taskForm.reset();
    }
  }

  onToggleComplete(id: number) {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  onDeleteTask(id: number) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
