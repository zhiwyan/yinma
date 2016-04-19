// Generated by CoffeeScript 1.9.3
var AnimateBar, AnimateNum, backTop, carousel, noticeUtil, redDot, serverData;

serverData = {};

$('#server-data').children('input').each(function() {
  var $this;
  $this = $(this);
  serverData[$this.attr('name')] = $this.val();
});

(function() {
  var lastTime, vendors, x;
  lastTime = 0;
  vendors = ['ms', 'moz', 'webkit', 'o'];
  x = 0;
  while (x < vendors.length && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    ++x;
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = (new Date).getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout((function() {
        callback(currTime + timeToCall);
      }), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();


if(!Function.prototype.bind){Function.prototype.bind=function(a){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var e=Array.prototype.slice.call(arguments,1),d=this,b=function(){},c=function(){return d.apply(this instanceof b&&a?this:a||window,e.concat(Array.prototype.slice.call(arguments)))};b.prototype=this.prototype;c.prototype=new b();return c}};
function supportCss3(d){var f=["webkit","Moz","ms","o"],c,e=[],a=document.documentElement.style,b=function(g){return g.replace(/-(\w)/g,function(i,h){return h.toUpperCase()})};for(c in f){e.push(b(f[c]+"-"+d))}e.push(b(d));for(c in e){if(e[c] in a){return true}}return false};
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c,d){var b;if(this==null){throw new TypeError('"this" is null or not defined')}var e=Object(this);var a=e.length>>>0;if(a===0){return -1}var f=+d||0;if(Math.abs(f)===Infinity){f=0}if(f>=a){return -1}b=Math.max(f>=0?f:a-Math.abs(f),0);while(b<a){if(b in e&&e[b]===c){return b}b++}return -1}};
;

$('.banner-container').slick({
  dots: true,
  fade: true,
  autoplay: true,
  arrows: false,
  pauseOnHover: false
});

$('.preheat .proj-container').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  pauseOnHover: false
});

$(".nano").nanoScroller({
  preventPageScrolling: true
});

AnimateNum = (function() {
  function AnimateNum($elm, duration1) {
    this.duration = duration1 != null ? duration1 : 1e3;
    this.$elm = $elm.eq(0);
    this.animate();
  }

  AnimateNum.prototype.animate = function() {
    var i, integer, num, precision, prefix, stepInterval, stepNum, suffix, target, that;
    that = this;
    target = this.$elm.text();
    that.target = target;
    prefix = target.replace(/[\d\.]+.*/, '');
    suffix = target.replace(/.*[\d\.]+/, '');
    target = target.match(/[\d\.]+/);
    target = target && target[0];
    if (!target) {
      return;
    }
    i = target.indexOf('.');
    precision = 0;
    stepInterval = 100 / 3;
    if (i >= 0) {
      precision = target.length - i - 1;
    }
    integer = parseInt(target.replace('.', ''));
    stepNum = integer * stepInterval / this.duration;
    num = 0;
    this.timer = setInterval(function() {
      num += stepNum;
      that.$elm.html(prefix + (new Number(num / Math.pow(10, precision)).toFixed(precision)) + suffix);
      if (num >= integer) {
        clearInterval(that.timer);
        return that.$elm.html(that.target);
      }
    }, stepInterval);
  };

  return AnimateNum;

})();

AnimateBar = (function() {
  function AnimateBar($elm) {
    this.$elm = $elm.eq(0);
    this.animate();
  }

  AnimateBar.prototype.animate = function() {
    var $thumb, percent, step, target, that;
    target = parseInt(this.$elm.data('target'));
    $thumb = this.$elm.find('.thumb');
    if (!target) {
      return;
    }
    if (target > 100) {
      target = 100;
    }
    if (target < 0) {
      target = 0;
    }
    percent = 0;
    that = this;
    step = function() {
      percent++;
      if (percent > target) {
        cancelAnimationFrame(this.timer);
        return $thumb.css('left', (target - 100) + "%");
      } else {
        $thumb.css('left', (percent - 100) + "%");
        return requestAnimationFrame(step);
      }
    };
    return this.timer = requestAnimationFrame(step);
  };

  return AnimateBar;

})();

