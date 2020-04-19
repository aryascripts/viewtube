import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppElectronService } from './electron.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	name: ReplaySubject<string> = new ReplaySubject(1);
	isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private electronService: AppElectronService
		) {
			this.electronService.listen('name', this.setMyName.bind(this))
		}

	setMyName(event: string, data: any) {
		this.name.next(data);
	}

	isLoggedOut() {
		this.isLoggedIn.next(false);
	}

	login() {
		this.electronService.send('login');
	}

}