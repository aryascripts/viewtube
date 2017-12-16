import { Component } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'playlist',
	templateUrl: './playlist.component.html',
	styleUrls: ['./../../../assets/css/style.css']
})

export class PlaylistComponent {

	id:string;

	constructor(private shared:SharedService, private route:ActivatedRoute) {

		this.id = this.route.snapshot.paramMap.get('id');

	}


}