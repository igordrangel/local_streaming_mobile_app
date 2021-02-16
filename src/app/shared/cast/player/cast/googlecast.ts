import { KlDelay } from "koala-utils/dist/utils/KlDelay";

export class Castjs {
  public version = 'v4.1.2'
  public receiver = '';
  public joinpolicy = '';
  public available = false;
  public connected = false;
  public device = 'Chromecast';
  public src = ''
  public title = ''
  public description = ''
  public poster = ''
  public subtitles = []
  public volumeLevel = 1;
  public muted = false;
  public paused = false;
  public time = 0;
  public timePretty = '00:00:00';
  public duration = 0;
  public durationPretty = '00:00:00';
  public progress = 0;
  public state = 'disconnected';
  public intervalIsAvailable = 0;
  private _events = {} as any;
  private _player = null;
  private _controller = null;

  constructor(public opt: any = {}) {
    const joinpolicies = [
      'tab_and_origin_scoped',
      'origin_scoped',
      'page_scoped'
    ];

    if (!opt.joinpolicies || joinpolicies.indexOf(opt.joinpolicy) === -1) {
      this.joinpolicy = 'tab_and_origin_scoped';
    }

    if (!opt.receiver || opt.receiver === '') {
      this.receiver = 'CC1AD845';
    }

    this._init()
  }

