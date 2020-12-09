import { PLAYER_STATE } from './player.state';
import { MediaInterface } from './media-cast-player.component';

export class PlayerHandler {
  constructor(
    private target: any,
    private player: any,
    private currentMedia: MediaInterface
  ) {}
  
  public isPaused() {
    return this.target.isPaused();
  }
  
  public play() {
    if (
      this.player &&
      this.player.playerState !== PLAYER_STATE.PLAYING &&
      this.player.playerState !== PLAYER_STATE.PAUSED &&
      this.player.playerState !== PLAYER_STATE.LOADED
    ) {
      this.load(this.currentMedia);
      return;
    }
    
    this.target.play();
    if (this.player) {
      this.player.playerState = PLAYER_STATE.PLAYING;
    }
  }
  
  public pause() {
    if (
      this.player &&
      this.player.playerState !== PLAYER_STATE.PLAYING
    ) {
      return;
    }
    
    this.target.pause();
    if (this.player) {
      this.player.playerState = PLAYER_STATE.PAUSED;
    }
  }
  
  public stop() {
    this.target.stop();
    if (this.player) {
      this.player.playerState = PLAYER_STATE.STOPPED;
    }
  }
  
  public load(media: MediaInterface) {
    this.player.playerState = PLAYER_STATE.LOADING;
    
    this.target.load(media);
  }
  
  public setLoaded() {
    this.player.playerState = PLAYER_STATE.LOADED;
    if (this.player.currentMediaTime > 0) {
      this.seekTo(this.player.currentMediaTime);
    }
    this.play();
  }
  
  public getCurrentTime() {
    return this.target.getCurrentMediaTime();
  }
  
  public getDurationTime() {
    return this.target.getMediaDuration();
  }
  
  public seekTo(time) {
    this.target.seekTo(time);
  }
}