carousel = (function() {
  var $bannerSection, $container, that;
  $container = $('.banner-container');
  $bannerSection = $('.banner-section');
  that = {};
  that.init = function() {
    var duration;
    $bannerSection.find('.prev').click(function() {
      return $container.slick('slickPrev');
    });
    $bannerSection.find('.next').click(function() {
      return $container.slick('slickNext');
    });
    if (!supportCss3('transition')) {
      duration = 500;
      return $('.banner-section').find('.prev, .next').fadeTo(duration, 0.3).hover(function() {
        return $(this).fadeTo(duration, 1);
      }, function() {
        return $(this).fadeTo(duration, 0.3);
      });
    }
  };
  return that;
})();

noticeUtil = (function() {
  var $cContent, $cMore, $cTitle, $content, bindEvent, cancelLoading, getNoticeContent, setLoading, that;
  $content = $('.notice-content-box');
  $cTitle = $content.find('.title');
  $cContent = $content.find('.content');
  $cMore = $content.find('.more');
  setLoading = function() {
    return $cContent.addClass('loading');
  };
  cancelLoading = function() {
    return $cContent.removeClass('loading');
  };
  getNoticeContent = function(type, id, title, href) {
    $cTitle.html(title).attr('href', href);
    $cMore.attr('href', href);
    setLoading();
    return $.getJSON(serverData.getinfo, {
      type: type,
      id: id
    }).then(function(json) {
      if (json.status) {
        $cContent.html(json.content);
        return cancelLoading();
      }
    });
  };
  bindEvent = function() {
    var $tabTitle;
    $('.notice-item').click(function() {
      var $this, $titleLink;
      $this = $(this);
      $this.siblings('.cur').removeClass('cur');
      $this.addClass('cur');
      $titleLink = $this.find('.title-link');
      getNoticeContent($this.parents('.panel').eq(0).data('type'), $this.data('id'), $titleLink.text(), $titleLink.data('href'));
      return false;
    });
    return $tabTitle = $('.header .tab-title').click(function() {
      var $cur, $panel, $this, idx;
      $tabTitle.filter('.active').removeClass('active');
      $this = $(this);
      $this.addClass('active');
      idx = $this.index();
      $('.notice-box .panel-list').css('left', '-' + idx * 100 + '%');
      $panel = $('.panel-list .panel').eq(idx);
      $cur = $panel.find('.cur');
      if (!$cur.length) {
        $cur = $panel.find('.notice-item').eq(0);
      }
      return $cur.trigger('click');
    });
  };
  that = {};
  that.init = function() {
    bindEvent();
    return $('.news-panel .notice-item').eq(0).trigger('click');
  };
  return that;
})();

