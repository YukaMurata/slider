$(function() {
  var IS_DEV = false;
  
  var isIOSApp = (function() {
    var ua = navigator.userAgent.toLowerCase();
    return (
        /ipone|ipod/.test(ua) &&
        (/line|fb|twitter/.test(ua) || !/safari/.test(ua))
    );
  }());
  $.support.transform = $('html').hasClass('csstransforms');
  $.support.canvas = $('html').hasClass('canvas');

  var ns = window.SOKENBICHA;
  if ( !ns ) {
    ns = window.SOKENBICHA = {};
  }
  
  ns.canBlur = (function() {
    var ua = navigator.userAgent.toLowerCase();
    return (
      ua.indexOf('iphone') !== -1 ||
      ua.indexOf('ipod') !== -1
    );
  }());
  ns.isOldBrowser = !ns.canBlur && (function() {
    var ua = navigator.userAgent.toLowerCase();
    var m = navigator.userAgent.toLowerCase().match(/android ([\d.]+)/);
    return ( m && parseFloat(m[1]) < 4 );
  }());

  var api = ns.api = Api();
  var modal = ns.modal = Modal();
  var cookie = ns.cookie = Cookie();
  var pages = ns.pages = {
    TOP: '/spn/',
    GET: '/spn/yasashisa-music/play.htm#select',
    PLAYER: '/spn/yasashisa-music/play.htm#player'
  };
  var SHARE_URL_TMPL = '/yasashisa-music/share{{id}}.html';

  ns.DataManager = DataManager;
  ns.EventDispatcher = EventDispatcher;
  ns.trackEvent = trackEvent;

  initSerialForms();
  initSampleButtons();
  return;


  function Api() {
    var API_URL = {
      getMaster: '/rest/wapi_bion2016_bottle/getMusic/',
      checkSerial: '/rest/wapi_bion2016_bottle/checkSerial/',
      addTrack: '/rest/wapi_bion2016_bottle/addMusic/',
      getTweets: '/rest/wapi_sns/getTwitterTweet/',
      cancelSns: '/rest/wapi_bion2016_bottle/cancelSns/'
    };
      
    if ( IS_DEV ) {
      for ( var key in API_URL ) {
        if ( key === 'getTweets' ) {
          API_URL[key] ='/_development/json/yasashisa-music/getTwitterTweet.json';
          continue;
        }

        API_URL[key] = API_URL[key].replace(
          '/rest/wapi_bion2016_bottle/',
          '/_development/json/yasashisa-music/'
        ).slice(0, -1) + '.json';
      }
    }
    
    return {
      getMaster: getMaster,
      checkSerial: checkSerial,
      addTrack: addTrack,
      getTweets: getTweets,
      cancelSns: cancelSns
    };


    function getMaster() {
      var $deferred = $.Deferred();
      var url = API_URL.getMaster;

      $.ajax({
        url: url,
        dataType: 'JSON',
        cache: false
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        $deferred.resolve(result);
      }
      

      function parse(res) {
        var isHls = (function() {
          var ua = navigator.userAgent.toLowerCase();
          return /iphone|ipad|ipod|android 4|android 5|android 6/.test(ua);
        }());
        var tracks = _.map(res.musics, function(item) {
          // yyyy-mm-dd ‚ÍIE8‚ªƒp[ƒX‚Å‚«‚È‚¢
          var start = new Date(item.period.replace(/-/g, '/'));
          var startDate = (start.getMonth() + 1) + '/' + start.getDate();

          var url = ( isHls ) ?
                item.hls : 
                item.rtmp;
          var bottleTypes = item.bottle_types.split(',');
          var bottleTypesText = bottleTypes.map(function(type) {
            return {
              '600-1': '600ml',
              '600-2': '600ml',
              '600-3': '600ml',
              '600-4': '600ml',
              '525': '525ml',
              '2000': '2L'
            }[type];
          }).join(',');
          if ( bottleTypes.length > 5 ) {
            bottleTypesText = '‘Sƒ{ƒgƒ‹';
          }
          
          var shareUrl;
          try {
              shareUrl = SHARE_URL_TMPL.replace('{{id}}', url.match(/\/(\d{2})_/)[1]);
          } catch(e) {
            shareUrl = '/yasashisa-music/';
          }
                
          return {
            id: item.id,
            name: item.name,
            arranger: item.arranger,
            start: start,
            startDate: startDate,
            url: url,
            sampleUrl: item.sampleUrl,
            shareUrl: shareUrl,
            isOpen: item.isOpen,
            isAvailable: item.isAvailable,
            isNew: item.isNew,
            colorId: item.colorId,
            bottleTypes: bottleTypes,
            bottleTypesText: bottleTypesText,
            duration: item.duration
          };
        });

        return {
          tracks: tracks
        };


        // hh:mm:ss ‚ð 0:00‚©‚ç‚Ì•b”‚É•ÏŠ·
        function parseTime(time) {
          var n = time.split(':');
          return _.reduce(n, function(result, item, index) {
            item = parseInt(item, 10);
            switch( index ) {
            case 0:
              result += item * 60 * 60;
              break;
            case 1:
              result += item * 60;
              break;
            case 2:
              result += item;
              break;
            }
            return result;
          }, 0);
        }
      }


      function onFail() {
        $deferred.resolve();
      }
    }


    function checkSerial(serial) {
      var $deferred = $.Deferred();
      var url = API_URL.checkSerial;

      $.ajax({
        url: url,
        dataType: 'JSON',
        data: {
          serial_code: serial
        },
        cache: false
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        $deferred.resolve(result);
      }
      
      
      function parse(res) {
        if ( !res ) {
          return {
            isError: 1,
            code: 999
          };
        }
        
        cookie.set(cookie.name.SELECT_TOKEN, res.token);

        return {
          isError: ( res.responseCode !== 0 ),
          code: res.responseCode,
          bottleType: res.bottle_type_id
        };
      }


      function onFail() {
        $deferred.resolve();
      }
    }


    function addTrack(id) {
      var $deferred = $.Deferred();
      var url = API_URL.addTrack;

      $.ajax({
        url: url,
        dataType: 'JSON',
        data: {
          music_type: id,
          token: cookie.get(cookie.name.SELECT_TOKEN)
        },
        cache: false
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        cookie.erase(cookie.name.SELECT_TOKEN);
        $deferred.resolve(result);
      }
      

      function parse(res) {
        return {
          isError: ( res.responseCode !== 0 ),
          code: res.responseCode
        };
      }


      function onFail() {
        $deferred.resolve();
      }
    }

    
    function getTweets() {
      var $deferred = $.Deferred();
      var url = API_URL.getTweets;

      $.ajax({
        url: url,
        dataType: 'JSON'
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        $deferred.resolve(result);
      }
      
      
      function parse(res) {
        var isError = ( !res || res.responseCode !== 0 );

        if ( isError ) {
          return {
            isError: isError,
            code: ( res ) ? res.responseCode : 999
          };
        }

        var tweets = _.map(res.tweets, function(tweet) {
          return tweet.tweet_text;
        });

        return tweets;
      }


      function onFail() {
        $deferred.resolve();
      }
    }

    
    function cancelSns() {
      var $deferred = $.Deferred();
      var url = API_URL.cancelSns;

      $.ajax({
        url: url,
        dataType: 'JSON',
        cache: false
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        $deferred.resolve(result);
      }
      

      function parse(res) {
        if ( !res ) {
          res = {
            responseCode: 999
          };
        }

        return {
          isError: ( res.responseCode !== 0 ),
          code: res.responseCode
        };
      }


      function onFail() {
        $deferred.resolve();
      }
    }


    function tmpl() {
      var $deferred = $.Deferred();
      var url = '/rest/wapi_bion_bottle//';

      $.ajax({
        url: url,
        dataType: 'JSON',
        cache: false
      }).promise().done(onLoad).fail(onFail);

      return $deferred.promise();


      function onLoad(res) {
        var result = parse(res);
        $deferred.resolve(result);
      }

      function parse(res) {
      }


      function onFail() {
        $deferred.resolve();
      }
    }
  }


  function Modal() {
    var $container = $('.modal_area');
    var $contents = $container.find('.modal');
    var $bg = $container.find('.bg');
    var $closeButtons = $container.find();
    
    var eventDispatcher = EventDispatcher();
    var templates;
    var currentIndex;

    $container.on('click', '.btn_ok a', onOkClick);
    $container.on('click', '.btn_close, .btn_cancel a, .bg', close);
    $container.on('click', '.btn_play_modal', onPlayClick);
    init();

    var type = {
      ERROR_SERIAL: 0,
      ERROR: 1,
      SHARED: 2,
      GET: 3,
      HAS_ALL: 4,
      PLAYER_INITIAL: 5,
      CANCEL_SNS: 6,
      NO_FLASH: 7,
      ANDROID: 8,
      SAFARI: 9
    };
    var openOnlyOnceTypes = [type.ANDROID, type.SAFARI];
    var openedTypes = [];

    return {
      open: open,
      close: close,
      type: type,
      on: eventDispatcher.on,
      off: eventDispatcher.off
    };


    function init() {
      templates = [];

      $contents.each(function(index) {
        var $content = $(this);

        var $tmpl = $content.find('script[type="text/x-template"]');

        if ( $tmpl.length === 0 ) {
          return;
        }

        var templateText = $tmpl.html();
        var template = _.template(templateText);
        templates[index] = template;
      });
    }


    function open(index, data) {
      if ( openOnlyOnceTypes.indexOf(index) > -1 && openedTypes.indexOf(index) > -1 ) {
        return;
      }
      if ( openedTypes.indexOf(index) < 0 ) {
        openedTypes.push(index);
      }

      if ( data ) {
        var html = templates[index](data);
        $contents.eq(index).html(html);
      }
      
      if ( !ns.canBlur ) {
        $bg.show().css({
          opacity: 0.6
        });
        $contents.hide().eq(index).show();
        currentIndex = index;
        $container.show();
        return;
      }

      $bg.velocity({
        opacity: [0.6, 0]
      }, {
        duration: 200,
        easing: 'easeOutSine',
        display: 'block'
      });

      $contents.hide().eq(index).velocity({
        opacity: [1, 0],
        scale: [1, 1.05],
        blur: [0, 5]
      }, {
        duration: 400,
        easing: 'easeOutCubic',
        display: 'block'
      });
      currentIndex = index;
      $container.show();

      $('header, .main-contents, footer.lower').velocity({
        blur: [3, 0]
      });
    }


    function close(e) {
      if ( e && e.preventDefault ) {
        e.preventDefault();
      }
      
      if ( !ns.canBlur ) {
        $bg.add($contents).hide();
        $container.hide();
        eventDispatcher.trigger('close');
        return;
      }

      var hideParams = {
        opacity: 0,
        scale: 1.02,
        blur: 2
      };
      
      $contents.eq(currentIndex).velocity(hideParams, {
        duration: 200
      });

      $bg.velocity({
        opacity: 0
      }, {
        duration: 200,
        easing: 'easeOutSine',
        display: 'none'
      }).promise().done(function() {
        $container.hide();
      });
      eventDispatcher.trigger('close');

      $('header, .main-contents, footer.lower').velocity({
        blur: 0
      });
    }


    function onOkClick(e) {
      e.preventDefault();
      eventDispatcher.trigger('ok');
    }


    function onPlayClick(e) {
      e.preventDefault();
      eventDispatcher.trigger('listen');
      close();
    }
  }
  

  function Cookie() {
    var COOKIE_PATH = '/';

     var name = {
       INTRO_PLAYED: 'js-skbSpIntroPlayed',
       BOTTLE_TYPE: 'js-skbSpBottleType',
       PLAYER_PLAY_TRACK: 'js-skbSpPlayerPlay',
       PLAYER_VISITED: 'js-skbSpPlayerVisited',
       PLAYER_LAST_PLAYED: 'js-skbSpLastPlayed',
       PLAY_MODE: 'js-skbSpPlayMode',
       SELECT_TOKEN: 'js-skbSpSelectToken'
     };
    
    return {
      get: get,
      set: set,
      erase: erase,
      name: name
    };
    
    
    function get(key) {
      var pairs = document.cookie.split(/;\s*/);
      for ( var i = 0; i < pairs.length; i++ ) {
        var a = pairs[i].split('=');
        if ( a[0] === key ) {
          return unescape(a[1]);
        }
      }
      
      return null;
    }


    function set(key, value, days) {
      if ( !value ) {
        return;
      }

      var expireString = '';
      if ( days !== undefined ) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expireString = '; expires=' + date.toGMTString();
      }
      
      var cookieString = key + '=' + escape(value) + expireString + '; path=' + COOKIE_PATH;
      document.cookie = cookieString;
    }
    
    
    function erase(key) {
      set(key, ' ', -1);
    }
  }


  function initSerialForms() {
    var $forms = $('.js-serialForm');
    if ( $forms.length === 0 ) {
      return;
    }

    $forms.each(function() {
      initSerialForm(this);
    });
  }

  function initSerialForm(form) {
    var LENGTH_SERIAL = 8;
    
    var $form = $(form);
    var $input = $form.find('.js-input');
    var $enabled = $form.find('.js-enabled');
    var $disabled = $form.find('.js-disabled');
    var isValid = false;
    var placeholder = $input.attr('placeholder');

    $input.on({
      input: onInput,
      keyup: validate
    });
    $form.on({
      submit: onSubmit
    });

    $input.val('');
    validate();

    if ( isIOSApp ) {
      $input.one('focus', function() {
        modal.open(modal.type.SAFARI);
      });
    }

    if ( Modernizr.input.placeholder ) {
      $input.on({
        focus: onFocus,
        blur: onBlur
      });
      onBlur();
    } else {
      shimPlaceholder($input);
    }
    return;


    function onInput(e) {
      var val = $input.val();
      
      if ( val.length >= LENGTH_SERIAL ) {
        e.preventDefault();
        val = val.slice(0, LENGTH_SERIAL);
        $input.val(val);
      }
    }


    function onSubmit(e) {
      e.preventDefault();

      var val = $input.val();
      if ( /[‚`-‚y‚-‚š‚O-‚X]/.test(val) ) {
        val = val.replace(/[‚`-‚y‚-‚š‚O-‚X]/g,function(s){
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        $input.val(val);
      }
      
      validate();
      
      if ( !isValid ) {
        modal.open(modal.type.ERROR_SERIAL);
        return;
      }

      $disabled.show();
      $enabled.hide();
      val = $input.val();
      api.checkSerial(val).done(function(result) {
        if ( result.isError ) {
          modal.open(modal.type.ERROR_SERIAL);
          return;
        }
        
        trackEvent('serial', val).done(function() {
          cookie.set(cookie.name.BOTTLE_TYPE, result.bottleType);
          $input.blur();
          
          if ( location.href.indexOf(pages.GET) !== -1 ) {
            location.reload();
            return;
          }

          location.href = pages.GET;
        });
      });
    }


    function validate() {
      var val = $input.val();
      isValid = true;

      if ( val.length !== LENGTH_SERIAL ) {
        isValid = false;
      }
      if ( val.length > LENGTH_SERIAL ) {
        val = val.slice(0, LENGTH_SERIAL);
        $input.val(val);
      }
      
      if ( isValid ) {
        $disabled.hide();
        $enabled.show();
      } else {
        $disabled.show();
        $enabled.hide();
      }
    }


    function onFocus() {
      $input.attr('placeholder', '');
    }


    function onBlur() {
      $input.attr('placeholder', placeholder);
    }


    function shimPlaceholder($input) {
      var placeholder = $input.attr('placeholder');
      var placeholderColor = '#ccc';
      $input.attr('placeholder', '');

      $input.on({
        focus: onFocus,
        blur: onBlur
      });
      onBlur();
      return;


      function onFocus() {
        var val = $input.val();

        if ( val === placeholder ) {
          $input.val('').css({
            color: 'inherit'
          });
        }
      }


      function onBlur() {
        var val = $input.val();

        if ( /^\s*$/.test(val) || val === placeholder ) {
          $input.val(placeholder).css({
            color: placeholderColor
          });
        }
      }
    }
  }


  function initSampleButtons() {
    $('.js-sample').on('click', onClick);
    $('.playlist').on('click', '.js-sample', onClick);
    return;
    
    
    function onClick(e) {
      var id = $(this).attr('data-id');
      trackEvent('sample', id);
    }
  }


  function DataManager(data) {
    var tracks;
    var now = new Date();
    var tracksById;
    var tracksByBottleType;

    updateMaster(data);
    
    return {
      updateMaster: updateMaster,
      getSamplesForNow: getSamplesForNow,
      getTrackById: getTrackById,
      getTracksByBottleType: getTracksByBottleType,
      getAllTracks: getAllTracks
    };


    function updateMaster(data) {
      tracks = data.tracks;
      
      tracksById = _.reduce(tracks, function(result, item) {
        result[item.id] = item;
        return result;
      }, {});

      tracksByBottleType = _.reduce(tracks, function(result, item) {
        _.forEach(item.bottleTypes, function(bottleType) {
          if ( !result[bottleType] ) {
            result[bottleType] = [];
          }
          result[bottleType].push(item);
        });
        
        return result;
      }, {});
    }


    function getSamplesForNow() {
      // ’¼‹ß‚ÉŒöŠJ‚³‚ê‚½Šy‹È‚Ìˆê——‚ð•Ô‚·
      var latestOpenTime = _.reduce(tracks, function(result, track) {
        if ( !track.isOpen ) {
          return result;
        }
        return Math.max(result, track.start.getTime());
      }, 0);

      return _.filter(tracks, function(track) {
        return ( track.start.getTime() === latestOpenTime );
      });
    }


    function getTracksByBottleType(bottleId) {
      return tracksByBottleType[bottleId];
    }


    function getTrackById(trackId) {
      return tracksById[trackId];
    }


    function getAllTracks() {
      return tracks.concat();
    }
  }

  
  function EventDispatcher() {
    var _listenersMap = {};

    return {
      on: on,
      off: off,
      trigger: trigger
    };
    

    function on(type, listener) {
      if ( typeof type === 'object' ) {
        for ( var key in type ) {
          on(key, type[key]);
        }
        return;
      }

      if ( !_listenersMap[type] ) {
        _listenersMap[type] = [];
      }
      var listeners = _listenersMap[type];

      if ( $.inArray(listeners, listener) !== -1 ) {
        return;
      }
      listeners.push(listener);
    }


    function off(type, listener) {
      if ( typeof type === 'object' ) {
        for ( var key in type ) {
          off(key, type[key]);
        }
        return;
      }

      if ( !_listenersMap[type] ) {
        return;
      }

      var listeners = _listenersMap[type];
      var index = $.inArray(listener, listeners);
      if ( index === -1 ) {
        return;
      }

      listeners.splice(index, 1);
    }
    

    function trigger(type, data) {
      var listeners = _listenersMap[type];

      if ( !listeners || listeners.length === 0 ) {
        return;
      }

      if ( arguments[2] ) {
        var args = Array.prototype.slice.call(arguments, 1);
      }
      
      var _listeners = listeners.concat();
      for ( var i = 0, l = _listeners.length; i < l; i++ ) {
        if ( _listeners[i] ) {
          ( args ) ?
            _listeners[i].apply(null, args) :
            _listeners[i](data);
        }
      }
    }
  }


  function trackEvent(name, value) {
    if ( !window._gaq ) {
      return $.Deferred().resolve();
    }

    var $deferred = $.Deferred();

    var category;
    var action;
    var label;
    
    var dataLayer = window.dataLayer ||
          (window.dataLayer = []);

    var paramList = {
      serial: {
        category: 'bion_input',
        action: 'input',
        label: value
      },
      select: {
        category: 'bion_select',
        action: 'click',
        label: value
      },
      play: {
        category: 'bion_play',
        action: 'play',
        label: value
      },
      sample: {
        category: 'bion_samplePlay',
        action: 'play',
        label: value
      },
      share: {
        category: 'bion_share',
        action: 'click',
        label: ({fb: 'facebook', tw: 'twitter', line: 'line'})[value]
      }
    };

    var param = paramList[name];
    dataLayer.push({
      event: 'gaTrackEvent',
      gaCategory: param.category,
      gaAction: param.action,
      gaLabel: param.label + '',
      eventCallback : function() {
        $deferred.resolve();
      }
    });

    return $deferred.promise();
  }
}());

