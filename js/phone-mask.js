(function () {
  function digitsOnly(str) {
    return str.replace(/\D/g, "");
  }

  function normalizeBRDigits(digits) {
    var d = digits;
    if (d.length > 11 && d.slice(0, 2) === "55") {
      d = d.slice(2);
    }
    return d.slice(0, 11);
  }

  function formatBRPhone(digits) {
    var d = normalizeBRDigits(digits);
    if (!d.length) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) {
      return (
        "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6)
      );
    }
    return (
      "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7, 11)
    );
  }

  function bind(input) {
    function apply() {
      var formatted = formatBRPhone(digitsOnly(input.value));
      if (input.value !== formatted) {
        input.value = formatted;
      }
    }

    input.addEventListener("input", apply);
    input.addEventListener("paste", function () {
      requestAnimationFrame(apply);
    });
  }

  document.querySelectorAll('.lead-form input[type="tel"]').forEach(bind);
})();