redDot = (function() {
  var addRedDot, bindEvent, that;
  bindEvent = function() {
    var buildStr, removeRedDot;
    buildStr = function(str, id) {
      var _id, arr, j, len, newArr;
      if (str == null) {
        str = '';
      }
      arr = str.trim().split(',');
      newArr = [];
      for (j = 0, len = arr.length; j < len; j++) {
        _id = arr[j];
        if (_id) {
          newArr.push(parseInt(_id));
        }
      }
      if (newArr.indexOf(id) === -1) {
        newArr.push(id);
      }
      return newArr.join(',');
    };
    removeRedDot = function(itemKeyName, $this, isTrigger) {
      var $count, count, id;
      if (isTrigger) {
        return;
      }
      if ($this.find('.red-dot').removeClass('red-dot').length) {
        id = $this.data('id');
        id = parseInt(id) || 0;
        localStorage.setItem(itemKeyName, buildStr(localStorage.getItem(itemKeyName), id));
        $count = $('#new-notice-count');
        count = parseInt($count.text());
        if (count) {
          $count.text(count - 1);
        }
        if (!count || count === 1) {
          return $count.addClass('hidden');
        }
      }
    };
    $('.news-panel .notice-item').click(function(e) {
      return removeRedDot('recentReadNews', $(this), e.isTrigger);
    });
    $('.notice-panel .notice-item').click(function(e) {
      return removeRedDot('recentReadNotice', $(this), e.isTrigger);
    });
    return $('.notice-content-box').click(function() {
      var $activePanel;
      $activePanel = $('.' + $('.tab-title.active').data('panel'));
      return removeRedDot('recentReadNotice', $activePanel.find('.cur'), false);
    });
  };
  addRedDot = function() {
    var hasNewNews, newNoticeCount, newsList, noticeList, recentReadNews, recentReadNotice;
    newsList = serverData.newslist;
    noticeList = serverData.noticelist;
    newsList = newsList ? newsList.split(',') : [];
    noticeList = noticeList ? noticeList.split(',') : [];
    recentReadNews = localStorage.getItem('recentReadNews');
    recentReadNotice = localStorage.getItem('recentReadNotice');
    recentReadNews = recentReadNews ? recentReadNews.split(',') : [];
    recentReadNotice = recentReadNotice ? recentReadNotice.split(',') : [];
    hasNewNews = false;
    newNoticeCount = 0;
    $('.news-panel .notice-item').each(function() {
      var $this, id;
      $this = $(this);
      id = '' + $this.data('id');
      if (newsList.indexOf(id) > -1 && recentReadNews.indexOf(id) === -1) {
        $this.find('.title-link').children().addClass('red-dot');
        return hasNewNews = true;
      }
    });
    $('.notice-panel .notice-item').each(function() {
      var $this, id;
      $this = $(this);
      id = '' + $this.data('id');
      if (noticeList.indexOf(id) > -1 && recentReadNotice.indexOf(id) === -1) {
        $this.find('.title-link').children().addClass('red-dot');
        return newNoticeCount += 1;
      }
    });

    /*if hasNewNews
        $('#tab-title-news').addClass 'red-dot'
     */
    if (newNoticeCount) {
      return $('#new-notice-count').removeClass('hidden').text(newNoticeCount);
    }
  };
  that = {};
  that.init = function() {
    addRedDot();
    return bindEvent();
  };
  return that;
})();

backTop = (function() {
  var $fixedTools, $window, show, tryShowBackTop;
  show = -1;
  $fixedTools = $('#fixed-tools');
  $window = $(window);
  tryShowBackTop = function() {
    var a, b;
    a = $window.scrollTop();
    b = $window.height();
    if (a > b * 0.38) {
      if (show !== 1) {
        show = 1;
        return $fixedTools.fadeIn('slow');
      }
    } else {
      if (show !== 0) {
        show = 0;
        return $fixedTools.fadeOut('slow');
      }
    }
  };
  return {
    init: function() {
      $window.on('scroll', tryShowBackTop);
      return $('.back-top').click(function() {
        $('html,body').animate({
          scrollTop: 0
        }, 400);
        return false;
      });
    }
  };
})();

$(function() {
  var $animateBar, $animateNum, $window, tryAnimate;
  $window = $(window);
  $animateNum = $('.animate-num').one('a', function() {
    new AnimateNum($(this), 1500);
  });
  $animateBar = $('.animate-bar').one('a', function() {
    new AnimateBar($(this));
  });
  tryAnimate = function() {
    var a, b, inView;
    a = $window.scrollTop();
    b = $window.height();
    inView = function() {
      var $this, c, d;
      $this = $(this);
      c = $this.offset().top;
      d = $this.height();
      return c + d >= a && c <= a + b;
    };
    $animateNum = $animateNum.not($animateNum.filter(inView).trigger('a'));
    $animateBar = $animateBar.not($animateBar.filter(inView).trigger('a'));
  };
  $window.scroll(tryAnimate);
  $window.bind('load', tryAnimate);
  $('.proj-box').click(function() {
    var href;
    href = $(this).find('.img-box').children().attr('href');
    return href && (location.href = href);
  });
  redDot.init();
  noticeUtil.init();
  carousel.init();
  return backTop.init();
});
