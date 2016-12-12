$(function($) {
  var $document = $(document);
  
  var ns = window.SOKENBICHA;
  var EventDispatcher = ns.EventDispatcher;
  var trackEvent = ns.trackEvent;

  var player = ns.PLAYER;
  var modal = ns.modal;
  var api = ns.api;
  var cookie = ns.cookie;
  var dataManager;
  var noFlash;

  initTweetArea();

  if ( player.getState() === 'noflash' ) {
    noFlash = true;
  }

  api.getMaster().done(function(result) {
    if ( player.hasInitialized() || noFlash ) {
      onPlayerReady(result);
    } else {
      player.on('onReady', function() {
        onPlayerReady(result);
      });
    }
  });
  return;


  function onPlayerReady(master) {
    dataManager = ns.DataManager(master);
    initSamplePlayer();
  }


  function initSamplePlayer() {
    var INTERVAL = 5000;
    
    var $container = $('.footer_pickup');
    var $title = $container.find('.ttl span');
    var $link = $container.find('.btn_sample a');

    var currentIndex = 0;
    var mouseOverTimer;
    var samples = dataManager.getSamplesForNow();

    $link.attr({
      href:  samples[0].sampleUrl,
      'data-id': samples[0].id
    });
    $title.text(samples[0].name).css({
      display: 'block'
    }).velocity({
      opacity: [1, 0],
      translateX: [0, 10]
    }, {
      duration: 250,
      ease: 'easeOutSine'
    });

    mouseOverTimer = setTimeout(updateTitle, INTERVAL);

    $container.on({
      mouseenter: onMouseOver,
      mouseleave: onMouseOut
    });
    return;

    
    function onMouseOver() {
      clearTimeout(mouseOverTimer);
    }


    function onMouseOut() {
      clearTimeout(mouseOverTimer);
      mouseOverTimer = setTimeout(updateTitle, INTERVAL);
    }


    function updateTitle() {
      $title.velocity({
        opacity: 0,
        translateX: [-10, 0]
      }, {
        duration: 250,
        ease: 'easeInSine'
      }).promise().done(function() {
        currentIndex++;
        
        if ( currentIndex >= samples.length ) {
          currentIndex = 0;
        }

        $title.text(samples[currentIndex].name);
        $link.attr({
          href:  samples[currentIndex].sampleUrl,
          'data-id': samples[currentIndex].id
        });
        
        $title.velocity({
          opacity: 1,
          translateX: [0, 10]
        }, {
          duration: 250,
          ease: 'easeOutSine'
        });

        onMouseOut();
      });
    }
  }


  function initTweetArea() {
    var INTERVAL = 1000 / 60;
    var NUM_TWEETS = 5;

    var $container = $('.ticker_area ul');
    var $current;
    var $items;
    var currentLeft = 0;
    var firstItemWidth;

    var currentIndex = -1;
    var timer;
    var tweets;

    api.getTweets().done(onLoad);
    return;
    

    function onLoad(tweets) {
      if ( !tweets || tweets.isError ) {
        tweets = [];
      }

      init(tweets);
      $items = $container.find('li');

      while ( $items.length < NUM_TWEETS + 1 ) {
        $container.append($items.clone());
        $items = $container.find('li');
      }

      $container.on({
        mouseenter: onMouseOver,
        mouseleave: onMouseOut
      });

      $items.css({
        opacity: 0
      }).velocity({
        opacity: 1
      }, {
        duration: 1000,
        easing: 'easeOutSine'
      });
      
      $items.eq(0).velocity({
        paddingLeft: [0, 100]
      }, {
        duration: 1000,
        easing: 'easeOutSine',
        queue: false
      }).promise().done(function() {
        timer = setTimeout(tick, 500);
      });

      firstItemWidth = $items.eq(0).width();
    }
    

    function init(tweets) {
      tweets = tweets.slice(0, NUM_TWEETS);

      var html = _.map(tweets, function(tweet) {
        return '<li>' + tweet + '</li>';
      }).join('');

      $container.append(html);
    }

    
    function onMouseOver(e) {
      clearTimeout(timer);
    }

    
    function onMouseOut(e) {
      clearTimeout(timer);
      timer = setTimeout(tick, INTERVAL);
    }
    

    function tick() {
      currentLeft += 0.5;

      if ( currentLeft >= firstItemWidth ) {
        currentLeft -= firstItemWidth + 10;
        $items.eq(0).css({
          marginLeft: 0
        }).appendTo($container);
        $items = $container.find('li');
        firstItemWidth = $items.eq(0).width();
      }

      $items.eq(0).css({
        marginLeft: -currentLeft
      });
      
      clearTimeout(timer);
      timer = setTimeout(tick, INTERVAL);
    }
  }
});
