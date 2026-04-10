(function () {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-carousel-track]");
  const slides = root.querySelectorAll("[data-carousel-slide]");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  const dotsContainer = root.querySelector("[data-carousel-dots]");

  const total = slides.length;
  if (!track || total === 0) return;

  root.style.setProperty("--carousel-count", String(total));

  let index = 0;

  function slidesPerView() {
    return window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
  }

  function pageCount() {
    return Math.max(1, Math.ceil(total / slidesPerView()));
  }

  function clampIndex() {
    var max = Math.max(0, pageCount() - 1);
    if (index > max) index = max;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    var pages = pageCount();
    for (var i = 0; i < pages; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", "Ir para slide " + (i + 1));
      b.setAttribute("aria-current", i === index ? "true" : "false");
      (function (pageIdx) {
        b.addEventListener("click", function () {
          index = pageIdx;
          update();
        });
      })(i);
      dotsContainer.appendChild(b);
    }
  }

  var viewport = root.querySelector(".carousel__viewport");

  function syncViewportHeight() {
    if (!viewport) return;
    var spv = slidesPerView();
    var start = index * spv;
    var maxH = 0;
    for (var i = start; i < Math.min(start + spv, total); i++) {
      var h = slides[i].getBoundingClientRect().height;
      if (h > maxH) maxH = h;
    }
    if (maxH > 0) viewport.style.height = maxH + "px";
  }

  function goNextSlide() {
    var lastPage = pageCount() - 1;
    index = index >= lastPage ? 0 : index + 1;
    update();
  }

  function update() {
    clampIndex();
    var spv = slidesPerView();
    var pct = (index * spv * 100) / total;
    track.style.transform = "translateX(-" + pct + "%)";
    // Loop infinito: nunca desabilita as setas
    if (prev) prev.disabled = false;
    if (next) next.disabled = false;
    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll(".carousel__dot");
      dots.forEach(function (d, i) {
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }
    requestAnimationFrame(function () {
      syncViewportHeight();
    });
  }

  function onResize() {
    clampIndex();
    renderDots();
    update();
  }

  if (window.ResizeObserver && viewport) {
    var ro = new ResizeObserver(function () {
      syncViewportHeight();
    });
    slides.forEach(function (slide) {
      ro.observe(slide);
    });
  }

  if (prev) {
    prev.addEventListener("click", function () {
      var lastPage = pageCount() - 1;
      index = index <= 0 ? lastPage : index - 1;
      update();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      goNextSlide();
    });
  }

  window.addEventListener("resize", onResize);
  if (window.matchMedia) {
    var mq = window.matchMedia("(min-width: 768px)");
    if (mq.addEventListener) {
      mq.addEventListener("change", onResize);
    } else if (mq.addListener) {
      mq.addListener(onResize);
    }
  }

  renderDots();
  update();
  window.addEventListener("load", function () {
    syncViewportHeight();
  });
})();
