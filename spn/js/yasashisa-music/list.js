window.SOKENBICHA.ListScreen = function ListScreen() {
  var $document = $(document);
  var $wrapper = $('.js-list');
  
  var ns = window.SOKENBICHA;
  var EventDispatcher = ns.EventDispatcher;
  var trackEvent = ns.trackEvent;

  var modal = ns.modal;
  var api = ns.api;
  var cookie = ns.cookie;
  var pages = ns.pages;
  var dataManager;
  var template;
  
  return {
    open: open,
    close: close
  };


  function open() {
    var $deferred = $.Deferred();

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
    
    generateList();
    initPlayButtons();
    
    $wrapper.find('.playlist').show();
    
    window.scrollTo(0, 0);
    $('.p-sokenbion-play').css('visibility', 'visible');
  }


  function generateList() {
    if ( !template ) {
      var templateText = $('#tmpl-list-playlist').html();
      template = _.template(templateText);
    }

    var $playlist = $wrapper.find('.playlist');
    var tracks = dataManager.getAllTracks();
    
    var html = _.reduce(tracks, function(result, track) {
      result += template(track);
      return result;
    }, '');

    $playlist.html(html);
  }


  function initPlayButtons() {
    $wrapper.find('.btn_play a').on('click', onClick);
    return;


    function onClick(e) {
      e.preventDefault();
      
      var trackId = $(this).closest('li').attr('data-id');
      cookie.set(cookie.name.PLAYER_PLAY_TRACK, trackId);
      location.href = pages.PLAYER;
    }
  }
};
