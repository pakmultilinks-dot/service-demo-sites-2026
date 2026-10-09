/* AirEase HVAC Services - demo concept. Shared interactivity. No em-dash characters used. */
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


  /* Symptom checker */
  var hp = document.querySelectorAll("#hvacResult").length ? document.querySelector("#hvacResult").parentElement : null;
  if (hp) {
    var CAUSE = {
      nocool: ["Low refrigerant or a failed capacitor", "AC Repair"],
      weak: ["Clogged filter, duct leak or failing blower", "Tune-Up and Duct Check"],
      noise: ["Loose parts or a failing motor", "AC Repair"],
      bills: ["Aging system losing efficiency", "System Replacement consult"],
      smell: ["Mold in drain pan or ducts", "Indoor Air Quality visit"],
      old: ["End of typical service life", "Replacement estimate"]
    };
    var hOut = document.getElementById("hvacResult");
    hp.querySelectorAll("[data-sym]").forEach(function (b) {
      b.addEventListener("click", function () {
        hp.querySelectorAll("[data-sym]").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        var c = CAUSE[b.getAttribute("data-sym")];
        hOut.innerHTML =
          '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#d97706">Sample read</p>' +
          '<p class="font-display font-semibold text-2xl text-stone-900 mt-2">' + c[0] + "</p>" +
          '<p class="text-stone-500 mt-2">Suggested next step: <strong>' + c[1] + "</strong>.</p>" +
          '<div class="flex flex-wrap gap-3 mt-5"><a href="tel:+15554567890" class="font-bold px-6 py-3 rounded-full" style="background:#f59e0b;color:#fff">Call (555) 456-7890</a>' +
          '<a href="contact.html" class="border-2 font-bold px-6 py-3 rounded-full" style="border-color:#f59e0b;color:#1c1917">Book a visit</a></div>';
        hOut.classList.remove("hidden");
      });
    });
  }

  /* SEER savings calculator */
  var seer = document.getElementById("seerCalc");
  if (seer) {
    var sOut = document.getElementById("seerResult");
    seer.addEventListener("submit", function (e) {
      e.preventDefault();
      var oldS = parseFloat(document.getElementById("oldSeer").value);
      var newS = parseFloat(document.getElementById("newSeer").value);
      var bill = parseFloat(document.getElementById("bill").value) || 0;
      if (newS <= oldS || bill <= 0) {
        sOut.innerHTML = '<p class="font-semibold text-stone-700">Pick a new SEER higher than your current one and enter your bill.</p>';
        sOut.classList.remove("hidden");
        return;
      }
      var annual = Math.round(bill * 12 * (1 - oldS / newS));
      sOut.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider" style="color:#d97706">Sample annual savings</p>' +
        '<p class="text-4xl font-extrabold text-stone-900 mt-2">$' + annual.toLocaleString() + " <span class='text-xl font-semibold text-stone-400'>per year</span></p>" +
        '<p class="text-sm text-stone-500 mt-3">Moving from ' + oldS + " to " + newS + ' SEER. Demo math for illustration only.</p>';
      sOut.classList.remove("hidden");
      sOut.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* Maintenance plan picker */
  var picker = document.getElementById("planPicker");
  if (picker) {
    var pOut = document.getElementById("planResult");
    var NAMES = { basic: "Cool Basic", plus: "Comfort Plus", total: "Total Care" };
    function render() {
      var sel = picker.querySelector(".plan-card.selected");
      var k = sel ? sel.getAttribute("data-plan") : "plus";
      pOut.innerHTML = '<p class="font-bold text-stone-900">Selected: <span style="color:#d97706">' + NAMES[k] + "</span></p>" +
        '<p class="text-sm text-stone-500 mt-1">Sample plan for illustration. Call (555) 456-7890 and mention the plan name to ask about it.</p>';
    }
    picker.querySelectorAll(".plan-card").forEach(function (c) {
      function pick() {
        picker.querySelectorAll(".plan-card").forEach(function (x) { x.classList.remove("selected"); });
        c.classList.add("selected");
        render();
      }
      c.addEventListener("click", pick);
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    render();
  }
