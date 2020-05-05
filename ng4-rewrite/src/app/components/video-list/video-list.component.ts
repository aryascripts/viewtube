import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../models/Video';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  @Input() videos: Video[];
  @Output() videoClicked: EventEmitter<Video> = new EventEmitter();

  constructor() { }
  ngOnInit() {}

  handleVideoClick(video: Video) {
    this.videoClicked.emit(video);
  }

}
