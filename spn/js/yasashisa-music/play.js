// hashchangeに応じて適切な画面を表示する
$(function($) {
  var $window = $(window);
  var $body = $('body');
  var ns = window.SOKENBICHA;
  var cookie = ns.cookie;
  var player = ns.PLAYER;

  var screens = {
    '#player': ns.PlayerScreen(), // play.js
    '#select': ns.SelectScreen(), // select.js
    '#list': ns.ListScreen() // list.js
  };
  var currentScreen;
  FastClick.attach($('.main-contents')[0]);

  $window.on('hashchange', onHashChange);
  onHashChange();
  return;


  function onHashChange() {
    var hash = location.hash;
    var nextScreen = screens[hash];

    if ( !nextScreen ) {
      hash = ( cookie.get(cookie.name.BOTTLE_TYPE) ) ?
        '#select' :
        '#player';
      location.hash = hash;
      return;
    }
    
    if ( !currentScreen ) {
      currentScreen = nextScreen;
      currentScreen.open().fail(function() {
        history.back();
      });
      return;
    }

    if ( ns.isOldBrowser ) {
      location.reload();
      return;
    }

    // 遷移中のhistory.back等を無視するため、一時的にhashchangeのリスナを外す 
    $window.off('hashchange', onHashChange);

    var fadeOutParams = {
      opacity: 0,
      blur: [5, 0]
    };
    var fadeInParams = {
      opacity: 1,
      blur: [0, 5]
    };
    if ( !ns.canBlur ) {
      delete fadeOutParams.blur;
      delete fadeInParams.blur;
    }

    $('#container').velocity(fadeOutParams, {
      duration: 500,
      ease: [200, 20]
    }).promise().done(function() {
      currentScreen.close();
      $('.js-serialForm .js-input').val('');
      window.scrollTo(0, 0);
      
      nextScreen.open().done(function() {
        $('#container').velocity(fadeInParams, {
          duration: 1000,
          ease: [200, 60]
        });

        currentScreen = nextScreen;
        location.hash = hash;
        
        $window.on('hashchange', onHashChange);
      }).fail(function() {
        $window.on('hashchange', onHashChange);
        history.back();
      });
    });
  }
});

