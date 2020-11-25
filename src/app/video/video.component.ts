import { Component, OnInit } from '@angular/core';
import { IP } from '../core/local-streaming.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.css']
})
export class VideoComponent implements OnInit {
  public src: string;
  public type: string;
  
  constructor(
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit() {
    this.activatedRoute
        .paramMap
        .subscribe(async param => {
          const filename = param.get('filename');
          const id = param.get('id');
          this.src = `http://${IP}:3000/video/${id}/${filename}`;
          this.type = `video/${filename.split('.')[1]}`;
        });
  }
}
