import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {firstValueFrom} from "rxjs";


class PlayControl {
  public current!: string;

  constructor(private client: HttpClient, private camera: string) {
  }

  getStartFrame(mils: number): Promise<any> {
    return firstValueFrom(
      this.client.get<{ file: string }>('/stream/' + this.camera + '/now/' + mils)
        .pipe(map(res => res.file)));
  }

  getNextFrame(before: number): Promise<string | undefined> {
    return firstValueFrom(
      this.client.get<{ file: string }>('/stream/' + this.camera + '/next/' + before)
        .pipe(map(res => res.file)));
  }

  init(startPoint: number): Promise<string> {
    return new Promise((resolve, error) => {
      this.getStartFrame(startPoint).then((file: string | undefined) => {
        // @ts-ignore
        this.current = file;
        // @ts-ignore
        setTimeout((z: any) => resolve(file), 1000);
      });
    });
  }

  nextFrame(): Promise<string> {
    return new Promise((resolve, error) => {
      const currentPoint = this.current.split('.')[0];
      this.getNextFrame(+currentPoint).then((file2: any) => {
        setTimeout((z: any) => resolve(file2), 2000);
        this.current = file2;
      });
    });
  }


}


@Component({
  selector: 'fui-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.css']
})
export class VideoStreamComponent implements OnInit, AfterViewInit {
  @ViewChild('myvideo1', {static: true})
  myvideo1!: ElementRef<any>;

  @ViewChild('myvideo2', {static: true})
  myvideo2!: ElementRef<any>;

  @ViewChild('srcz1', {static: true})
  srcz1!: ElementRef<any>;

  @ViewChild('srcz2', {static: true})
  srcz2!: ElementRef<any>;

  show1 = true;

  playController!: PlayControl;

  prefix!: string;

  dateTime!: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {


  }

  ngAfterViewInit(): void {
    this.myvideo1.nativeElement.addEventListener('ended', (z: any) => {
      this.show1 = false;
      this.playController.nextFrame().then(res => {
        this.myvideo1.nativeElement.src = this.prefix + res;
      });
      this.myvideo2.nativeElement.play();
    });

    this.myvideo2.nativeElement.addEventListener('ended', (z: any) => {
      this.show1 = true;
      this.playController.nextFrame().then(res => {
        this.myvideo2.nativeElement.src = this.prefix + res;
      });
      this.myvideo1.nativeElement.play();
    });
  }

  find() {
    this.playController.init(new Date(this.dateTime).getTime()).then(fileName => {
      const videoName = fileName;
      console.log('VIDEO_NAME', videoName);
      this.myvideo1.nativeElement.src = this.prefix + videoName;


      this.playController.nextFrame().then(res => {
        this.myvideo2.nativeElement.src = this.prefix + res;
      });
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const camera = params.camera;
      this.playController = new PlayControl(this.http, camera);
      this.prefix = '/videos/' + camera + '/';
    });
  }

  start() {
    this.myvideo1.nativeElement.play();
  }
}