  _getBrowser() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      return "Firefox: Casting is not supported in this browser."
    }
    if (navigator.userAgent.toLowerCase().indexOf('opr/') > -1) {
      return "Opera: Please enable casting, click here: https://bit.ly/2G1PMhD"
    }
    if (navigator.userAgent.toLowerCase().indexOf('iron safari') > -1) {
      return "Iron Safari: Please enable casting, click here: https://bit.ly/2G1PMhD"
    }
  }

  _init(tries = 0) {
    // @ts-ignore
    if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
      if (tries++ > 20) {
        return this.trigger('error', 'Casting is not supported in ' + this._getBrowser());
      }
      return setTimeout(this._init.bind(this), 250, tries);
    }

    // terminate loop
    clearInterval(this.intervalIsAvailable);
    // initialize cast API
    // @ts-ignore
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: this.receiver,
      autoJoinPolicy: this.joinpolicy,
      language: 'pt-BR',
      resumeSavedSession: false,
    });
    // create remote player controller
    // @ts-ignore
    this._player = new cast.framework.RemotePlayer();
    // @ts-ignore
    this._controller = new cast.framework.RemotePlayerController(this._player);

    // register callback events
    this._controller.addEventListener('isConnectedChanged', this._isConnectedChanged.bind(this));
    this._controller.addEventListener('isMediaLoadedChanged', this._isMediaLoadedChanged.bind(this));
    this._controller.addEventListener('isMutedChanged', this._isMutedChanged.bind(this));
    this._controller.addEventListener('isPausedChanged', this._isPausedChanged.bind(this));
    this._controller.addEventListener('currentTimeChanged', this._currentTimeChanged.bind(this));
    this._controller.addEventListener('durationChanged', this._durationChanged.bind(this));
    this._controller.addEventListener('volumeLevelChanged', this._volumeLevelChanged.bind(this));
    this._controller.addEventListener('playerStateChanged', this._playerStateChanged.bind(this));
    this.available = true;
  }

  _isMediaLoadedChanged() {
    // don't update media info if not available
    if (!this._player.isMediaLoaded) {
      return
    }
    setTimeout(() => {
      if (!this._player.mediaInfo) {
        return
      }
      // Update device name
      // @ts-ignore
      this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device

      // Update media variables
      this.src = this._player.mediaInfo.contentId;
      this.title = this._player.title || null;
      this.description = this._player.mediaInfo.metadata.subtitle || null;
      this.poster = this._player.imageUrl || null;
      this.subtitles = [];
      this.volumeLevel = this.volumeLevel = Number((this._player.volumeLevel).toFixed(1));
      this.muted = this._player.isMuted;
      this.paused = this._player.isPaused;
      this.time = Math.round(this._player.currentTime);
      this.timePretty = this._controller.getFormattedTime(this.time);
      this.duration = this._player.duration;
      this.durationPretty = this._controller.getFormattedTime(this._player.duration);
      this.progress = this._controller.getSeekPosition(this.time, this._player.duration);
      this.state = this._player.playerState.toLowerCase();

      // Loop over the subtitle tracks
      for (const i in this._player.mediaInfo.tracks) {
        // Check for subtitle
        if (this._player.mediaInfo.tracks[i].type === 'TEXT') {
          // Push to media subtitles array
          this.subtitles.push({
            label: this._player.mediaInfo.tracks[i].name,
            src: this._player.mediaInfo.tracks[i].trackContentId
          });
        }
      }
      // Get the active subtitle
      // @ts-ignore
      const active = cast.framework.CastContext.getInstance().getCurrentSession().getSessionObj().media[0].activeTrackIds;
      if (active?.length && this.subtitles[active[0]]) {
        this.subtitles[active[0]].active = true;
      }
    })

  }

  // Player controller events
  _isConnectedChanged() {
    this.connected = this._player.isConnected;
    if (this.connected) {
      // @ts-ignore
      this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
    }
    this.state = !this.connected ? 'disconnected' : 'connected'
    this.trigger('statechange')
    this.trigger(!this.connected ? 'disconnect' : 'connect')
  }

  _currentTimeChanged() {
    const past = this.time
    this.time = Math.round(this._player.currentTime);
    this.duration = this._player.duration;
    this.progress = this._controller.getSeekPosition(this.time, this.duration);
    this.timePretty = this._controller.getFormattedTime(this.time);
    this.durationPretty = this._controller.getFormattedTime(this.duration);
    // Only trigger timeupdate if there is a difference
    if (past != this.time && !this._player.isPaused) {
      this.trigger('timeupdate');
    }
  }

  _durationChanged() {
    this.duration = this._player.duration;
  }

  _volumeLevelChanged() {
    this.volumeLevel = Number((this._player.volumeLevel).toFixed(1));
    if (this._player.isMediaLoaded) {
      this.trigger('volumechange');
    }
  }

  _isMutedChanged() {
    var old = this.muted
    this.muted = this._player.isMuted;
    if (old != this.muted) {
      this.trigger(this.muted ? 'mute' : 'unmute');
    }
  }

  _isPausedChanged() {
    this.paused = this._player.isPaused;
    if (this.paused) {
      this.trigger('pause');
    }
  }

  _playerStateChanged() {
    this.connected = this._player.isConnected
    if (!this.connected) {
      return
    }
    // @ts-ignore
    this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
    this.state = this._player.playerState.toLowerCase();
    switch (this.state) {
      case 'idle':
        this.state = 'ended';
        this.trigger('statechange');
        this.trigger('end');
        return this
      case 'buffering':
        this.time = Math.round(this._player.currentTime);
        this.duration = this._player.duration;
        this.progress = this._controller.getSeekPosition(this.time, this.duration);
        this.timePretty = this._controller.getFormattedTime(this.time);
        this.durationPretty = this._controller.getFormattedTime(this.duration);
        this.trigger('statechange');
        this.trigger('buffering');
        return this
      case 'playing':
        // we have to skip a tick to give mediaInfo some time to update
        setTimeout(() => {
          this.trigger('statechange');
          this.trigger('playing');
        })
        return this
    }
  }

  // Class functions
  on(event, cb) {
    // If event is not registered, create array to store callbacks
    if (!this._events[event]) {
      this._events[event] = [];
    }
    // Push callback into event array
    this._events[event].push(cb);
    return this
  }

  off(event) {
    if (!event) {
      // if no event name was given, reset all events
      this._events = {};
    } else if (this._events[event]) {
      // remove all callbacks from event
      this._events[event] = [];
    }
    return this
  }

  trigger(event, message?: string) {
    // Slice arguments into array
    const tail = Array.prototype.slice.call(arguments, 1);

    if (this._events[event]) {
      for (const i in this._events[event]) {
        this._events[event][i].apply(this, tail);
      }
    }

    // dont call global event if error
    if (event === 'error') {
      return this
    }
    if (this._events.event) {
      for (const i in this._events.event) {
        this._events.event[i].apply(this, [event]);
      }
    }
    return this
  }

  cast(src, metadata: any = {}) {
    // We need a source! Don't forget to enable CORS
    if (!src) {
      return this.trigger('error', 'No media source specified.');
    }
    metadata.src = src;
    // Update media variables with user input
    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        this[key] = metadata[key];
      }
    }

    // Create media cast object
    // @ts-ignore
    const mediaInfo = new chrome.cast.media.MediaInfo(this.src);
    // @ts-ignore
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();

    // This part is the reason why people love this library <3
    if (this.subtitles.length) {
      // I'm using the Netflix subtitle styling
      // chrome.cast.media.TextTrackFontGenericFamily.CASUAL
      // chrome.cast.media.TextTrackEdgeType.DROP_SHADOW
      // @ts-ignore
      mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
      mediaInfo.textTrackStyle.backgroundColor = '#00000000';
      mediaInfo.textTrackStyle.edgeColor = '#00000016';
      mediaInfo.textTrackStyle.edgeType = 'DROP_SHADOW';
      mediaInfo.textTrackStyle.fontFamily = 'Arial';
      mediaInfo.textTrackStyle.fontScale = 1.0;
      mediaInfo.textTrackStyle.foregroundColor = '#FFFFFF';

      const tracks = [];
      for (const i in this.subtitles) {
        // chrome.cast.media.TrackType.TEXT
        // chrome.cast.media.TextTrackType.CAPTIONS
        // @ts-ignore
        const track = new chrome.cast.media.Track(i, 'TEXT');
        track.name = this.subtitles[i].label;
        track.subtype = 'CAPTIONS';
        track.trackContentId = this.subtitles[i].src;
        track.trackContentType = 'text/vtt';
        // This bug made me question life for a while
        track.trackId = parseInt(i);
        tracks.push(track);
      }
      mediaInfo.tracks = tracks;
    }
    // Let's prepare the metadata
    // @ts-ignore
    mediaInfo.metadata.images = [new chrome.cast.Image(this.poster)];
    mediaInfo.metadata.title = this.title;
    mediaInfo.metadata.subtitle = this.description;
    // Prepare the actual request
    // @ts-ignore
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.currentTime = this.time;
    request.autoplay = true;
    // If multiple subtitles, use the active: true one
    if (this.subtitles.length) {
      for (const i in this.subtitles) {
        if (this.subtitles[i].active) {
          request.activeTrackIds = [parseInt(i)];
          break;
        }
      }
    }

    // Time to request a session!
    if (this.connected) {
      this._controller.stop();
      KlDelay.waitFor(301).then(() => this.loadMedia(request));
    } else {
      // @ts-ignore
      cast.framework.CastContext.getInstance().requestSession().then(() => {
        // @ts-ignore
        if (!cast.framework.CastContext.getInstance().getCurrentSession()) {
          return this.trigger('error', 'Could not connect with the cast device');
        }
        this.loadMedia(request);
      }, (err) => {
        if (err !== 'cancel') {
          this.trigger('error', err);
        }
        return this;
      });
    }
  }

  seek(seconds, isPercentage = false) {
    // if seek(15, true) we assume 15 is percentage instead of seconds
    if (isPercentage) {
      seconds = this._controller.getSeekTime(seconds, this._player.duration);
    }
    this._player.currentTime = seconds;
    this._controller.seek();
    return this;
  }

  volume(float) {
    this._player.volumeLevel = float;
    this._controller.setVolumeLevel();
    return this;
  }

  play() {
    if (this.paused) {
      this._controller.playOrPause();
    }
    return this;
  }

  pause() {
    if (!this.paused) {
      this._controller.playOrPause();
    }
    return this;
  }

  mute() {
    if (!this.muted) {
      this._controller.muteOrUnmute();
    }
    return this;
  }

  unmute() {
    if (this.muted) {
      this._controller.muteOrUnmute();
    }
    return this;
  }

  // subtitle allows you to change active subtitles while casting
  subtitle(index) {
    // prepare request to edit the tracks on current session
    // @ts-ignore
    const request = new chrome.cast.media.EditTracksInfoRequest([parseInt(index)]);
    // @ts-ignore
    cast.framework.CastContext.getInstance().getCurrentSession().getSessionObj().media[0].editTracksInfo(request, () => {
      // after updating the device we should update locally
      // loop trough subtitles
      for (const i in this.subtitles) {
        // remove active key from all subtitles
        delete this.subtitles[i].active;
        // if subtitle matches given index, we set to true
        if (i == index) {
          this.subtitles[i].active = true;
        }
      }
      return this.trigger('subtitlechange')
    }, (err) => {
      // catch any error
      return this.trigger('error', err);
    });
  }

  // disconnect will end the current session
  disconnect() {
    // @ts-ignore
    cast.framework.CastContext.getInstance().endCurrentSession(true);
    this._controller.stop();

    // application variables
    this.connected = false;
    this.device = 'Chromecast';

    // media variables
    this.src = ''
    this.title = ''
    this.description = ''
    this.poster = ''
    this.subtitles = []

    // player variable
    this.volumeLevel = 1;
    this.muted = false;
    this.paused = false;
    this.time = 0;
    this.timePretty = '00:00:00';
    this.duration = 0;
    this.durationPretty = '00:00:00';
    this.progress = 0;
    this.state = 'disconnected';


    this.trigger('disconnect');
    return this;
  }

  private loadMedia(request) {
    // @ts-ignore
    cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request).then(() => {
      if (!this.device) {
        // @ts-ignore
        this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
      }
      return this;
    }, (err) => {
      return this.trigger('error', err);
    });
  }
}
