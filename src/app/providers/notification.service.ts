import { Injectable } from '@angular/core';

export interface Notification {
  title: string;
  message: string;
  actionText: string;
  action: Function;
  type: 'error' | 'warning' | 'normal'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification: Notification;

  constructor() {}

  openNotification (notification: Notification) {
    this.notification = notification;
  }
}
