import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UserService {
	name: ReplaySubject<string> = new ReplaySubject(1);
	isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

	setMyName(name: string) {
		this.name.next(name);
		this.isLoggedIn.next(true);
	}

	isLoggedOut() {
		this.isLoggedIn.next(false);
	}

}