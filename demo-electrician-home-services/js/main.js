/* BrightVolt Electric Co. - demo concept. Shared interactivity. No em-dash characters used. */
(function () {
  "use strict";
  var siteAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#f59e0b";

  /* Mobile nav */
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

  /* Active nav highlighting */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.style.color = siteAccent;
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    });
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Sticky mobile call bar */
  var callBar = document.getElementById("callBar");
  if (callBar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) { callBar.classList.add("show"); }
      else { callBar.classList.remove("show"); }
    }, { passive: true });
  }

  /* Testimonial slider */
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

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* Gallery lightbox */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = document.getElementById("lbImg");
    var lbCap = document.getElementById("lbCap");
    var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
    var cur = 0;
    function show(i) {
      cur = (i + items.length) % items.length;
      var img = items[cur].querySelector("img");
      lbImg.src = img.src; lbImg.alt = img.alt;
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

  /* Demo contact form */
  var cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.getElementById("formDone");
      cForm.classList.add("hidden");
      if (done) done.classList.remove("hidden");
    });
  }

  /* Animated counters */
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

  /* Appointment scheduler (contact page) */
  var schedDays = document.getElementById("schedDays");
  if (schedDays) {
    var SLOTS = ["8-10 AM", "10 AM-12 PM", "12-2 PM", "2-4 PM"];
    var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var selDay = null, selSlot = null;
    var schedSlots = document.getElementById("schedSlots");
    var schedDone = document.getElementById("schedDone");
    var today = new Date();
    for (var di = 0; di < 7; di++) {
      (function (offset) {
        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
        var isSun = d.getDay() === 0;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sched-day" + (isSun ? " disabled" : "");
        if (isSun) btn.disabled = true;
        var dayLabel = offset === 0 ? "Today" : DOW[d.getDay()];
        var fullLabel = dayLabel + ", " + MON[d.getMonth()] + " " + d.getDate();
        btn.innerHTML = '<span class="block text-xs font-semibold opacity-70">' + dayLabel + "</span>" +
          '<span class="block font-bold">' + MON[d.getMonth()] + " " + d.getDate() + "</span>" +
          (isSun ? '<span class="block text-[10px] font-semibold opacity-60">Closed</span>' : "");
        if (!isSun) {
          btn.addEventListener("click", function () {
            schedDays.querySelectorAll(".sched-day").forEach(function (x) { x.classList.remove("selected"); });
            btn.classList.add("selected");
            selDay = fullLabel;
            maybeSchedDone();
          });
        }
        schedDays.appendChild(btn);
      })(di);
    }
    SLOTS.forEach(function (sl) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sched-slot";
      b.textContent = sl;
      b.addEventListener("click", function () {
        schedSlots.querySelectorAll(".sched-slot").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        selSlot = sl;
        maybeSchedDone();
      });
      schedSlots.appendChild(b);
    });
    function maybeSchedDone() {
      if (selDay && selSlot && schedDone) {
        schedDone.classList.remove("hidden");
        schedDone.innerHTML =
          '<p class="font-display font-semibold text-xl text-emerald-700 tracking-wide">Demo booking confirmed</p>' +
          '<p class="text-stone-600 mt-2">Visit penciled in for <strong>' + selDay + "</strong>, <strong>" + selSlot + "</strong>.</p>" +
          '<p class="text-xs text-stone-400 mt-3">Demo widget. Nothing was actually scheduled or sent.</p>';
        schedDone.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* Generic tab switcher */
  document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
    var tabs = wrap.querySelectorAll(".wtab");
    var panes = wrap.querySelectorAll("[data-pane]");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        var key = t.getAttribute("data-tab");
        panes.forEach(function (p) { p.classList.toggle("hidden", p.getAttribute("data-pane") !== key); });
      });
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();


  /* Safety quiz */
  var quiz = document.getElementById("safetyQuiz");
  if (quiz) {
    var total = quiz.querySelectorAll(".quiz-q").length, answered = 0, score = 0;
    var qRes = document.getElementById("quizResult");
    quiz.querySelectorAll(".quiz-q").forEach(function (q) {
      q.querySelectorAll(".quiz-a").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.disabled) return;
          var ok = b.getAttribute("data-ok") === "1";
          q.querySelectorAll(".quiz-a").forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute("data-ok") === "1") x.classList.add("correct");
          });
          if (!ok) b.classList.add("wrong"); else score++;
          answered++;
          if (answered === total && qRes) {
            qRes.classList.remove("hidden");
            var msg = score === total ? "Perfect score. You think like an electrician."
              : score >= 3 ? "Solid instincts. A quick refresher on the misses is worth it."
              : "Worth a re-read: electricity deserves respect. When in doubt, call a pro.";
            qRes.innerHTML = '<p class="font-display font-bold text-2xl text-stone-900">' + score + " of " + total + " correct</p>" +
              '<p class="text-stone-600 mt-2">' + msg + "</p>" +
              '<p class="text-xs text-stone-400 mt-3">Demo quiz for illustration only.</p>';
            qRes.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    });
  }

  /* Service finder */
  var finder = document.getElementById("svcFinder");
  if (finder) {
    var SVC = {
      outlet: "Outlet and Switch Repair",
      breaker: "Panel and Circuit Diagnosis",
      lights: "Lighting and Fixture Service",
      ev: "EV Charger Installation",
      panel: "Panel Upgrade Consultation",
      smell: "Emergency Electrical Visit"
    };
    var step = 1, symptom = null;
    var steps = finder.querySelectorAll(".sf-step");
    var lbl = document.getElementById("sfStepLabel");
    var back = document.getElementById("sfBack");
    function show(n) {
      step = n;
      steps.forEach(function (st) { st.classList.toggle("hidden", st.getAttribute("data-step") !== String(n)); });
      if (lbl) lbl.textContent = n === 3 ? "Your match" : "Step " + n + " of 2";
      if (back) back.classList.toggle("hidden", n === 1);
    }
    finder.querySelectorAll("[data-symptom]").forEach(function (b) {
      b.addEventListener("click", function () {
        symptom = b.getAttribute("data-symptom");
        finder.querySelectorAll("[data-symptom]").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        setTimeout(function () { show(2); }, 220);
      });
    });
    finder.querySelectorAll("[data-urgency]").forEach(function (b) {
      b.addEventListener("click", function () { show(3); buildRes(b.getAttribute("data-urgency")); });
    });
    if (back) back.addEventListener("click", function () { show(Math.max(1, step - 1)); });
    function buildRes(urg) {
      var svc = SVC[symptom] || "General Electrical Diagnosis";
      var line = urg === "now"
        ? "This sounds urgent. If you smell burning or see sparking, turn off the breaker and call now."
        : urg === "today" ? "We can usually fit this in today. Call to grab a same-day slot."
        : "No rush. Pick a day that suits you and we will confirm by text.";
      var cta = urg === "now"
        ? '<a href="tel:+15552345678" class="font-bold px-6 py-3.5 rounded-full transition text-white" style="background:#dc2626">Call (555) 234-5678 now</a>'
        : '<a href="tel:+15552345678" class="font-bold px-6 py-3.5 rounded-full transition" style="background:#f59e0b;color:#fff">Call (555) 234-5678</a>' +
          '<a href="services.html#estimator" class="border-2 font-bold px-6 py-3.5 rounded-full transition" style="border-color:#f59e0b;color:#0f172a">Sample estimate</a>';
      document.getElementById("sfResult").innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#d97706">Sample recommendation</p>' +
        '<p class="font-display font-semibold text-2xl md:text-3xl text-stone-900 mt-2 tracking-wide">' + svc + "</p>" +
        '<p class="text-stone-500 mt-3">' + line + "</p>" +
        '<div class="flex flex-wrap gap-3 mt-6">' + cta + "</div>" +
        '<p class="text-xs text-stone-400 mt-5">Sample guidance from a demo widget, not a professional diagnosis.</p>';
    }
  }

  /* Cost estimator */
  var estForm = document.getElementById("estForm");
  if (estForm) {
    var RANGES = {
      outlet:  { label: "Outlet or switch repair",        low: 129,  high: 349 },
      panel:   { label: "Panel upgrade",                  low: 1800, high: 3200 },
      lighting:{ label: "Lighting install",               low: 249,  high: 899 },
      ev:      { label: "EV charger install",             low: 599,  high: 1499 },
      surge:   { label: "Whole-home surge protection",    low: 349,  high: 799 },
      inspect: { label: "Safety inspection",              low: 99,   high: 199 }
    };
    var MULT = { small: 0.9, medium: 1.0, large: 1.18 };
    var out = document.getElementById("estResult");
    estForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = RANGES[estForm.querySelector("#estService").value];
      var m = MULT[estForm.querySelector("#estSize").value] || 1;
      if (!r) return;
      function rnd(n) { return Math.round(n / 10) * 10; }
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#d97706">Sample estimate: ' + r.label + "</p>" +
        '<p class="text-4xl font-extrabold text-stone-900 mt-2">$' + rnd(r.low * m).toLocaleString() +
        ' <span class="text-xl font-semibold text-stone-400">to</span> $' + rnd(r.high * m).toLocaleString() + "</p>" +
        '<p class="text-sm text-stone-500 mt-3">Demo sample estimate for illustration only, not a real quote. Final pricing depends on an on-site inspection.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
