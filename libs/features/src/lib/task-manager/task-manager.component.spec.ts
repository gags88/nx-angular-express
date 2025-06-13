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
  });

  describe('#addTask', () => {
    it('should not add a task when form is invalid', () => {
      component.taskForm.setValue({ title: '', description: '' });
      component.addTask();
      expect(component.tasks().length).toBe(0);
    });
  });
});
