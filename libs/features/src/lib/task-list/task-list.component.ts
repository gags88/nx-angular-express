import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@perch/shared-types';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'lib-task-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzButtonModule,
  ],
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  readonly tasks = input.required<Task[]>();
  readonly deleteTask = output<number>();
  readonly toggleComplete = output<number>();
  readonly destroyRef = inject(DestroyRef);
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    effect(() => {
      const tasks = this.tasks();
      this.syncFormArrayWithTasks(tasks);
    });
  }

  get checkboxes(): FormArray {
    return this.form.get('checkboxes') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      checkboxes: this.fb.array([]),
    });
    this.syncFormArrayWithTasks(this.tasks());
    this.checkboxes.valueChanges
      .pipe(
        tap((values: boolean[]) => {
          values.forEach((checked, i) => {
            if (checked !== this.tasks()[i].completed) {
              this.toggleComplete.emit(this.tasks()[i].id);
            }
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onToggle(taskId: number): void {
    this.toggleComplete.emit(taskId);
  }

  private syncFormArrayWithTasks(tasks: Task[]) {
    const controls = this.checkboxes.controls;
    const taskCount = tasks.length;
    while (controls.length < taskCount) {
      this.checkboxes.push(new FormControl(false));
    }
    while (controls.length > taskCount) {
      this.checkboxes.removeAt(controls.length - 1);
    }
    tasks.forEach((task, index) => {
      this.checkboxes.at(index).setValue(task.completed, { emitEvent: false });
    });
  }
}
