import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoInterface } from './interfaces/video.interface';

export function IP() {
  return localStorage.getItem('localStreamingIp');
}

@Injectable({providedIn: 'root'})
export class LocalStreamingService {
  private readonly urlServer: string;
  
  constructor(private http: HttpClient) {
    this.urlServer = `http://${IP()}:3000`;
  }
  
  public getLista(params: any) {
    return this.http.get<VideoInterface[]>(`http://${IP()}:3000/videos`, {params});
  }
  
  public getPorId(id: number) {
    return this.http.get<VideoInterface>(`http://${IP()}:3000/video/${id}`);
  }
}
