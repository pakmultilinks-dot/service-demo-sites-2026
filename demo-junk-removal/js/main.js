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
    var ZIPS = ["33602", "33603", "33604", "33605", "33606", "33607", "33609", "33610", "33611", "33612", "33613", "33614", "33615", "33617", "33618", "33619", "33624", "33625", "33626", "33629", "33634", "33635", "33647"];
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


  /* Category picker */
  var catTabs = document.querySelectorAll(".cat-tab");
  if (catTabs.length) {
    catTabs.forEach(function (t) {
      t.addEventListener("click", function () {
        catTabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        var i = t.getAttribute("data-cat");
        document.querySelectorAll(".cat-panel").forEach(function (p) {
          p.classList.toggle("hidden", p.getAttribute("data-panel") !== i);
        });
      });
    });
  }
  /* Volume estimator */
  var volItems = document.querySelectorAll(".vol-item");
  if (volItems.length) {
    var volOut = document.getElementById("volResult");
    function volCalc() {
      var total = 0, names = [];
      volItems.forEach(function (c) {
        if (c.checked) { total += parseFloat(c.getAttribute("data-vol")); names.push(c.getAttribute("data-name")); }
      });
      if (!names.length) { volOut.classList.add("hidden"); return; }
      var loads = total / 16;
      var desc = loads <= 0.25 ? "about a quarter truckload" : loads <= 0.5 ? "about a half truckload" : loads <= 1 ? "about a full truckload" : "about " + loads.toFixed(1) + " truckloads";
      volOut.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-wider text-teal-700">Sample volume estimate</p>' +
        '<p class="text-4xl font-extrabold text-slate-900 mt-2">' + total.toFixed(1) + ' <span class="text-xl font-semibold text-slate-400">cubic yards</span></p>' +
        '<p class="text-slate-600 mt-2">That is ' + desc + ' of our 16 cu yd truck (' + names.length + ' item' + (names.length > 1 ? "s" : "") + ' selected).</p>' +
        '<p class="text-sm text-slate-500 mt-3">Demo sample for illustration only. Text us a photo for an exact quote.</p>';
      volOut.classList.remove("hidden");
    }
    volItems.forEach(function (c) { c.addEventListener("change", volCalc); });
  }
