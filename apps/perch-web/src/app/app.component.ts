import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskManagerComponent } from '@perch/features-task';

@Component({
  imports: [TaskManagerComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'perch-web';
}
