/* Pointer-driven 3D tilt for cards, live score readouts,
   a submit loading state, and the result-card flip reveal. */

(function () {
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function applyTilt(el, strength) {
    if (reduceMotion || !el) return;
    var rect;

    el.addEventListener("mousemove", function (e) {
      rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform =
        "rotateX(" + (-py * strength).toFixed(2) + "deg) rotateY(" +
        (px * strength).toFixed(2) + "deg)";
    });

    el.addEventListener("mouseleave", function () {
      el.style.transform = el.dataset.restTransform || "";
    });
  }

  var reportCard = document.querySelector(".report-card");
  if (reportCard) {
    reportCard.dataset.restTransform = "rotateX(8deg) rotateY(-14deg)";
    applyTilt(reportCard, 10);
  }

  var formCard = document.querySelector(".form-card");
  applyTilt(formCard, 4);

  document.querySelectorAll(".score-field input[type='number']").forEach(
    function (input) {
      var out = input.parentElement.querySelector(".score-value");
      if (!out) return;
      var sync = function () {
        out.textContent = input.value ? input.value + " / 100" : "— / 100";
      };
      input.addEventListener("input", sync);
      sync();
    }
  );

  var form = document.querySelector(".predict-form");
  if (form) {
    form.addEventListener("submit", function () {
      var btn = form.querySelector(".submit-btn");
      if (btn) {
        btn.dataset.loading = "true";
        btn.textContent = "Predicting…";
      }
    });
  }

  var resultCard = document.querySelector(".result-card");
  if (resultCard && resultCard.dataset.hasResult === "true") {
    window.addEventListener("load", function () {
      setTimeout(function () {
        resultCard.dataset.revealed = "true";
      }, 350);
    });
  }
})();
