
import {fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { Directive, ElementRef, HostListener, 
	Input, Output, OnInit, EventEmitter} from '@angular/core';

@Directive({
	selector: '[app-resize]'
})
export class ResizeDirective implements OnInit {
	startWidth:number;
	startHeight:number;

	mousemoveEvent: Subscription;

	@Input('resizeMe') elementToResize:HTMLElement;
	@Input() maxSize:number;
	@Input() minSize:number;
	@Input() barWidth:number;
	@Input() vertical:boolean;

	@Output() mouseMoved = new EventEmitter();
	
	constructor(private el:ElementRef) { }

	//the barWidth property is deemed useless until this comment is removed
	//css-grid controls the width of the bar (column)
	ngOnInit() {
		this.el.nativeElement.style.cursor = 'col-resize';
		this.el.nativeElement.style.width = this.barWidth + 'px';
	}

	@HostListener('mousedown', ['$event']) 
	onMouseDown(event: MouseEvent) {
		event.preventDefault();
		this.startWidth = this.elementToResize.clientWidth;
		this.startHeight = this.elementToResize.clientHeight;

		this.mousemoveEvent = observableFromEvent(document, 'mousemove')
															.subscribe(this.onMouseMove.bind(this));
	}

	@HostListener('document:mouseup') 
	onMouseUp() {
		if(this.mousemoveEvent)
			this.mousemoveEvent.unsubscribe();
	}

	onMouseMove(event: MouseEvent) {
			let newNum:number = null, diff:number = 0;
			if(this.vertical) {
				diff = event.clientX - this.startWidth;
				newNum = this.startWidth + diff;
				if(newNum > this.minSize && newNum < this.maxSize)
					this.elementToResize.style.width = newNum + 'px';
			}
			else {
				diff = event.clientY - this.startHeight;
				newNum = this.startHeight + diff;
				if(newNum > this.minSize && newNum < this.maxSize)
					this.elementToResize.style.height = newNum + 'px';
			}
	}
}