import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { AppElectronService } from './electron.service';
import { EventType } from '../models/Events';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	name: BehaviorSubject<string> = new BehaviorSubject<string>('');
	isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private electronService: AppElectronService
		) {
			this.electronService.listen(EventType.USERS_NAME, this.setMyName.bind(this)) 
		}

	setMyName(event: string, data: any) {
		console.log('got name,', event, data);
		this.name.next(data);
	}

	isLoggedOut() {
		this.isLoggedIn.next(false);
	}

	login() {
		this.electronService.send('login');
	}
}