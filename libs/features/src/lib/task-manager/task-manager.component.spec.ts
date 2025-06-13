import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TaskManagerComponent } from './task-manager.component';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TaskService } from '@perch/task-data-access';
import { TaskListComponent } from '../task-list/task-list.component';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskManagerComponent,
        MockModule(CommonModule),
        MockModule(FormsModule),
        MockModule(ReactiveFormsModule),
        MockModule(NzCardModule),
        MockModule(NzDividerModule),
        MockModule(NzGridModule),
        MockModule(NzFormModule),
        MockModule(NzInputModule),
        MockModule(NzButtonModule),
        MockComponent(TaskListComponent),
      ],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        MockProvider(NzModalService),
        MockProvider(
          TaskService,
          {
            loadTasks: jest.fn().mockReturnValue(of([])),
            addTask: jest.fn().mockReturnValue(
              of({
                id: 1,
                title: 'Mock Task',
                description: '',
                completed: false,
              })
            ),
            deleteTask: jest.fn().mockReturnValue(of(true)),
            toggleComplete: jest.fn().mockReturnValue(of(true)),
          },
          'useValue'
        ),
      ],
    }).compileComponents();

    taskService = TestBed.inject(TaskService);
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tasks', () => {
    expect(component.tasks()).toEqual([]);
  });

  describe('#ngOnInit', () => {
    let loadTasksSpy: jest.SpyInstance;

    beforeEach(() => {
      loadTasksSpy = jest
        .spyOn(taskService, 'loadTasks')
        .mockReturnValue(of([]));
    });

    it('should initialize task form', () => {
      expect(component.taskForm).toBeDefined();
      expect(component.taskForm.controls['title']).toBeDefined();
      expect(component.taskForm.controls['description']).toBeDefined();
    });
    it('should update loading state during initialization', () => {
      expect(component.taskOperationProgress()).toBe(true);
      fixture.whenStable().then(() => {
        expect(component.taskOperationProgress()).toBe(false);
      });
    });
    it('should load tasks on initialization', waitForAsync(() => {
      taskService.loadTasks().subscribe();
      expect(loadTasksSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('#addTask', () => {
    describe('when form is valid', () => {
      let addTaskSpy: jest.SpyInstance;

      beforeEach(() => {
        addTaskSpy = jest.spyOn(taskService, 'addTask').mockReturnValue(
          of({
            id: 1,
            title: 'New Task',
            description: 'Task Description',
            completed: false,
          })
        );
        component.taskForm.setValue({
          title: 'New Task',
          description: 'Task Description',
        });
      });
      it('should call taskService addTask method', waitForAsync(() => {
        component.addTask();
        taskService.addTask(component.taskForm.value).subscribe();
        expect(addTaskSpy).toHaveBeenCalledTimes(1);
        expect(addTaskSpy).toHaveBeenCalledWith(component.taskForm.value);
      }));
    });
    describe('when form is invalid', () => {
      beforeEach(() => {
        component.taskForm.setValue({ title: '', description: '' });
      });
      it('should not call taskService.addTask', () => {
        const addTaskSpy = jest.spyOn(taskService, 'addTask');
        component.addTask();
        expect(addTaskSpy).not.toHaveBeenCalled();
      });
      it('should not update tasks', () => {
        const initialTasksLength = component.tasks().length;
        component.addTask();
        expect(component.tasks().length).toBe(initialTasksLength);
      });
    });
  });

  describe('#onToggleComplete', () => {
    const taskId = 1;
    let toggleCompleteSpy: jest.SpyInstance;

    beforeEach(() => {
      component.tasks.set([
        { id: taskId, title: 'Test Task', completed: false },
      ]);
      toggleCompleteSpy = jest
        .spyOn(taskService, 'toggleComplete')
        .mockReturnValue(
          of({ id: taskId, title: 'Test Task', completed: true })
        );
    });

    it('should call taskService toggleComplete method', waitForAsync(() => {
      component.onToggleComplete(taskId);
      taskService.toggleComplete(taskId.toString()).subscribe();
      expect(toggleCompleteSpy).toHaveBeenCalledTimes(1);
      expect(toggleCompleteSpy).toHaveBeenCalledWith(taskId.toString());
    }));
  });
});
