import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {

    
    constructor(private sharedService:SharedService) { 
    }

    ngOnInit() {
    }

}
