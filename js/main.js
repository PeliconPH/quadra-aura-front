import "./hero-text-fit.js";
import "./intro-verde-text-fit.js";
import "./video-modal.js";
import "./phone-mask.js";
import "./lead-submit.js";

var carouselRoot = document.querySelector("[data-carousel]");
if (carouselRoot) {
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            io.disconnect();
            import("./carousel.js");
            return;
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(carouselRoot);
  } else {
    import("./carousel.js");
  }
}
