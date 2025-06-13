import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TaskManagerComponent } from '@perch/features-task';

@Component({
  imports: [TaskManagerComponent, RouterModule, LoadingBarHttpClientModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'perch-web';
}
