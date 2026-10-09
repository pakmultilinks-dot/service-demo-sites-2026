/* GatherRound Catering - demo concept. Shared interactivity. */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("closed");
      menuBtn.setAttribute("aria-expanded", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.add("closed");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav highlighting ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.style.color = "#c2410c";
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Sticky mobile call bar ---------- */
  var callBar = document.getElementById("callBar");
  if (callBar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) { callBar.classList.add("show"); }
      else { callBar.classList.remove("show"); }
    }, { passive: true });
  }

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById("tstTrack");
  if (track) {
    var slides = track.querySelectorAll(".tst-slide");
    var dotsWrap = document.getElementById("tstDots");
    var idx = 0, timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.className = "tst-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Show testimonial " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll(".tst-dot");
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dots.forEach(function (d, j) { d.classList.toggle("active", j === idx); });
    }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
    var prev = document.getElementById("tstPrev"), next = document.getElementById("tstNext");
    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(idx + 1); restart(); });
    restart();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = document.getElementById("lbImg");
    var lbCap = document.getElementById("lbCap");
    var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
    var cur = 0;
    function show(i) {
      cur = (i + items.length) % items.length;
      var img = items[cur].querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = items[cur].getAttribute("data-cap") || img.alt;
      lb.classList.remove("hiddenx");
      document.body.style.overflow = "hidden";
    }
    function hide() { lb.classList.add("hiddenx"); document.body.style.overflow = ""; }
    items.forEach(function (it, i) {
      it.addEventListener("click", function () { show(i); });
      it.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(i); } });
    });
    document.getElementById("lbClose").addEventListener("click", hide);
    document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    document.addEventListener("keydown", function (e) {
      if (lb.classList.contains("hiddenx")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  /* ---------- Demo contact form ---------- */
  var cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.getElementById("formDone");
      cForm.classList.add("hidden");
      if (done) done.classList.remove("hidden");
    });
  }

  /* ---------- Demo review form ---------- */
  var rForm = document.getElementById("reviewForm");
  if (rForm) {
    rForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.getElementById("reviewDone");
      rForm.classList.add("hidden");
      if (done) done.classList.remove("hidden");
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".count");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var dur = 1400, t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  /* ---------- Event type tabs ---------- */
  var eventTabs = document.getElementById("eventTabs");
  if (eventTabs) {
    eventTabs.querySelectorAll(".etab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        eventTabs.querySelectorAll(".etab").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-cat");
        document.querySelectorAll(".epanel").forEach(function (p) {
          p.classList.toggle("hidden", p.getAttribute("data-cat") !== cat);
        });
      });
    });
  }


  /* ---------- Catering estimator ---------- */
  var estForm = document.getElementById("estForm");
  if (estForm) {
    var PP = {
      wedding:   { buffet: [28, 42], plated: [45, 68], family: [34, 50] },
      corporate: { buffet: [22, 34], plated: [38, 55], family: [28, 42] },
      private:   { buffet: [24, 38], plated: [42, 62], family: [30, 46] }
    };
    var guests = document.getElementById("estGuests");
    var guestsVal = document.getElementById("estGuestsVal");
    var out = document.getElementById("estOut");
    guests.addEventListener("input", function () { guestsVal.textContent = guests.value; });
    function r10(n) { return Math.round(n / 10) * 10; }
    estForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = parseInt(guests.value, 10);
      var type = document.getElementById("estType").value;
      var style = document.getElementById("estStyle").value;
      var r = PP[type][style];
      var low = r10(g * r[0]), high = r10(g * r[1]);
      var typeLabel = { wedding: "Wedding", corporate: "Corporate event", private: "Private party" }[type];
      var styleLabel = { buffet: "buffet", plated: "plated dinner", family: "family-style" }[style];
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#c2410c">Sample estimate: ' + typeLabel + ', ' + styleLabel + ', ' + g + ' guests</p>' +
        '<p class="text-4xl font-extrabold mt-2" style="color:#26301f">$' + low.toLocaleString() + ' <span class="text-xl font-semibold text-stone-400">to</span> $' + high.toLocaleString() + '</p>' +
        '<p class="text-sm text-stone-500 mt-3">Sample estimate for this demo concept, not a real quote. Real proposals follow a tasting and consultation.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }


  /* ---------- Package selector ---------- */
  var pkgCards = document.getElementById("pkgCards");
  if (pkgCards) {
    var PKG_NAMES = ["The Gathering", "The Feast", "The Grand Table"];
    var pkgOut = document.getElementById("pkgOut");
    function renderPkg(i) {
      pkgOut.innerHTML =
        '<p class="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Sample package selected</p>' +
        '<p class="font-display text-2xl md:text-3xl mt-2">' + PKG_NAMES[i] + '</p>' +
        '<p class="mt-2 opacity-80">A great starting point. We customize every menu around your guest count, venue, and tastes.</p>' +
        '<a href="contact.html" class="inline-block mt-4 font-bold underline underline-offset-4">Start planning with this package</a>';
    }
    pkgCards.querySelectorAll(".pkg").forEach(function (card) {
      card.addEventListener("click", function () {
        pkgCards.querySelectorAll(".pkg").forEach(function (c) { c.classList.remove("selected"); });
        card.classList.add("selected");
        renderPkg(parseInt(card.getAttribute("data-pkg"), 10));
      });
    });
    renderPkg(0);
  }

})();
