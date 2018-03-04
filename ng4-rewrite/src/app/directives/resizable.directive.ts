import { Directive, ElementRef, HostListener, 
	Input, Output, OnInit, EventEmitter} from '@angular/core';

@Directive({
	selector: '[app-resize]'
})
export class ResizeDirective implements OnInit {
	dragging:boolean;
	startWidth:number;
	startHeight:number;

	@Input('resizeMe') elementToResize:HTMLElement;
	@Input() maxSize:number;
	@Input() minSize:number;
	@Input() barWidth:number;
	@Input() vertical:boolean;

	@Output() mouseMoved = new EventEmitter();
	

	constructor(private el:ElementRef) { }

	ngOnInit() {
		this.dragging = false;
		this.el.nativeElement.style.cursor = 'col-resize';
	}

	@HostListener('mousedown', ['$event']) 
	onMouseDown(event: MouseEvent) {
		event.preventDefault();
		this.startWidth = this.elementToResize.clientWidth;
		this.startHeight = this.elementToResize.clientHeight;
		this.dragging = true;
	}

	@HostListener('document:mouseup') 
	onMouseUp() {
		this.dragging = false;
	}

	@HostListener('document:mousemove', ['$event'])
	onMouseMove(event: MouseEvent) {
		if(this.dragging) {
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
}