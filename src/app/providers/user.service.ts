import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	name: ReplaySubject<string> = new ReplaySubject(1);
	isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private electronService: AppElectronService
		) {
			this.electronService.listen(EventType.USERS_NAME, this.setMyName.bind(this)) 
		}

	setMyName(event: string, data: any) {
		console.log('received users-name', data);
		this.name.next(data);
	}

	isLoggedOut() {
		this.isLoggedIn.next(false);
	}

	login() {
		this.electronService.send('login');
	}
}