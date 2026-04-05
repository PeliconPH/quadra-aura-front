(function () {
  var base = (
    import.meta.env.BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  /** Sem URL no .env, em dev usa POST /lead com proxy do Vite → localhost:3001 */
  var leadUrl = base ? base + "/lead" : "/lead";

  function digitsOnly(s) {
    return String(s || "").replace(/\D/g, "");
  }

  function getFeedbackEl(form) {
    var el = form.querySelector("[data-lead-feedback]");
    if (!el) {
      el = document.createElement("p");
      el.className = "lead-form__feedback";
      el.setAttribute("data-lead-feedback", "");
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      var submit = form.querySelector(".btn--lead-submit");
      if (submit && submit.parentNode) {
        submit.parentNode.insertBefore(el, submit);
      } else {
        form.appendChild(el);
      }
    }
    return el;
  }

  function setFeedback(form, type, message) {
    var el = getFeedbackEl(form);
    el.textContent = message;
    el.classList.remove(
      "lead-form__feedback--success",
      "lead-form__feedback--error"
    );
    if (type === "success") el.classList.add("lead-form__feedback--success");
    if (type === "error") el.classList.add("lead-form__feedback--error");
  }

  function clearFeedback(form) {
    var el = form.querySelector("[data-lead-feedback]");
    if (el) {
      el.textContent = "";
      el.classList.remove(
        "lead-form__feedback--success",
        "lead-form__feedback--error"
      );
    }
  }

  function buildPayload(form) {
    var fd = new FormData(form);
    var name = (fd.get("name") || "").toString().trim();
    var email = (fd.get("email") || "").toString().trim();
    var phone = (fd.get("phone") || "").toString().trim();
    var privacyInput = form.querySelector('input[name="privacy_accept"]');
    var privacyAccepted = !!(privacyInput && privacyInput.checked);
    var radio = form.querySelector(
      'fieldset input[type="radio"][name^="contact-"]:checked'
    );
    var preferredContact = radio ? radio.value : "";

    return {
      name: name,
      email: email,
      phone: phone,
      phoneDigits: digitsOnly(phone),
      preferredContact: preferredContact,
      privacyAccepted: privacyAccepted,
      placement: form.getAttribute("data-lead-placement") || "unknown",
    };
  }

  async function parseErrorMessage(res) {
    var text = await res.text();
    if (!text) return res.statusText || "Erro ao enviar.";
    try {
      var j = JSON.parse(text);
      if (j && (j.message || j.error)) return j.message || j.error;
    } catch (_) {}
    if (text.length < 200) return text;
    return "Erro ao enviar (código " + res.status + ").";
  }

  function bindForm(form) {
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      clearFeedback(form);

      var btn = form.querySelector(".btn--lead-submit");
      if (!btn) return;

      var payload = buildPayload(form);
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      var label = btn.textContent;
      btn.textContent = "Enviando…";

      try {
        var res = await fetch(leadUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setFeedback(
            form,
            "success",
            "Recebemos seus dados. Em breve entraremos em contato."
          );
          form.reset();
          var checked = form.querySelector(
            'input[type="radio"][name^="contact-"][value="whatsapp"]'
          );
          if (checked) checked.checked = true;
        } else {
          var msg = await parseErrorMessage(res);
          setFeedback(form, "error", msg);
        }
      } catch (_) {
        setFeedback(
          form,
          "error",
          "Não foi possível conectar ao servidor. Verifique se a API está rodando."
        );
      } finally {
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
        btn.textContent = label;
      }
    });
  }

  document.querySelectorAll("form.lead-form").forEach(bindForm);
})();
