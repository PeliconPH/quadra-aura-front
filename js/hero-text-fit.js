(function () {
  var headline = document.querySelector(".hero__headline");
  var sub = document.querySelector(".hero__sub");
  var textHost = document.querySelector(".hero__text-container");
  if (!headline || !textHost) return;

  var headLines = headline.querySelectorAll(".hero__headline-line");
  var rootFontPx = function () {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  };

  function parseLenToPx(s) {
    if (!s) return 0;
    s = String(s).trim();
    var n = parseFloat(s);
    if (s.endsWith("rem")) return n * rootFontPx();
    if (s.endsWith("px")) return n;
    return n;
  }

  function readCssVarPx(el, name, fallbackPx) {
    var raw = getComputedStyle(el).getPropertyValue(name).trim();
    var px = parseLenToPx(raw);
    return px > 0 ? px : fallbackPx;
  }

  function headlineFits(sizePx) {
    headline.style.fontSize = sizePx + "px";
    var w = headline.clientWidth;
    if (w <= 0) return true;
    for (var i = 0; i < headLines.length; i++) {
      if (headLines[i].scrollWidth > w + 1) return false;
    }
    return true;
  }

  function fitHeadline() {
    if (headLines.length < 2) return;
    var maxPx = readCssVarPx(headline, "--hero-head-max", 76);
    var minPx = readCssVarPx(headline, "--hero-head-min", 13);
    if (minPx >= maxPx) {
      headline.style.fontSize = minPx + "px";
      return;
    }
    if (headlineFits(maxPx)) {
      headline.style.fontSize = maxPx + "px";
      return;
    }
    var lo = minPx;
    var hi = maxPx;
    for (var k = 0; k < 28; k++) {
      var mid = (lo + hi) / 2;
      if (headlineFits(mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    headline.style.fontSize = lo + "px";
  }

  function subFitsThreeLines(sizePx) {
    sub.style.fontSize = sizePx + "px";
    var lh = parseFloat(getComputedStyle(sub).lineHeight);
    var fs = parseFloat(getComputedStyle(sub).fontSize);
    if (!isFinite(lh) || lh <= fs * 1.02) lh = fs * 1.35;
    if (!isFinite(lh) || lh <= 0) lh = 16;
    return sub.scrollHeight <= lh * 3 + 3;
  }

  function fitSub() {
    if (!sub) return;
    var maxPx = readCssVarPx(sub, "--hero-sub-max", 38);
    var minPx = readCssVarPx(sub, "--hero-sub-min", 11);
    if (minPx >= maxPx) {
      sub.style.fontSize = minPx + "px";
      return;
    }
    if (subFitsThreeLines(maxPx)) {
      sub.style.fontSize = maxPx + "px";
      return;
    }
    var lo = minPx;
    var hi = maxPx;
    for (var k = 0; k < 28; k++) {
      var mid = (lo + hi) / 2;
      if (subFitsThreeLines(mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    sub.style.fontSize = lo + "px";
  }

  var layoutTries = 0;

  function fitAll() {
    headline.style.fontSize = "";
    if (sub) sub.style.fontSize = "";
    if (headline.clientWidth <= 2 && layoutTries < 8) {
      layoutTries++;
      requestAnimationFrame(fitAll);
      return;
    }
    layoutTries = 0;
    fitHeadline();
    fitSub();
  }

  var ro;
  var t;
  function schedule() {
    clearTimeout(t);
    t = setTimeout(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(fitAll);
      });
    }, 60);
  }

  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(schedule);
    ro.observe(textHost);
  }
  window.addEventListener("resize", schedule);

  function start() {
    schedule();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start);
    } else {
      start();
    }
  }
})();
