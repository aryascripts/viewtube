import { Component, OnInit } from '@angular/core';
import { NotificationService } from './../../providers/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  getColor() {
    let color = 'black';
    switch (this.notificationService.notification.type) {
      case 'error':
        return 'red';
      case 'warning':
        return '#f78623';
      default:
        return 'black';
    }
  }

  getBorderStyle() {
    return {
      'border-color': this.getColor()
    }
  }

  getButtonColor() {
    return {
      color: this.getColor()
    }
  }

  handleAction() {
    this.notificationService.notification.action();
    this.closeNotification();
  }

  closeNotification() {
    this.notificationService.notification = undefined;
  }

}
