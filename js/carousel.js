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

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", "Ir para slide " + (i + 1));
      b.setAttribute("aria-current", i === index ? "true" : "false");
      b.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsContainer.appendChild(b);
    }
  }

  function update() {
    var pct = (index * 100) / total;
    track.style.transform = "translateX(-" + pct + "%)";
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index >= total - 1;
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".carousel__dot");
      dots.forEach((d, i) =>
        d.setAttribute("aria-current", i === index ? "true" : "false")
      );
    }
  }

  if (prev) {
    prev.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      update();
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      index = Math.min(total - 1, index + 1);
      update();
    });
  }

  renderDots();
  update();
})();
