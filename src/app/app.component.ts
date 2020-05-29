import { Component } from '@angular/core';
import { UserService } from './providers/user.service';
import { NotificationService } from './providers/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private userService: UserService,
    public notificationService: NotificationService
    ) {
    this.userService.login();
  }
}
