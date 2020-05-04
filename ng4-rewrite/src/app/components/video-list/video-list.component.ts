import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../../models/Video';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  @Input() videos: Video[];

  constructor() { }
  ngOnInit() {}

}
