import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from './../../providers/playlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public playlistService: PlaylistsService) {}

  ngOnInit() {

  }

}
