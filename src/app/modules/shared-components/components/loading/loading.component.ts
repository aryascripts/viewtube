import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading',
	template: `
		<section class='loading'>
			<section class="text">{{ text }}</section>
			<span class="loading-anim"></span>
		</section>
	`,
	styleUrls: ['loading.component.scss']
})
export class LoadingComponent {

	@Input() text: string

	constructor() { }

}