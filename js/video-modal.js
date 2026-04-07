(function () {
  var EMBED = "https://www.youtube.com/embed/GkOlXI1ALr4";
  var dialog = document.getElementById("video-modal");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var iframe = dialog.querySelector("[data-video-modal-iframe]");
  var openers = document.querySelectorAll("[data-video-modal-open]");
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    if (iframe) {
      iframe.src =
        EMBED +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    }
    dialog.showModal();
    var closeBtn = dialog.querySelector(".video-modal__close");
    if (closeBtn && typeof closeBtn.focus === "function") {
      closeBtn.focus();
    }
  }

  function close() {
    dialog.close();
    if (iframe) iframe.src = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    close();
  });

  dialog.addEventListener("click", function (e) {
    if (!e.target.closest(".video-modal__panel")) {
      close();
    }
  });

  dialog.querySelectorAll("[data-video-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });
  });

  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      open();
    });
  });
})();