// 再生画面
window.SOKENBICHA.PlayerScreen = function PlayerScreen() {
  var ns = window.SOKENBICHA;
  var cookie = ns.cookie;
  
  var $document = $(document);
  var $wrapper = $('.js-player');
  var $body = $('body');
  var LINE_SHARE_TEXT = 'いきものがかりのあの曲が今すぐ聴ける“やさしさミュージックボトルキャンペーン”実施中！ いきものがかり  「<%= name %>」 #爽健美茶 <%= shareUrl %>';

  var EventDispatcher = ns.EventDispatcher;

  var player = ns.PLAYER;
  var api = ns.api;
  var modal = ns.modal;
  var pages = ns.pages;
  var trackEvent = ns.trackEvent;

  var dataManager;
  var currentTrack;
  var playerModel;
  var playList;
  var playBox;
  var playBoxProgress;
  var playBoxAnimation;
  var noFlash;
  var isInitialVisit;
  var isInitialModalClosed;

  if ( player.getState() === 'noflash' ) {
    noFlash = true;
  }


  $body.on('keydown', function() {
    player.seek(240);
  });
  
  return {
    open: open,
    close: close
  };


  function open() {
    var $deferred = $.Deferred();

    var isAvailable = checkIsPlayerAvailable();
    if ( isAvailable ) { 
      isInitialVisit = !cookie.get(cookie.name.PLAYER_VISITED);
      if ( isInitialVisit ) {
        cookie.set(cookie.name.PLAYER_VISITED, 1, 180);
        modal.on({
          close: onInitialModalClosed
        });
        modal.open(modal.type.PLAYER_INITIAL);
      }
    }
    
    api.getMaster().done(function(result) {
      $deferred.resolve();
      $wrapper.show();
      
      if ( player.hasInitialized() || noFlash ) {
        onPlayerReady(result);
        return;
      }
      
      var onReady = function() {
        player.off('onReady', onReady);
        onPlayerReady(result);
      };
      player.on('onReady', onReady);

      // 一部端末でプレイヤーが初期化されず、
      // 一定時間経過後に再度initを呼ぶと初期化に成功する
      setTimeout(function() {
        if ( !player.hasInitialized() ) {
          player.init();
        }
      }, 2000);
    });

    return $deferred.promise();
  }


  function close() {
    $wrapper.hide();
    if ( !playerModel ) {
      return;
    }
    playerModel.pauseTrack();
    playBoxProgress.reset();
    playBoxAnimation.reset();
  }


  function onInitialModalClosed() {
    isInitialModalClosed = true;
    modal.off({
      close: onInitialModalClosed
    });
  }


  function checkIsPlayerAvailable() {
    if ( noFlash ) {
      modal.open(modal.type.NO_FLASH);
      return false;
    }
    
    var ua = navigator.userAgent.toLowerCase();
    var isBadBrowser = (
      ( ua.indexOf('android 4') > -1 && ua.indexOf('version') > -1 ) ||
        ( ua.indexOf('android') > -1 && ua.indexOf('firefox') > -1 )
    );
    if ( isBadBrowser ) {
      modal.open(modal.type.ANDROID);
      return false;
    }
    
    return true;
  }


  function onPlayerReady(master) {
    // 初回のモーダルが閉じられていなかったら閉じられるまで待つ
    if ( isInitialVisit && !isInitialModalClosed ) {
      $('.p-sokenbion-play').css('visibility', 'visible');
      var closeHandler = function() {
        onPlayerReady(master);
        modal.off({
          close: closeHandler
        });
      };
      modal.on({
        close: closeHandler
      });
      return;
    }

    if ( !dataManager ) {
      dataManager = ns.DataManager(master);
    } else {
      dataManager.updateMaster(master);
    }

    init();
  }


  function init() {
    var trackId =
          cookie.get(cookie.name.PLAYER_PLAY_TRACK) ||
          cookie.get(cookie.name.PLAYER_LAST_PLAYED);

    var shouldPlay = !!cookie.get(cookie.name.PLAYER_PLAY_TRACK);
    cookie.erase(cookie.name.PLAYER_PLAY_TRACK);
    
    currentTrack = dataManager.getTrackById(trackId);
    
    if ( !playerModel ) {
      playerModel = PlayerModel();
      playBox = PlayBox(playerModel);
      playBoxProgress = PlayBoxProgress(playerModel);
      playBoxAnimation = PlayBoxAnimation(playerModel);
      playList = PlayList(playerModel);
    } else {
      playerModel.init();
      playList.init();
    }

    if ( !trackId ) {
      return;
    }
    
    ( shouldPlay ) ?
      playerModel.playTrack(trackId) :
      playerModel.cueTrack(trackId);
  }


  // 楽曲再生まわりのロジック＆イベント中継
  function PlayerModel() {
    var mode = {
      DEFAULT: 'default',
      REPEAT: 'repeat',
      REPEAT_ONE: 'repeat_one',
      SHUFFLE_ALL: 'shuffle_all'
    };
    var modeArray = [
      mode.REPEAT,
      mode.REPEAT_ONE,
      mode.SHUFFLE_ALL,
      mode.DEFAULT
    ];
    
    var eventDispatcher = EventDispatcher();
    var currentTrack;
    var currentIndex;
    var currentMode = cookie.get(cookie.name.PLAY_MODE) || mode.REPEAT;
    var isLoading;
    var isPaused;
    var playList;

    init();

    return {
      init: init,
      cueTrack: cueTrack,
      playTrack: playTrack,
      pauseTrack: pauseTrack,
      playNextTrack: playNextTrack,
      playPrevTrack: playPrevTrack,
      cueNextTrack: cueNextTrack,
      cuePrevTrack: cuePrevTrack,
      playFromStart: playFromStart,
      getCurrentTrack: getCurrentTrack,
      playMode: mode,
      setPlayeMode: setPlayMode,
      getPlayMode: getPlayMode,
      nextPlayMode: nextPlayMode,
      getPlayList: getPlayList,
      hasNext: hasNext,
      hasPrev: hasPrev,
      on: eventDispatcher.on,
      off: eventDispatcher.off
    };

    
    function init() {
      currentTrack = null;
      currentIndex = null;
      playList = null;
    }


    function cueTrack(trackId) {
      currentTrack = dataManager.getTrackById(trackId);
      // 現在のプレイリスト内にない曲を選択した場合はプレイリストを再生成
      if ( !playList || !playList.tracks[0] || !_.findWhere(playList.tracks, { id: trackId } ) ) {
        playList = createPlayList();
      } else {
        playList.currentIndex = _.indexOf(playList.tracks, currentTrack);
      }
      eventDispatcher.trigger('cue', trackId);
      isPaused = false;
    }


    function playTrack(trackId) {
      if ( isLoading ) {
        return;
      }
      if ( noFlash ) {
        modal.open(modal.type.NO_FLASH);
        return;
      }

      var isResume = ( !trackId && isPaused );
      if ( !trackId ) {
        trackId = currentTrack.id;
      } 
      
      currentTrack = dataManager.getTrackById(trackId);

      // 現在のプレイリスト内にない曲を選択した場合はプレイリストを再生成
      if ( !playList || !playList.tracks[0] || !_.findWhere(playList.tracks, { id: trackId } ) ) {
        playList = createPlayList();
      } else {
        playList.currentIndex = _.indexOf(playList.tracks, currentTrack);
      }

      cookie.set(cookie.name.PLAYER_LAST_PLAYED, trackId);
      eventDispatcher.trigger('play', parseInt(trackId, 10), isResume);
      isPaused = false;

      if ( !isResume ) {
        isLoading = true;
        setTimeout(function() {
          isLoading = false;
        }, 1000);
      }
    }


    function pauseTrack() {
      if ( isLoading ) {
        return;
      }
      
      eventDispatcher.trigger('pause');
      isPaused = true;
    }


    function playNextTrack() {
      var nextTrack = getNextTrack();
      playTrack(nextTrack.id);
    }


    function playPrevTrack() {
      var prevTrack = getPrevTrack();
      playTrack(prevTrack.id);
    }


    function cueNextTrack() {
      var nextTrack = getNextTrack();
      cueTrack(nextTrack.id);
    }


    function cuePrevTrack() {
      var prevTrack = getPrevTrack();
      cueTrack(prevTrack.id);
    }


    function getNextTrack() {
      var nextIndex = playList.currentIndex + 1;
      if ( nextIndex >= playList.tracks.length ) {
        nextIndex = 0;
      }
      return playList.tracks[nextIndex];
    }


    function getPrevTrack() {
      var prevIndex = playList.currentIndex - 1;
      if ( prevIndex < 0 ) {
        prevIndex = playList.tracks.length - 1;
      }
      return playList.tracks[prevIndex];
    }


    function playFromStart() {
      playTrack(playList.tracks[playList.currentIndex].id);
    }


    function playPrevTrack() {
      var prevIndex = playList.currentIndex - 1;
      if ( prevIndex < 0 ) {
        prevIndex = playList.tracks.length - 1;
      }
      var prevTrack = playList.tracks[prevIndex];
      playTrack(prevTrack.id);
    }


    function getPlayMode() {
      return currentMode;
    }
    

    function setPlayMode(mode) {
      currentMode = mode;
      cookie.set(cookie.name.PLAY_MODE, currentMode);
      playList = createPlayList();
      eventDispatcher.trigger('modeChange', currentMode);
    }

    
    function nextPlayMode() {
      var index = _.indexOf(modeArray, currentMode);
      index++;
      if ( index >= modeArray.length ) {
        index = 0;
      }

      setPlayMode(modeArray[index]);
    }


    function getCurrentTrack() {
      return currentTrack;
    }


    function getPlayList() {
      return playList;
    }


    // 楽曲の再生順を管理するための内部的なプレイリストを生成する
    function createPlayList() {
      if ( !currentTrack || !currentTrack.isAvailable ) {
        return {
          tracks: [currentTrack],
          currentIndex: 0
        };
      }

      var availableTracks = _.filter(dataManager.getAllTracks(), function(track) {
        return track.isAvailable;
      });
      var tracks;
      switch( currentMode ) {
      case mode.DEFAULT:
      case mode.REPEAT:
        tracks = availableTracks;
        break;

      case mode.REPEAT_ONE:
        tracks = [currentTrack];
        break;

      case mode.SHUFFLE:
        tracks = _.shuffle(availableTracks);
        break;

      case mode.SHUFFLE_ALL:
        tracks = _.filter(dataManager.getAllTracks(), function(track) {
          return track.isAvailable;
        });
        tracks = _.shuffle(tracks);
        break;
      }
      
      var currentTrackIndex = _.indexOf(tracks, currentTrack);
      if ( currentTrackIndex === -1 ) {
        currentTrackIndex = 0;
      }

      return {
        tracks: tracks,
        currentIndex: currentTrackIndex
      };
    }


    function hasNext() {
      if ( !playList ) {
        return false;
      }

      return (
        ( currentMode !== mode.DEFAULT ) ||
        ( playList.currentIndex < playList.tracks.length - 1 )
      );
    }


    function hasPrev() {
      if ( !playList ) {
        return false;
      }
      
      return (
        ( currentMode !== mode.DEFAULT ) ||
        ( playList.currentIndex !== 0 ) 
      );
    }
  }


  // modelの制御、コントローラの制御、playerの制御をおこなう。
  function PlayBox(model) {
    var eventDispatcher = EventDispatcher();

    var $box = $('.player_area');
    var $title = $box.find('.title_area .ttl');
    var $artist = $box.find('.title_area .name');
    var $share = $box.find('.share_area');
    var $tweet = $box.find('.share_area .tw a');
    var $fbShare = $box.find('.share_area .fb a');
    var $lineShare = $box.find('.share_area .line a');

    var $prev = $('.btn_playbox_prev a');
    var $toggle = $('.btn_playbox_stop a');
    var $next = $('.btn_playbox_next a');
    var $repeat = $('.btn_playbox_shuffle a');

    var isPlaying;
    var currentTrackId;
    var currentInfoId;
    var lastTime = 0;
    
    init();

    $toggle.on('click', onToggleClick);
    $prev.on('click', onPrevClick);
    $next.on('click', onNextClick);
    $repeat.on('click', onRepeatClick);
    $tweet.on('click', onTweetClick);
    $fbShare.on('click', onShareClick);
    $lineShare.on('click', onLineShareClick);

    model.on({
      cue: onModelCue,
      play: onModelPlay,
      pause: pause,
      modeChange: onPlayModeChange
    });

    player.on({
      onTimeupdate: onTimeUpdate,
      onEnded: onPlayerEnd
    });

    onPlayModeChange(model.getPlayMode());

    return {
      init: init,
      reset: reset
    };
    

    function init() {
    }


    function reset() {
      
    }


    function onModelCue(trackId) {
      showTrackInfo(trackId);
      currentTrackId = null;
      
      $toggle.find('.pause, .disabled').hide();
      $toggle.find('.play').show();
    }


    function showTrackInfo(trackId) {
      if ( trackId === currentInfoId ) {
        return;
      }
      currentInfoId = trackId;

      var track = dataManager.getTrackById(trackId);
      
      if ( $title.text() !== track.name ) {
        if ( !ns.canBlur ) {
          $title.text(track.name).add($artist).css({
            opacity: 1
          });
          return;
        }

        $title.velocity('stop').velocity({
          marginLeft: -10,
          opacity: 0
        }, {
          duration: 200,
          easing: 'easeOutSine'
        }).promise().done(function() {
          $title.text(track.name);
          
          $title.velocity({
            marginLeft: [0, 10],
            opacity: 1
          }, {
            duration: 200,
            easing: 'easeOutSine'
          });
        });
        
        $artist.velocity('stop').velocity({
          opacity: 0
        }, {
          duration: 0,
          easing: 'easeOutSine'
        }).promise().done(function() {
          $artist.velocity({
            opacity: 1
          }, {
            delay: 400,
            duration: 200,
            easing: 'easeOutSine'
          });
        });
      }
    }


    function onModelPlay(trackId, isResume) {
      play(trackId, isResume);
    }


    function play(trackId, isResume) {
      if ( isResume ) {
        player.play();
      } else {
        lastTime = 0;
        showTrackInfo(trackId);
        var track = dataManager.getTrackById(trackId);

        var url;
        url = track.url;
        trackEvent('play', track.id);

        player.play(url);
      }

      $toggle.find('.play, .disabled').hide();
      $toggle.find('.pause').show();

      isPlaying = true;
      if ( trackId ) {
        currentTrackId = trackId;
      }

      eventDispatcher.trigger('play', trackId);
    }


    function pause() {
      try {
        player.pause();
      } catch(e) {}
      isPlaying = false;
      $toggle.find('.play').show();
      $toggle.find('.pause').hide();
    }


    function onPlayModeChange(mode) {
      $repeat.find('img').hide().filter('.' + mode).show();
    }
    

    function onToggleClick(e) {
      e.preventDefault();

      ( isPlaying ) ?
        model.pauseTrack() :
        model.playTrack();
    }
    

    function onPrevClick(e) {
      e.preventDefault();

      var playList = model.getPlayList();
      var playMode = model.getPlayMode();
      var currentTime = player.getCurrentTime();

      var shouldPlayFromStart = (
        ( playList.tracks.length === 1 ) ||
        ( currentTime > 4 )
      );


      if ( shouldPlayFromStart ) {
        if ( isPlaying ) {
          model.playFromStart();
        } else {
          model.pauseTrack();
          model.cueTrack(playList.tracks[playList.currentIndex].id);
        }
        return;
      }
      
      ( isPlaying ) ?
        model.playPrevTrack() : 
        model.cuePrevTrack();
    }
    

    function onNextClick(e) {
      if ( e ) {
        e.preventDefault();
      }

      if ( isPlaying ) {
        model.playNextTrack();
      } else {
        model.cueNextTrack();
      }
    }


    function onRepeatClick(e) {
      e.preventDefault();
      model.nextPlayMode();
    }
    
    
    function onTimeUpdate(e, ratio) {
      // 一部端末でplayerEndがdispatchされない。
      // その代わり曲終了時にTimeupdateの戻り値が0になるのでそれをキャッチしてonPlayerEndを呼ぶ
      if ( ratio < lastTime ) {
        onPlayerEnd();
        return;
      }
      lastTime = ratio;
    }


    function onPlayerEnd() {
      lastTime = 0;
      // 楽曲終了時、次の曲があったら次の曲を再生
      if ( model.getPlayMode() !== model.playMode.DEFAULT && model.hasNext() ) {
        onNextClick();
        return;
      }

      // 無かったら止める
      model.pauseTrack();
      currentTrackId = null;
    }


    function onTweetClick(e) {
      e.preventDefault();

      var currentTrack = model.getCurrentTrack();
      if ( !currentTrack ) {
        return;
      }
      var shareUrl = currentTrack.shareUrl;
      var url = 'https://twitter.com/intent/tweet';

      var data = {
        text: '#爽健美茶',
        url: 'http://' + location.host + shareUrl
      };

      trackEvent('share', 'tw');
      openPopup(url, data);
    }


    function onShareClick(e) {
      e.preventDefault();

      var currentTrack = model.getCurrentTrack();
      if ( !currentTrack ) {
        return;
      }
      
      var shareUrl = currentTrack.shareUrl;
      var url = 'https://www.facebook.com/sharer/sharer.php';
      var data = {
        u: 'http://' + location.host + shareUrl
      };

      trackEvent('share', 'fb');
      openPopup(url, data);
    }


    function onLineShareClick(e) {
      e.preventDefault();

      var currentTrack = model.getCurrentTrack();
      if ( !currentTrack ) {
        return;
      }
      
      var url = 'http://line.me/R/msg/text/';
      var text = _.template(LINE_SHARE_TEXT)({
        name: currentTrack.name,
        shareUrl: 'http://' + location.host + currentTrack.shareUrl
      });

      trackEvent('share', 'line');
      openPopup(url + encodeURIComponent(text));
    }


    function openPopup(url, data) {
      if ( data ) {
        var pairs = [];
        for ( var key in data ) {
          pairs.push(key + '=' + encodeURIComponent(data[key]));
        }
        var dataString = pairs.join('&');
        url = url + '?' + dataString;
      }

      var windowParams = {
        width: 550,
        height: 420,
        scrollbars: 'yes',
        resizable: 'yes',
        toolbar: 'no',
        location: 'yes'
      };

      pairs = [];
      for ( key in windowParams ) {
        pairs.push(key + '=' + windowParams[key]);
      }
      var params =  pairs.join(',');
      var shareWindow = window.open(url, 'share', params);
      
      var timer;
      checkWindow();
      return;
      
      
      function checkWindow() {
        if ( shareWindow.closed ) {
          modal.open(modal.type.SHARED);
          return;
        }
        
        timer = setTimeout(checkWindow, 100);
      }
    }
  } // /PlayBox



  function PlayBoxProgress(model) {
    var $container = $('.progress_area');
    var $bar = $container.find('.progress_bar');
    var $currentTime = $container.find('.cur');
    var $totalTime = $container.find('.end');

    var duration;
    var barLength = 236;
    var timeMultiplier = 1;

    model.on({
      play: onPlay,
      cue: onPlay
    });

    $body.on({
      onDurationchange: onDurationChange,
      onTimeupdate: onTimeUpdate
    });

    return {
      reset: reset
    };


    function reset() {
      duration = 0;
      updateTime(0);
    }


    function onPlay(trackId, isResume) {
      if ( isResume ) {
        return;
      }
      
      $currentTime.text('--:--');
      $totalTime.text('--:--');

      // 一部端末がdurationに間違った値を返してくるので、APIから取得するよう改修
      duration = dataManager.getTrackById(trackId).duration;
      updateTime(0);
    }


    function onDurationChange(e, aDuration) {
      if ( aDuration === Infinity ) {
        return;
      }

      // 間違ったdurationを返してくる機種では、onTimeUpdateで間違ったdurationに基づいた情報を返してくるので
      // 補正用の係数を用意しておく
      if ( Math.round(aDuration) !== duration ) {
        timeMultiplier = aDuration / duration;
      }
    }


    function onTimeUpdate(e, ratio) {
      ratio = ratio * timeMultiplier;
      updateTime(duration * ratio);
    }


    function updateTime(time) {
      var barWidth = (time / duration) * barLength;
      if ( !duration ) {
        barWidth = 0;
      }

      $bar.css({
        width: barWidth
      });

      time = Math.min(Math.round(time), duration);
      
      $currentTime.text(toMinSec(time));
      $totalTime.text(toMinSec(duration - time));
    }


    function toMinSec(time) {
      if ( !duration ) {
        return '--:--';
      }

      var min = Math.max(Math.floor(time / 60), 0);
      if ( min < 10 ) {
        min = '0' + min;
      }
      var sec = Math.max(Math.floor(time % 60), 0);
      if ( sec < 10 ) {
        sec = '0' + sec;
      }

      return min + ':' + sec;
    }
    
  } // /PlayBoxProgress


  function PlayBoxAnimation(model) {
    var $boxes = $('.player_area');
    var $onpu = $boxes.find('.player_ttl');

    var transformOrigin = '40% 90%';
    $onpu.css({
      webkitTransformOrigin: transformOrigin,
      transformOrigin: transformOrigin
    });
    
    var wave = 0;
    var timer;
    var loadingTimer;

    model.on({
      play: onModelPlay,
      pause: onModelPause
    });

    return {
      reset: reset
    };


    function reset() {
      wave = 0;
      loop();
      clearTimeout(timer);
    }


    function onModelPlay(trackId, isResume) {
      clearTimeout(timer);
      clearTimeout(loadingTimer);

      if ( isResume ) {
        loop();
        return;
      }

      loadingTimer = setTimeout(loop, 1000);
    }



    function onModelPause() {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
    }


    function loop() {
      wave += 0.03;

      var transform = 'rotate(' + (Math.sin(wave) * 4) + 'deg)';
      $onpu.css({
        webkitTransform: transform,
        transform: transform
      });

      clearTimeout(timer);
      timer = setTimeout(loop, 1000 / 60);
    }
  }


  function PlayList(model) {
    var $container = $('.js-player .playlist');
    var $bonusPlayButton;
    var template;
    
    init();
    
    $container.on('click', '.btn_play', onPlayClick);
    model.on({
      play: onModelPlay,
      pause: onModelPause
    });
    
    return {
      init: init
    };

    function init() {
      generateList();
    }


    function generateList() {
      if ( !template) {
        var templateText = $('#tmpl-play-playlist').html();
        template = _.template(templateText);
      }

      var tracks = dataManager.getAllTracks();

      var html = _.reduce(tracks, function(result, track) {
        result += template(track);
        return result;
      }, '');
        
      $wrapper.find('.playlist').html(html);
    }


    function onPlayClick(e) {
      e.preventDefault();
      var trackId = $(this).closest('li').attr('data-id');
      model.playTrack(trackId);
      
      $('#header').velocity('scroll', {
        duration: 350,
        easing: 'easeInOutSine'
      });
    }


    function onModelPlay(trackId) {
      onModelPause();
      var $row = $container.find('[data-id="' + trackId + '"]');
      $row.find('.btn_play').hide();
      $row.find('.btn_playing').show();
      $row.addClass('playing');
    }


    function onModelPause() {
      $container.find('.btn_play').show();
      $container.find('.btn_playing').hide();
      $container.find('.row.playing').removeClass('playing');
    }
  }
};
