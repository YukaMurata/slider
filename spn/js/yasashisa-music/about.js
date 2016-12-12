$(function($) {
  var $document = $(document);
  
  var ns = window.SOKENBICHA;
  var EventDispatcher = ns.EventDispatcher;
  var trackEvent = ns.trackEvent;

  var api = ns.api;
  var dataManager;

  api.getMaster().done(function(result) {
    init(result);
  });
  return;


  function init(master) {
    dataManager = ns.DataManager(master);

    initSampleArea();
  }


  function initSampleArea() {
    var $container = $('.bnr_sample');

    var tracks = _.filter(dataManager.getAllTracks(), function(track) {
      // ボーナストラックは除く
      return (
        ( track.isOpen ) && 
        ( track.id !== 17 )
      );
    });
    var track = tracks[Math.floor(Math.random() * tracks.length)];

    var benefit = track.benefit;
    var trackId = track.id;

    $container.find('.ttl[data-trackId="' + trackId + '"]').show();
    $container.find('.btn_sample[data-benefit="' + benefit + '"]').show();

    var sampleUrl = [
      '/sokenbion/sample',
      benefit,
      '_',
      (trackId - ((benefit - 1) * 4)),
      '.html'
    ].join('');
    $container.find('a').attr('href', sampleUrl);
  }
});
