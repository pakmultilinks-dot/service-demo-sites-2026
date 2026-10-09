/* GROUP B demo concepts. Shared interactivity. No em-dash characters used. */
(function () {
  "use strict";

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
        link.classList.add("text-red-500");
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
      lb.classList.remove("hiddenx"); document.body.style.overflow = "hidden";
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
      cForm.classList.add("hidden");
      var done = document.getElementById("formDone");
      if (done) done.classList.remove("hidden");
    });
  }

  /* Animated counters */
  var counters = document.querySelectorAll(".count");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; cio.unobserve(el);
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

  /* Appointment scheduler */
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
            btn.classList.add("selected"); selDay = fullLabel; maybeSchedDone();
          });
        }
        schedDays.appendChild(btn);
      })(di);
    }
    SLOTS.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sched-slot"; b.textContent = s;
      b.addEventListener("click", function () {
        schedSlots.querySelectorAll(".sched-slot").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected"); selSlot = s; maybeSchedDone();
      });
      schedSlots.appendChild(b);
    });
    function maybeSchedDone() {
      if (selDay && selSlot && schedDone) {
        schedDone.classList.remove("hidden");
        schedDone.innerHTML =
          '<p class="font-display font-bold text-xl text-emerald-400 tracking-wide">Demo booking confirmed</p>' +
          '<p class="text-zinc-300 mt-2">Visit penciled in for <strong>' + selDay + "</strong>, <strong>" + selSlot + "</strong>.</p>" +
          '<p class="text-xs text-zinc-500 mt-3">Demo widget. Nothing was actually scheduled or sent.</p>';
        schedDone.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* ZIP coverage checker */
  var zipForm = document.getElementById("zipForm");
  if (zipForm) {
    var ZIPS = (zipForm.getAttribute("data-zips") || "").split(",");
    var zIn = document.getElementById("zipInput");
    var zOut = document.getElementById("zipResult");
    zipForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var z = (zIn.value || "").replace(/\D/g, "").slice(0, 5);
      zOut.classList.remove("hidden");
      if (z.length < 5) {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-zinc-800 text-zinc-300";
        zOut.textContent = "Enter a 5-digit ZIP code to check.";
        return;
      }
      if (ZIPS.indexOf(z) !== -1) {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800";
        zOut.textContent = "Good news: " + z + " is inside our sample coverage area.";
      } else {
        zOut.className = "mt-4 rounded-xl p-4 text-sm font-semibold bg-red-950 text-red-300 border border-red-800";
        zOut.textContent = z + " is outside our sample coverage area, but call anyway. We often make exceptions.";
      }
    });
  }

  /* Before/after comparison slider */
  var ba = document.getElementById("baSlider");
  if (ba) {
    var baBefore = ba.querySelector(".ba-img-before");
    var baHandle = ba.querySelector(".ba-handle");
    var baKnob = ba.querySelector(".ba-knob");
    var pos = 50;
    function setBA(p) {
      pos = Math.max(2, Math.min(98, p));
      baBefore.style.clipPath = "inset(0 " + (100 - pos) + "% 0 0)";
      baHandle.style.left = pos + "%";
      baKnob.style.left = pos + "%";
    }
    function baFromEvent(e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) - r.left;
      setBA((x / r.width) * 100);
    }
    var dragging = false;
    ba.addEventListener("pointerdown", function (e) { dragging = true; ba.setPointerCapture(e.pointerId); baFromEvent(e); });
    ba.addEventListener("pointermove", function (e) { if (dragging) baFromEvent(e); });
    ba.addEventListener("pointerup", function () { dragging = false; });
    ba.addEventListener("pointercancel", function () { dragging = false; });
    setBA(50);
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();


/* Showroom Shine widgets: package builder with sample pricing. Sample outputs only. */
(function () {
  "use strict";
  var pkgForm = document.getElementById("pkgForm");
  if (pkgForm) {
    var PKG = {
      essential: { label: "Essential Shine",  base: 89 },
      signature: { label: "Signature Detail", base: 189 },
      elite:     { label: "Showroom Elite",   base: 329 }
    };
    var ADDONS = {
      pethair:   { label: "Pet hair removal",  price: 45 },
      odor:      { label: "Odor treatment",    price: 65 },
      engine:    { label: "Engine bay detail", price: 55 },
      headlight: { label: "Headlight restoration", price: 75 }
    };
    var out = document.getElementById("pkgResult");
    function money(n) { return "$" + n.toLocaleString(); }
    function calc() {
      var sel = pkgForm.querySelector('input[name="pkg"]:checked');
      if (!sel) return;
      var p = PKG[sel.value];
      var total = p.base, lines = [];
      pkgForm.querySelectorAll('input[name="addon"]:checked').forEach(function (cb) {
        var a = ADDONS[cb.value];
        if (a) { total += a.price; lines.push(a.label + " (" + money(a.price) + ")"); }
      });
      out.innerHTML =
        '<p class="text-sm font-bold uppercase tracking-wider text-[#ff2b1f]">Sample build: ' + p.label + "</p>" +
        '<p class="text-4xl font-extrabold text-white mt-2 font-display">' + money(total) + "</p>" +
        (lines.length ? '<p class="text-sm text-zinc-400 mt-3">Includes: ' + lines.join(", ") + ".</p>" : '<p class="text-sm text-zinc-400 mt-3">No add-ons selected.</p>') +
        '<p class="text-xs text-zinc-500 mt-3">Demo sample pricing for illustration only, not a real quote.</p>';
      out.classList.remove("hidden");
    }
    pkgForm.querySelectorAll("input").forEach(function (i) { i.addEventListener("change", calc); });
    calc();
  }
})();
