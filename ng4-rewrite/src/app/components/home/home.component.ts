import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	template: '<h1>Hello World</h1>',
	styles: [`
		h1 { font-size: 20px; };
	`]
})
export class HomeComponent implements OnInit {


	ngOnInit() { }
}