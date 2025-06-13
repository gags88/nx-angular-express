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
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  providers: [NzModalService, TaskService],
  templateUrl: './task-manager.component.html',
})
export class TaskManagerComponent implements OnInit {
  tasks = signal<Task[]>([]);
  taskOperationProgress = signal<boolean>(false);
  taskForm!: FormGroup;
  readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService,
    private readonly modalService: NzModalService
  ) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });

    this.taskOperationProgress.set(true);
    this.taskService
      .loadTasks()
      .pipe(
        tap((tasks) => {
          this.tasks.set(tasks);
        }),
        finalize(() => {
          this.taskOperationProgress.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  addTask() {
    if (!this.taskForm.valid) {
      return;
    }
    this.taskOperationProgress.set(true);
    this.taskService
      .addTask(this.taskForm.value)
      .pipe(
        tap((newTask) => {
          this.tasks.update((task) => [...task, newTask]);
          this.taskForm.reset();
        }),
        finalize(() => {
          this.taskOperationProgress.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onToggleComplete(id: number) {
    this.taskOperationProgress.set(true);
    this.taskService
      .toggleComplete(id.toString())
      .pipe(
        tap((updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((task) =>
              task.id === updatedTask.id
                ? { ...task, completed: !task.completed }
                : task
            )
          );
        }),
        finalize(() => {
          this.taskOperationProgress.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onDeleteTask(id: number) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this task?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => this.deleteTask(id),
    });
  }

  deleteTask(id: number) {
    this.taskOperationProgress.set(true);
    this.taskService
      .deleteTask(id.toString())
      .pipe(
        tap(() => {
          this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
        }),
        finalize(() => {
          this.taskOperationProgress.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
