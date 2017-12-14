import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../providers/shared.service/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./../../../assets/css/style.css']
})
export class HomeComponent implements OnInit {    
    
    constructor(private shared:SharedService) { 
    }

    ngOnInit() {
    }

    removePlaylist(index) {
        console.log(index);
        this.shared.removeAtIndex(index);
    }
}
