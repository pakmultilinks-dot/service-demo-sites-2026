/* PureFlow Plumbing Co. - demo concept. Shared interactivity. No em-dash characters used. */
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
        link.classList.add("text-amber-400");
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

  /* ---------- Quote estimator ---------- */
  var estForm = document.getElementById("estimatorForm");
  if (estForm) {
    var RANGES = {
      drain:   { label: "Drain cleaning",            low: 99,   high: 249 },
      heater:  { label: "Water heater install",      low: 950,  high: 1850 },
      leak:    { label: "Leak detection and repair", low: 149,  high: 449 },
      fixture: { label: "Fixture installation",      low: 129,  high: 349 },
      sewer:   { label: "Sewer line repair",         low: 2400, high: 6900 },
      remodel: { label: "Bathroom rough-in / remodel plumbing", low: 1800, high: 5200 }
    };
    var SIZE_MULT = { small: 0.9, medium: 1.0, large: 1.18 };
    var out = document.getElementById("estResult");
    function round10(n) { return Math.round(n / 10) * 10; }
    estForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var svc = estForm.querySelector("#estService").value;
      var size = estForm.querySelector("#estSize").value;
      var r = RANGES[svc], m = SIZE_MULT[size];
      if (!r) return;
      var low = round10(r.low * m), high = round10(r.high * m);
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider text-amber-600">Sample estimate: ' + r.label + '</p>' +
        '<p class="text-4xl font-extrabold text-slate-900 mt-2">$' + low.toLocaleString() + ' <span class="text-xl font-semibold text-slate-400">to</span> $' + high.toLocaleString() + '</p>' +
        '<p class="text-sm text-slate-500 mt-3">This is a demo sample estimate for illustration only, not a real quote. Final pricing depends on an on-site inspection.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

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

  /* ---------- Troubleshooter ---------- */
  var trouble = document.getElementById("trouble");
  if (trouble) {
    var TR_SERVICE = {
      drain: "Drain cleaning",
      leak: "Leak detection and repair",
      heater: "Water heater repair or install",
      pressure: "Pressure diagnosis and pipe inspection",
      toilet: "Toilet repair or replacement",
      sewer: "Sewer line inspection and repair"
    };
    var trStep = 1, trSymptom = null;
    var trSteps = trouble.querySelectorAll(".tr-step");
    var trLabel = document.getElementById("trStepLabel");
    var trBack = document.getElementById("trBack");
    function trShow(n) {
      trStep = n;
      trSteps.forEach(function (st) { st.classList.toggle("hidden", st.getAttribute("data-step") !== String(n)); });
      if (trLabel) trLabel.textContent = "Step " + n + " of 3";
      if (trBack) trBack.classList.toggle("hidden", n === 1);
    }
    trouble.querySelectorAll("[data-symptom]").forEach(function (b) {
      b.addEventListener("click", function () {
        trSymptom = b.getAttribute("data-symptom");
        trouble.querySelectorAll("[data-symptom]").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        setTimeout(function () { trShow(2); }, 220);
      });
    });
    trouble.querySelectorAll("[data-urgency]").forEach(function (b) {
      b.addEventListener("click", function () {
        trShow(3);
        buildTrResult(b.getAttribute("data-urgency"));
      });
    });
    if (trBack) trBack.addEventListener("click", function () { trShow(Math.max(1, trStep - 1)); });
    function buildTrResult(urgency) {
      var svc = TR_SERVICE[trSymptom] || "General plumbing diagnosis";
      var urgLine, cta;
      if (urgency === "now") {
        urgLine = "This sounds urgent. If water is flowing, shut off the nearest valve if you can, then call now.";
        cta = '<a href="tel:+15551234567" class="bg-amber-500 hover:bg-amber-400 text-[#0b3d5c] font-bold px-6 py-3.5 rounded-full transition">Call (555) 123-4567 now</a>';
      } else if (urgency === "today") {
        urgLine = "We can usually fit this in today. Call to grab a same-day slot.";
        cta = '<a href="tel:+15551234567" class="bg-amber-500 hover:bg-amber-400 text-[#0b3d5c] font-bold px-6 py-3.5 rounded-full transition">Call (555) 123-4567</a>' +
              '<a href="services.html#estimator" class="border-2 border-[#0b3d5c] text-[#0b3d5c] font-bold px-6 py-3.5 rounded-full hover:bg-[#0b3d5c] hover:text-white transition">Sample estimate</a>';
      } else {
        urgLine = "No rush. Pick a day that suits you and we will confirm by text.";
        cta = '<a href="contact.html" class="bg-[#0b3d5c] text-white font-bold px-6 py-3.5 rounded-full hover:bg-[#082c44] transition">Book a demo visit</a>' +
              '<a href="services.html#estimator" class="border-2 border-[#0b3d5c] text-[#0b3d5c] font-bold px-6 py-3.5 rounded-full hover:bg-[#0b3d5c] hover:text-white transition">Sample estimate</a>';
      }
      document.getElementById("trResult").innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider text-amber-600">Sample recommendation</p>' +
        '<p class="font-display font-semibold text-2xl md:text-3xl text-slate-900 mt-2 tracking-wide">' + svc + '</p>' +
        '<p class="text-slate-500 mt-3">' + urgLine + '</p>' +
        '<div class="flex flex-wrap gap-3 mt-6">' + cta + '</div>' +
        '<p class="text-xs text-slate-400 mt-5">Sample guidance from a demo widget, not a professional diagnosis.</p>';
    }
  }

  /* ---------- ZIP checker ---------- */
  var zipForm = document.getElementById("zipForm");
  if (zipForm) {
    var ZIPS = ["80202","80203","80204","80205","80209","80211","80218","80220","80222","80224","80227","80228","80231","80232","80235","80236","80237","80246","80247","80249","80012","80013","80014","80015","80016","80017","80018","80111","80112","80113","80120","80121","80122","80123","80128","80129","80130","80131","80134","80135","80138"];
    var zIn = document.getElementById("zipInput");
    var zOut = document.getElementById("zipResult");
    zipForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var z = (zIn.value || "").replace(/\D/g, "").slice(0, 5);
      zOut.classList.remove("hidden");
      if (z.length < 5) {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-slate-100 text-slate-600";
        zOut.textContent = "Enter a 5-digit ZIP code to check.";
        return;
      }
      if (ZIPS.indexOf(z) !== -1) {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200";
        zOut.textContent = "Good news: " + z + " is inside our sample service area. Same-day slots available.";
      } else {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200";
        zOut.textContent = z + " is outside our sample service area, but call anyway. We often make exceptions.";
      }
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

  /* ---------- Appointment scheduler ---------- */
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
        btn.innerHTML = '<span class="block text-xs font-semibold opacity-70">' + dayLabel + '</span>' +
          '<span class="block font-bold">' + MON[d.getMonth()] + " " + d.getDate() + "</span>" +
          (isSun ? '<span class="block text-[10px] font-semibold opacity-60">Emerg. only</span>' : "");
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
    SLOTS.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sched-slot";
      b.textContent = s;
      b.addEventListener("click", function () {
        schedSlots.querySelectorAll(".sched-slot").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        selSlot = s;
        maybeSchedDone();
      });
      schedSlots.appendChild(b);
    });
    function maybeSchedDone() {
      if (selDay && selSlot && schedDone) {
        schedDone.classList.remove("hidden");
        schedDone.innerHTML =
          '<p class="font-display font-semibold text-xl text-emerald-700 tracking-wide">Demo booking confirmed</p>' +
          '<p class="text-slate-600 mt-2">Visit penciled in for <strong>' + selDay + "</strong>, <strong>" + selSlot + "</strong>.</p>" +
          '<p class="text-xs text-slate-400 mt-3">Demo widget. Nothing was actually scheduled or sent.</p>';
        schedDone.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
