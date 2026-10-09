/* Group E demo sites. Shared interactivity. No em-dash characters used. */
(function () {
  "use strict";
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
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("nav-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    });
  });
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
  var callBar = document.getElementById("callBar");
  if (callBar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) { callBar.classList.add("show"); }
      else { callBar.classList.remove("show"); }
    }, { passive: true });
  }
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
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });
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
  var cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.getElementById("formDone");
      cForm.classList.add("hidden");
      if (done) done.classList.remove("hidden");
    });
  }
  var zipForm = document.getElementById("zipForm");
  if (zipForm) {
    var ZIPS = ["43215", "43201", "43206", "43085", "43219", "43220", "43221", "43228", "43229", "43230", "43231", "43232", "43235"];
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
        zOut.textContent = "Good news: " + z + " is inside our sample service area.";
      } else {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200";
        zOut.textContent = z + " is outside our sample service area, but call anyway. We often make exceptions.";
      }
    });
  }
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
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();


  /* Lockout triage */
  var triage = document.getElementById("triage");
  if (triage) {
    var tgPlace = null, tgStep = 1;
    var tgSteps = triage.querySelectorAll(".tg-step");
    var tgLabel = document.getElementById("tgStepLabel");
    var tgBack = document.getElementById("tgBack");
    function tgShow(n) {
      tgStep = n;
      tgSteps.forEach(function (st) { st.classList.toggle("hidden", st.getAttribute("data-step") !== String(n)); });
      if (tgLabel) tgLabel.textContent = n === 3 ? "Your result" : "Step " + n + " of 2";
      if (tgBack) tgBack.classList.toggle("hidden", n === 1);
    }
    triage.querySelectorAll("[data-place]").forEach(function (b) {
      b.addEventListener("click", function () {
        tgPlace = b.getAttribute("data-place");
        triage.querySelectorAll("[data-place]").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        setTimeout(function () { tgShow(2); }, 220);
      });
    });
    triage.querySelectorAll("[data-danger]").forEach(function (b) {
      b.addEventListener("click", function () { tgShow(3); buildTgResult(b.getAttribute("data-danger")); });
    });
    if (tgBack) tgBack.addEventListener("click", function () { tgShow(Math.max(1, tgStep - 1)); });
    function buildTgResult(danger) {
      var line, cta;
      if (danger === "yes") {
        line = "If anyone is in immediate danger, call 911 first. Then call us: emergency lockouts jump the queue and we dispatch the nearest tech immediately.";
        cta = '<a href="tel:+15552347890" class="btn-accent font-bold px-6 py-3.5 rounded-full transition">Emergency: (555) 234-7890</a>';
      } else if (tgPlace === "car") {
        line = "Stay with the vehicle if you can. Have your ID and proof of ownership ready; the tech will need to see it before cutting a key.";
        cta = '<a href="tel:+15552347890" class="btn-accent font-bold px-6 py-3.5 rounded-full transition">Call (555) 234-7890</a>';
      } else if (tgPlace === "business") {
        line = "Commercial lockouts get priority dispatch, including after hours. We can also rekey on the spot if keys are missing.";
        cta = '<a href="tel:+15552347890" class="btn-accent font-bold px-6 py-3.5 rounded-full transition">Call (555) 234-7890</a>';
      } else {
        line = "Most home locks open damage-free in minutes. Do not try to force the door; a tech is usually faster and far cheaper than repairs.";
        cta = '<a href="tel:+15552347890" class="btn-accent font-bold px-6 py-3.5 rounded-full transition">Call (555) 234-7890</a>' +
              '<a href="services.html#estimator" class="btn-outline font-bold px-6 py-3.5 rounded-full transition">Sample estimate</a>';
      }
      document.getElementById("tgResult").innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider text-teal-700">Sample guidance</p>' +
        '<p class="text-slate-600 mt-3 text-lg">' + line + '</p>' +
        '<div class="flex flex-wrap gap-3 mt-6">' + cta + '</div>' +
        '<p class="text-xs text-slate-400 mt-5">Sample guidance from a demo widget, not professional advice.</p>';
    }
  }
  /* Service estimator */
  var estForm = document.getElementById("estimatorForm");
  if (estForm) {
    var R = {
      lockout: { label: "Emergency lockout", low: 75, high: 150, per: false },
      rekey:   { label: "Lock rekeying", low: 25, high: 45, per: true },
      smart:   { label: "Smart lock install", low: 95, high: 180, per: true },
      carkey:  { label: "Car key replacement", low: 90, high: 280, per: false },
      safe:    { label: "Safe opening", low: 150, high: 400, per: false }
    };
    estForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = R[estForm.querySelector("#estService").value];
      var q = Math.max(1, Math.min(20, parseInt(estForm.querySelector("#estQty").value, 10) || 1));
      var m = r.per ? q : 1;
      var out = document.getElementById("estResult");
      out.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider text-teal-700">Sample estimate: ' + r.label + (r.per && q > 1 ? " x " + q : "") + '</p>' +
        '<p class="text-4xl font-extrabold text-slate-900 mt-2">$' + (r.low * m).toLocaleString() + ' <span class="text-xl font-semibold text-slate-400">to</span> $' + (r.high * m).toLocaleString() + '</p>' +
        '<p class="text-sm text-slate-500 mt-3">Demo sample estimate for illustration only, not a real quote.</p>';
      out.classList.remove("hidden");
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
