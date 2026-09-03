(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Copy CA */
  var copyBtn = document.getElementById("copy-ca");
  var caValue = document.getElementById("ca-value");

  if (copyBtn && caValue) {
    copyBtn.addEventListener("click", function () {
      var text = caValue.textContent.trim();
      var done = function () {
        var prev = copyBtn.textContent;
        copyBtn.textContent = "COPIED";
        copyBtn.classList.add("is-copied");
        window.setTimeout(function () {
          copyBtn.textContent = prev || "COPY";
          copyBtn.classList.remove("is-copied");
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text, done);
        });
      } else {
        fallbackCopy(text, done);
      }
    });
  }

  function fallbackCopy(text, done) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(area);
  }

  /* Scroll reveals */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* Occasional glitch on headlines */
  if (!reduceMotion) {
    var glitchTargets = document.querySelectorAll(".glitch-target");

    function pulseGlitch() {
      if (!glitchTargets.length) return;
      var el = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
      el.classList.add("is-glitching");
      window.setTimeout(function () {
        el.classList.remove("is-glitching");
      }, 180);
    }

    window.setInterval(pulseGlitch, 4200);
    window.setTimeout(pulseGlitch, 1200);
  }

  /* Terminal model output cycle */
  var lines = [
    "buy low. forget password.",
    "model confidence: unfortunately high",
    "training complete. intelligence pending.",
    "frog detected.",
    "the model has left the lab.",
    "meme dataset: contaminated.",
    "nobody checked the training data.",
    "chaos: converged.",
    "artificial intelligence. natural stupidity."
  ];

  var lineEl = document.getElementById("model-line");
  var lineIndex = 0;

  function typeLine(text, cb) {
    if (!lineEl) return;
    if (reduceMotion) {
      lineEl.textContent = text;
      if (cb) cb();
      return;
    }

    lineEl.classList.add("is-typing");
    lineEl.textContent = "";
    var i = 0;

    function step() {
      if (i <= text.length) {
        lineEl.textContent = text.slice(0, i);
        i += 1;
        window.setTimeout(step, 28 + Math.random() * 24);
      } else {
        lineEl.classList.remove("is-typing");
        if (cb) cb();
      }
    }

    step();
  }

  function cycleLines() {
    if (!lineEl) return;
    typeLine(lines[lineIndex], function () {
      lineIndex = (lineIndex + 1) % lines.length;
      window.setTimeout(cycleLines, reduceMotion ? 4000 : 3200);
    });
  }

  if (lineEl) {
    cycleLines();
  }
})();
