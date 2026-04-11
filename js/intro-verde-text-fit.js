(function () {
  var root = document.querySelector(".intro-verde");
  if (!root) return;

  var copy = root.querySelector(".intro-verde__copy");
  var subtitle = root.querySelector(".intro-verde__subtitle");
  var textBlock = root.querySelector(".intro-verde__text");
  if (!copy || !subtitle || !textBlock) return;

  var subtitleLines = subtitle.querySelectorAll(".intro-verde__subtitle-line");
  var textLines = textBlock.querySelectorAll(".intro-verde__text-line");
  if (subtitleLines.length === 0 || textLines.length === 0) return;

  var rootFontPx = function () {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  };

  function parseLenToPx(s) {
    if (!s) return 0;
    s = String(s).trim();
    var n = parseFloat(s);
    if (s.endsWith("rem")) return n * rootFontPx();
    if (s.endsWith("px")) return n;
    if (s.includes("calc")) return 0;
    return n;
  }

  function readCssVarPx(el, name, fallbackPx) {
    var raw = getComputedStyle(el).getPropertyValue(name).trim();
    var px = parseLenToPx(raw);
    if (px > 0) return px;
    if (raw.indexOf("calc") !== -1) {
      var probe = document.createElement("span");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;font-size:" +
        raw +
        ";";
      document.body.appendChild(probe);
      px = parseFloat(getComputedStyle(probe).fontSize) || 0;
      document.body.removeChild(probe);
      if (px > 0) return px;
    }
    return fallbackPx;
  }

  function blockLinesFit(el, lines, sizePx) {
    el.style.fontSize = sizePx + "px";
    var w = el.clientWidth;
    if (w <= 0) return true;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].scrollWidth > w + 2) return false;
    }
    return true;
  }

  function fitBlock(el, lines, maxVar, minVar, fallbackMax, fallbackMin) {
    var maxPx = readCssVarPx(el, maxVar, fallbackMax);
    var minPx = readCssVarPx(el, minVar, fallbackMin);
    if (minPx >= maxPx) {
      el.style.fontSize = minPx + "px";
      return;
    }
    if (blockLinesFit(el, lines, maxPx)) {
      el.style.fontSize = maxPx + "px";
      return;
    }
    var lo = minPx;
    var hi = maxPx;
    for (var k = 0; k < 28; k++) {
      var mid = (lo + hi) / 2;
      if (blockLinesFit(el, lines, mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    el.style.fontSize = lo + "px";
  }

  var layoutTries = 0;

  function fitAll() {
    subtitle.style.fontSize = "";
    textBlock.style.fontSize = "";
    if (copy.clientWidth <= 2 && layoutTries < 8) {
      layoutTries++;
      requestAnimationFrame(fitAll);
      return;
    }
    layoutTries = 0;
    fitBlock(subtitle, subtitleLines, "--intro-subtitle-max", "--intro-subtitle-min", 34, 11);
    fitBlock(textBlock, textLines, "--intro-text-max", "--intro-text-min", 14, 10);
  }

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
    var ro = new ResizeObserver(schedule);
    ro.observe(copy);
  }
  window.addEventListener("resize", schedule);

  function start() {
    schedule();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
