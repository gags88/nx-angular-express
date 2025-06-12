import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
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
import { TaskService } from '@perch/task-data-access';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  providers: [TaskService],
  templateUrl: './task-manager.component.html',
})
export class TaskManagerComponent implements OnInit {
  tasks = signal<Task[]>([]);
  taskForm!: FormGroup;
  readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskService
      .loadTasks()
      .pipe(
        tap((tasks) => {
          this.tasks.set(tasks);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      this.taskService
        .addTask(this.taskForm.value)
        .pipe(
          tap((newTask) => {
            this.tasks.update((task) => [...task, newTask]);
            this.taskForm.reset();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  onToggleComplete(id: number) {
    this.taskService
      .toggleComplete(id.toString())
      .pipe(
        tap(() => {
          this.tasks.update((tasks) =>
            tasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            )
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onDeleteTask(id: number) {
    this.taskService
      .deleteTask(id.toString())
      .pipe(
        tap(() => {
          this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
