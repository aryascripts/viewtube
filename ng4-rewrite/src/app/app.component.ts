import { Component } from '@angular/core';
import { AppElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';
import { UserService } from './providers/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService: UserService) {
    console.log('AppConfig', AppConfig);
    this.userService.login();
  }
}
