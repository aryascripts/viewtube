import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-caret',
  templateUrl: './caret.component.html',
  styleUrls: ['./caret.component.scss']
})
export class CaretComponent implements OnInit {

  @Output() toggle: EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Input() open: boolean;
  @Input() caretStyle: any;
  constructor() {}
  ngOnInit() {}

  getCaretClass() {
		return {
			'closed': !this.open
		}
	}


}
