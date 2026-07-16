/* Credproof — interactions */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header */
  const header = document.getElementById("site-header");
  let ticking = false;

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateHeader();

  /* Mobile nav */
  const mobileToggle = document.querySelector(".nav-mobile-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.classList.remove("is-open");
    mobileToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    setTimeout(function () {
      if (!mobileNav.classList.contains("is-open")) mobileNav.hidden = true;
    }, 300);
  }

  function openMobileNav() {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.hidden = false;
    void mobileNav.offsetWidth;
    mobileNav.classList.add("is-open");
    mobileToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", function () {
      mobileNav.classList.contains("is-open") ? closeMobileNav() : openMobileNav();
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobileNav);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* Typing headline */
  const line1 = document.getElementById("type-line-1");
  const line2 = document.getElementById("type-line-2");
  const title = document.querySelector(".hero-title");
  const text1 = "One platform.";
  const text2 = "Trusted digital credentials.";
  const caret = document.createElement("span");
  caret.className = "type-caret";
  caret.setAttribute("aria-hidden", "true");

  function typeText(el, text, speed) {
    return new Promise(function (resolve) {
      el.textContent = "";
      const node = document.createTextNode("");
      el.appendChild(node);
      el.appendChild(caret);
      let i = 0;
      function tick() {
        node.data = text.slice(0, i);
        i += 1;
        if (i <= text.length) {
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  async function runTyping() {
    if (!line1 || !line2 || !title) return;
    if (reducedMotion) {
      line1.textContent = text1;
      line2.textContent = text2;
      title.classList.add("is-done");
      return;
    }
    await typeText(line1, text1, 42);
    await new Promise(function (r) {
      setTimeout(r, 220);
    });
    await typeText(line2, text2, 36);
    setTimeout(function () {
      title.classList.add("is-done");
      if (caret.parentNode) caret.parentNode.removeChild(caret);
    }, 900);
  }

  runTyping();

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Metrics */
  function formatNum(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function animateCount(el) {
    const target = Number(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const start = performance.now();
    const duration = 1800;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = prefix + formatNum(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + formatNum(target) + suffix;
    }

    requestAnimationFrame(frame);
  }

  const metrics = document.querySelectorAll(".metric-value[data-count]");
  if (metrics.length && "IntersectionObserver" in window) {
    const mio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.target.dataset.done) return;
          entry.target.dataset.done = "1";
          if (reducedMotion) {
            entry.target.textContent =
              (entry.target.getAttribute("data-prefix") || "") +
              formatNum(Number(entry.target.getAttribute("data-count"))) +
              (entry.target.getAttribute("data-suffix") || "");
          } else {
            animateCount(entry.target);
          }
          mio.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    metrics.forEach(function (m) {
      mio.observe(m);
    });
  }

  /* Journey rail */
  const journeySteps = [
    {
      label: "Issue",
      title: "Create credentials people can keep",
      body: "Universities, banks, and employers issue once. Holders reuse those proofs for years.",
      left: "4%",
      top: "50%",
      offset: 220,
    },
    {
      label: "Hold",
      title: "Put people in control of their proofs",
      body: "Credentials live in the user’s wallet — portable, private, and ready when needed.",
      left: "49%",
      top: "38%",
      offset: 110,
    },
    {
      label: "Verify",
      title: "Trust the answer in seconds",
      body: "Verification is cryptographic and fast. No chasing paper or calling the issuer.",
      left: "94%",
      top: "50%",
      offset: 20,
    },
  ];

  const stations = document.querySelectorAll(".journey-station");
  const journeyLabel = document.getElementById("journey-label");
  const journeyTitle = document.getElementById("journey-title");
  const journeyBody = document.getElementById("journey-body");
  const journeyCopy = document.querySelector(".journey-copy");
  const journeyBead = document.getElementById("journey-bead");
  const meterFg = document.getElementById("meter-fg");
  const meterText = document.getElementById("meter-text");
  const journey = document.getElementById("journey");
  let stepIndex = 0;
  let journeyTimer = null;

  function setJourney(index) {
    const step = journeySteps[index];
    if (!step) return;

    stations.forEach(function (btn, i) {
      const on = i === index;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    const apply = function () {
      if (journeyLabel) journeyLabel.textContent = step.label;
      if (journeyTitle) journeyTitle.textContent = step.title;
      if (journeyBody) journeyBody.textContent = step.body;
      if (meterText) meterText.textContent = "0" + (index + 1);
      if (meterFg) meterFg.style.strokeDashoffset = String(step.offset);
      if (journeyCopy) journeyCopy.classList.remove("is-fading");
    };

    if (journeyCopy && !reducedMotion) {
      journeyCopy.classList.add("is-fading");
      setTimeout(apply, 220);
    } else {
      apply();
    }

    if (journeyBead) {
      journeyBead.style.left = step.left;
      journeyBead.style.top = step.top;
    }

    stepIndex = index;
  }

  function startJourney() {
    if (reducedMotion || !stations.length) return;
    stopJourney();
    journeyTimer = setInterval(function () {
      setJourney((stepIndex + 1) % journeySteps.length);
    }, 4800);
  }

  function stopJourney() {
    if (journeyTimer) {
      clearInterval(journeyTimer);
      journeyTimer = null;
    }
  }

  stations.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setJourney(Number(btn.getAttribute("data-step")));
      startJourney();
    });
  });

  if (stations.length) {
    setJourney(0);
    startJourney();
    if (journey) {
      journey.addEventListener("mouseenter", stopJourney);
      journey.addEventListener("mouseleave", startJourney);
    }
  }

  /* Curved coverflow carousel — auto + drag only */
  const coverflow = document.getElementById("coverflow");
  const coverTrack = document.getElementById("coverflow-track");
  const coverCards = coverTrack ? Array.prototype.slice.call(coverTrack.querySelectorAll(".cover-card")) : [];

  if (coverCards.length) {
    let targetIndex = 0;
    let currentIndex = 0;
    let autoTimer = null;
    let dragging = false;
    let dragStartX = 0;
    let dragDelta = 0;

    function shortestDelta(from, to, len) {
      let d = ((to - from) % len + len) % len;
      if (d > len / 2) d -= len;
      return d;
    }

    function layout(progress) {
      const n = coverCards.length;
      const spacing = window.innerWidth < 700 ? 155 : 195;

      coverCards.forEach(function (card, i) {
        let offset = i - progress;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;

        const abs = Math.abs(offset);
        const rotateY = offset * -38;
        const translateX = offset * spacing;
        const translateZ = -Math.pow(abs, 1.15) * 95;
        const translateY = Math.pow(abs, 1.4) * 10;
        const scale = 1 - Math.min(abs * 0.08, 0.28);
        const opacity = Math.max(0.28, 1 - abs * 0.28);
        const blur = abs > 1.6 ? Math.min((abs - 1.6) * 1.2, 2.5) : 0;
        const z = Math.round(100 - abs * 10);

        card.style.zIndex = String(z);
        card.style.opacity = String(opacity);
        card.style.filter = blur ? "blur(" + blur + "px)" : "none";
        card.style.transform =
          "translate(-50%, -50%) translateX(" +
          translateX +
          "px) translateY(" +
          translateY +
          "px) translateZ(" +
          translateZ +
          "px) rotateY(" +
          rotateY +
          "deg) scale(" +
          scale +
          ")";
      });
    }

    function animate() {
      if (reducedMotion) {
        currentIndex = targetIndex;
        layout(currentIndex);
        return;
      }
      const n = coverCards.length;
      const delta = shortestDelta(currentIndex, targetIndex, n);
      currentIndex += delta * 0.075;
      if (currentIndex < 0) currentIndex += n;
      if (currentIndex >= n) currentIndex -= n;
      if (Math.abs(shortestDelta(currentIndex, targetIndex, n)) < 0.002) {
        currentIndex = targetIndex;
      }
      layout(currentIndex + (dragging ? dragDelta / 200 : 0));
      requestAnimationFrame(animate);
    }

    function goTo(i) {
      const n = coverCards.length;
      targetIndex = ((i % n) + n) % n;
    }

    function next() {
      goTo(targetIndex + 1);
    }

    function prev() {
      goTo(targetIndex - 1);
    }

    function restartAuto() {
      if (autoTimer) clearInterval(autoTimer);
      if (reducedMotion) return;
      autoTimer = setInterval(next, 4200);
    }

    coverCards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        goTo(i);
        restartAuto();
      });
    });

    if (coverflow) {
      coverflow.addEventListener("pointerdown", function (e) {
        dragging = true;
        dragStartX = e.clientX;
        dragDelta = 0;
        coverflow.setPointerCapture(e.pointerId);
        if (autoTimer) clearInterval(autoTimer);
      });
      coverflow.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        dragDelta = e.clientX - dragStartX;
      });
      function endDrag() {
        if (!dragging) return;
        dragging = false;
        if (Math.abs(dragDelta) > 50) {
          if (dragDelta < 0) next();
          else prev();
        }
        dragDelta = 0;
        restartAuto();
      }
      coverflow.addEventListener("pointerup", endDrag);
      coverflow.addEventListener("pointercancel", endDrag);
      coverflow.addEventListener("mouseenter", function () {
        if (autoTimer) clearInterval(autoTimer);
      });
      coverflow.addEventListener("mouseleave", restartAuto);
    }

    layout(0);
    requestAnimationFrame(animate);
    restartAuto();
  }

  /* Soft cursor glow — stays in ambient background layer */
  const ambient = document.querySelector(".ambient");
  const cursorGlow = document.getElementById("cursor-glow");

  if (ambient && cursorGlow && !reducedMotion) {
    let gx = window.innerWidth * 0.5;
    let gy = window.innerHeight * 0.35;
    let tx = gx;
    let ty = gy;

    window.addEventListener(
      "pointermove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );

    function loopGlow() {
      gx += (tx - gx) * 0.045;
      gy += (ty - gy) * 0.045;
      cursorGlow.style.transform = "translate(" + gx + "px, " + gy + "px)";
      requestAnimationFrame(loopGlow);
    }
    loopGlow();
  }
})();
