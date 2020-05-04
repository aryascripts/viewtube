import { Component, OnInit, Input } from '@angular/core';
import { Playlist } from './../../models/Playlist';

@Component({
  selector: 'app-playlist-preview',
  templateUrl: './playlist-preview.component.html',
  styleUrls: ['./playlist-preview.component.scss']
})
export class PlaylistPreviewComponent implements OnInit {

  @Input() playlist: Playlist;

  constructor() { }
  ngOnInit() {}

}
