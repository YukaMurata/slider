window.SOKENBICHA.SelectScreen = function SelectScreen() {
  var $document = $(document);
  var $wrapper = $('.js-get');
  
  var ns = window.SOKENBICHA;
  
  var api = ns.api;
  var modal = ns.modal;
  var cookie = ns.cookie;
  var pages = ns.pages;
  var trackEvent = ns.trackEvent;

  var bottleType;
  var dataManager;
  var template;

  return {
    open: open,
    close: close
  };


  function open() {
    var $deferred = $.Deferred();

    bottleType = cookie.get(cookie.name.BOTTLE_TYPE);
    if ( !bottleType ) {
      return $deferred.reject();
    }

    api.getMaster().done(function(result) {
      $deferred.resolve();
      init(result);
    });

    return $deferred.promise();
  }


  function close() {
    $wrapper.hide();
  }


  function init(master) {
    $wrapper.show();
    
    if ( !dataManager ) {
      dataManager = ns.DataManager(master);
    } else {
      dataManager.updateMaster(master);
    }

    if ( hasAllTracks() ) {
      generateList();
      modal.open(modal.type.HAS_ALL);
      modal.on('close', function() {
        var tracks = dataManager.getTracksByBottleType(bottleType);
        cookie.set(cookie.name.PLAYER_PLAY_TRACK, tracks[0].id);
        location.hash = 'player';
      });
      return;
    }

    generateList();
    $wrapper.find('.btn_play a').on('click', onPlayButtonClick);
  }


  function generateList() {
    if ( !template ) {
      var templateText = $('#tmpl-get-playlist').html();
      template = _.template(templateText);
    }

    var tracks = dataManager.getTracksByBottleType(bottleType);

    var html = _.reduce(tracks, function(result, item) {
      result += template(item);
      return result;
    }, '');
    
    $wrapper.find('.playlist').html(html);
  }


  function hasAllTracks() {
    var tracks = dataManager.getTracksByBottleType(bottleType);

    return _.every(tracks, function(item) {
      return ( item.isAvailable || !item.isOpen );
    });
  }


  function onPlayButtonClick(e) {
    e.preventDefault();
    var trackId = $(this).closest('li').attr('data-id');
    var track = dataManager.getTrackById(trackId);

    var type = modal.type.GET;
    modal.open(type, track);
    modal.on({
      ok: onOk,
      close: onClose
    });
    return;

    
    function onOk() {
      api.addTrack(trackId).done(onLoad);
    }


    function onClose() {
      modal.off({
        ok: onOk,
        close: onClose
      });
    }


    function onLoad(result) {
      if ( !result || result.isError ) {
        onClose();
        modal.open(modal.type.ERROR);
        return;
      }
      
      cookie.erase(cookie.name.BOTTLE_TYPE);
      trackEvent('select', track.id).done(function() {
        modal.close();
        
        cookie.set(cookie.name.PLAYER_PLAY_TRACK, trackId);
        $('.footer_btns').addClass('own');
        location.href = pages.PLAYER;
      });
    }
  }
};
