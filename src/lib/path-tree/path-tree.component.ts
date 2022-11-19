import {Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import {GraphItem, PathTreeCalculatorService} from "./path-tree-calculator.service";

@Component({
  selector: 'fui-path-tree',
  templateUrl: './path-tree.component.html',
  styleUrls: ['./path-tree.component.css']
})
export class PathTreeComponent implements OnInit, AfterViewInit {
  @Input()
  items!: GraphItem[];


  @Input()
  rootIds!: string[];


  rect!: { x: number, y: number };

  barHeight = 7;


  @ViewChild('canvas', {static: true})
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!:any;

  points!: any;
  currentKey!:any;

  titles:any = {};

  canvasWidth!: number;
  canvasHeight!: number;

  paddingLeftForText = 100;
  private ptc!: PathTreeCalculatorService;


  constructor() {

  }

  ngAfterViewInit(): void {
   // this.ptc = new PathTreeCalculatorService();
 //   this.ptc.lineHeight = 12;
    Object.keys(this.points).forEach(key => {
      const pint = this.points[key];
      this.ctx.fillStyle = 'gray';
      this.ctx.fillRect(this.canvasWidth - this.paddingLeftForText + pint.x - pint.long,
        this.canvasHeight + pint.y - this.ptc.lineHeight, pint.long, this.barHeight);
      this.ctx.fillText(this.titles[key].count + ' - ' + this.titles[key].name,
        this.canvasWidth - this.paddingLeftForText + pint.x + 3, this.canvasHeight + pint.y - 4);
    });
  }

  ngOnInit(): void {

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.items.forEach(item => {
      this.titles[item.id] = item;
    });

    const res = this.ptc.calcPoints(this.rootIds, this.items);
    this.points = res.items;
    this.rect = res.rect;
    this.canvasWidth = Math.abs(this.rect.x) + this.paddingLeftForText;
    this.canvasHeight = Math.abs(this.rect.y);


  }

  move($event: MouseEvent) {
    const xO = $event.offsetX;
    const yO = $event.offsetY;
    let current:any;
    Object.keys(this.points).forEach(key => {
      const pint = this.points[key];
      const realX = this.canvasWidth + pint.x - pint.long;
      const realX1 = pint.long + realX;
      const realY = this.canvasHeight + pint.y - this.ptc.lineHeight;
      const realY1 = realY + this.barHeight;
      if (xO > realX && realX1 > xO && yO > realY && realY1 > yO) {
        current = key;
      }
    });

    this.currentKey = current;

  }
}



