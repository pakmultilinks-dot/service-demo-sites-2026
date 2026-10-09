/* Crumb & Craft Bakery - demo concept. Shared interactivity. */
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
        link.style.color = "#c2571f";
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


  /* ---------- Menu filter ---------- */
  var filterBtns = document.getElementById("filterBtns");
  if (filterBtns) {
    filterBtns.querySelectorAll(".fbtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.querySelectorAll(".fbtn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        document.querySelectorAll(".mitem").forEach(function (it) {
          var show = (f === "all") || (it.getAttribute("data-cat") === f);
          it.classList.toggle("hidden", !show);
          if (show) { it.classList.remove("visible"); }
        });
        if ("IntersectionObserver" in window) {
          document.querySelectorAll(".mitem:not(.hidden)").forEach(function (it) { it.classList.add("visible"); });
        }
      });
    });
  }


  /* ---------- Cake builder ---------- */
  var cakeForm = document.getElementById("cakeForm");
  if (cakeForm) {
    var out = document.getElementById("cakeOut");
    function r5(n) { return Math.round(n / 5) * 5; }
    cakeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var size = document.getElementById("cakeSize").value;
      var layers = document.getElementById("cakeLayers").value;
      var flavor = document.getElementById("cakeFlavor").value;
      var base = { "6": 45, "8": 65, "10": 90 }[size];
      var mult = { "2": 1.0, "3": 1.35, "4": 1.6 }[layers];
      var low = r5(base * mult * 0.9), high = r5(base * mult * 1.25);
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#c2571f">Sample price guide</p>' +
        '<p class="font-display text-2xl md:text-3xl mt-2" style="color:#33241a">' + size + '-inch, ' + layers + ' layers, ' + flavor + '</p>' +
        '<p class="text-4xl font-extrabold mt-3" style="color:#33241a">$' + low + ' <span class="text-xl font-semibold text-stone-400">to</span> $' + high + '</p>' +
        '<p class="text-sm text-stone-500 mt-3">Sample price guide for this demo concept, not a real quote. Detailed designs and sugar work are quoted individually.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }


  /* ---------- Fresh board day picker ---------- */
  var bakeDays = document.getElementById("bakeDays");
  if (bakeDays) {
    var FRESH = {"0": ["Cinnamon morning buns", "Country sourdough", "Cafe au lait cake"], "1": ["Butter croissants", "Seeded whole wheat"], "2": ["Almond danishes", "Ciabatta", "Banana bread"], "3": ["Butter croissants", "Country sourdough"], "4": ["Cinnamon morning buns", "Seeded whole wheat", "Focaccia"], "5": ["Full weekend spread", "Berry chantilly cakes", "Morning buns"], "6": ["Full weekend spread", "Chocolate layer cakes", "Croissants"]};
    var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var info = document.getElementById("bakeInfo");
    var today = new Date();
    function renderFresh(dow) {
      var items = FRESH[dow].map(function (x) { return "<li>" + x + "</li>"; }).join("");
      info.innerHTML =
        '<p class="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Sample fresh board</p>' +
        '<ul class="font-display text-xl md:text-2xl mt-2 space-y-1">' + items + '</ul>' +
        '<p class="text-xs opacity-60 mt-4">Sample illustration for this demo concept. The real board is written in chalk every morning.</p>';
    }
    for (var di = 0; di < 7; di++) {
      (function (offset) {
        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
        var dow = d.getDay();
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sched-day" + (offset === 0 ? " selected" : "");
        btn.innerHTML = '<span class="block text-xs font-semibold opacity-70">' + (offset === 0 ? "Today" : DOW[dow]) + '</span>' +
          '<span class="block font-bold">' + MON[d.getMonth()] + " " + d.getDate() + "</span>";
        btn.addEventListener("click", function () {
          bakeDays.querySelectorAll(".sched-day").forEach(function (x) { x.classList.remove("selected"); });
          btn.classList.add("selected");
          renderFresh(dow);
        });
        bakeDays.appendChild(btn);
      })(di);
    }
    renderFresh(today.getDay());
  }

})();
