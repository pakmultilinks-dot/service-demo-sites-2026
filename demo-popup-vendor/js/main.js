/* PopShop Collective - demo concept. Shared interactivity. */
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
        link.style.color = "#e14d2a";
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


  /* ---------- Events calendar ---------- */
  var calGrid = document.getElementById("calGrid");
  if (calGrid) {
    var EVENTS = [{"d": 6, "t": "Saturday Makers Market", "det": "60+ local makers, food trucks, and live music. 10am-4pm. Free entry."}, {"d": 13, "t": "Night Market: Neon Edition", "det": "Evening shopping under string lights with cocktails and a DJ. 5pm-10pm."}, {"d": 20, "t": "Vintage and Vinyl Fair", "det": "Vintage sellers and record dealers take over the lot. 10am-4pm."}, {"d": 27, "t": "Food Truck Rally", "det": "Twelve local food trucks, one parking lot. 11am-8pm. Free entry."}];
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("calTitle").textContent = MON[m] + " " + y;
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var detail = document.getElementById("calDetail");
    var byDay = {};
    EVENTS.forEach(function (ev) { byDay[ev.d] = ev; });
    function showEvent(ev, cell) {
      calGrid.querySelectorAll(".cal-day").forEach(function (c) { c.classList.remove("selected"); });
      if (cell) cell.classList.add("selected");
      detail.innerHTML =
        '<p class="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Sample event</p>' +
        '<p class="font-display text-2xl md:text-3xl mt-2">' + ev.t + '</p>' +
        '<p class="mt-2 opacity-80">' + ev.det + '</p>' +
        '<a href="contact.html" class="inline-block mt-4 font-bold underline underline-offset-4">Ask about this event</a>';
    }
    for (var i = 0; i < first; i++) {
      var pad = document.createElement("span");
      pad.className = "cal-day dim";
      calGrid.appendChild(pad);
    }
    for (var dd = 1; dd <= days; dd++) {
      (function (day) {
        var cell = document.createElement(dd === now.getDate() ? "span" : "span");
        var ev = byDay[day];
        cell.className = "cal-day" + (ev ? " event" : "");
        cell.textContent = day;
        if (ev) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "cal-day event w-full";
          b.textContent = day;
          b.setAttribute("aria-label", ev.t);
          b.addEventListener("click", function () { showEvent(ev, b); });
          calGrid.appendChild(b);
        } else {
          calGrid.appendChild(cell);
        }
      })(dd);
    }
  }


  /* ---------- Vendor showcase slider ---------- */
  var vendorTrack = document.getElementById("vendorTrack");
  if (vendorTrack) {
    var step = 300;
    var p = document.getElementById("vendPrev"), n = document.getElementById("vendNext");
    if (p) p.addEventListener("click", function () { vendorTrack.scrollBy({ left: -step, behavior: "smooth" }); });
    if (n) n.addEventListener("click", function () { vendorTrack.scrollBy({ left: step, behavior: "smooth" }); });
  }


  /* ---------- Stall fee estimator ---------- */
  var stallForm = document.getElementById("stallForm");
  if (stallForm) {
    var days = document.getElementById("stallDays");
    var daysVal = document.getElementById("stallDaysVal");
    var out = document.getElementById("stallOut");
    days.addEventListener("input", function () { daysVal.textContent = days.value; });
    stallForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var size = document.getElementById("stallSize").value;
      var d = parseInt(days.value, 10);
      var base = { table: [45, 60], half: [90, 120], full: [160, 210] }[size];
      var low = base[0] * d, high = base[1] * d;
      var sizeLabel = { table: "Market table", half: "Half stall", full: "Full stall" }[size];
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#e14d2a">Sample fee guide: ' + sizeLabel + ' x ' + d + ' day' + (d > 1 ? "s" : "") + '</p>' +
        '<p class="text-4xl font-extrabold mt-2" style="color:#2c2822">$' + low.toLocaleString() + ' <span class="text-xl font-semibold text-stone-400">to</span> $' + high.toLocaleString() + '</p>' +
        '<p class="text-sm text-stone-500 mt-3">Sample fee guide for this demo concept, not a real quote. Final fees depend on the event and placement.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

})();
