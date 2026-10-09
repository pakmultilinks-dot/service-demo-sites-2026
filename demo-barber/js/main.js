/* Demo website concept. Shared interactivity. No em-dash characters used. */
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
        link.setAttribute("aria-current", "page");
        link.style.color = "var(--accent)";
        link.classList.add("font-semibold");
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

  var rForm = document.getElementById("reviewForm");
  if (rForm) {
    rForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = document.getElementById("reviewDone");
      rForm.classList.add("hidden");
      if (done) done.classList.remove("hidden");
    });
  }

  var counters = document.querySelectorAll(".count");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var decimals = (el.getAttribute("data-count").indexOf(".") !== -1) ? 1 : 0;
        var dur = 1400, t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          el.textContent = decimals ? v.toFixed(1) : Math.round(v).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  var schedDays = document.getElementById("schedDays");
  if (schedDays) {
    var SLOTS = ["9-11 AM", "11 AM-1 PM", "1-3 PM", "3-5 PM"];
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
          '<p class="font-display font-semibold text-xl text-emerald-700">Demo booking confirmed</p>' +
          '<p class="text-stone-600 mt-2">Visit penciled in for <strong>' + selDay + "</strong>, <strong>" + selSlot + "</strong>.</p>" +
          '<p class="text-xs text-stone-400 mt-3">Demo widget. Nothing was actually scheduled or sent.</p>';
        schedDone.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* Gallery filter tabs */
  var filterWrap = document.getElementById("galFilters");
  if (filterWrap) {
    var fbtns = filterWrap.querySelectorAll(".tab-btn");
    var gitems = document.querySelectorAll(".g-item");
    fbtns.forEach(function (b) {
      b.addEventListener("click", function () {
        fbtns.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var f = b.getAttribute("data-filter");
        gitems.forEach(function (g) {
          var showIt = (f === "all") || (g.getAttribute("data-cat") === f);
          g.classList.toggle("hidden", !showIt);
        });
      });
    });
  }

  /* Barber style finder quiz */
  var sq = document.getElementById("styleQuiz");
  if (sq) {
    var SQ_CUTS = {
      "short-round-classic": ["The Classic Taper", "Keeps the sides neat and short while the top stays classic. Flattering on rounder faces because the height on top adds balance."],
      "short-round-modern": ["Textured Crop", "A modern, low-maintenance cut with texture on top that adds angles to softer face shapes."],
      "short-round-bold": ["High Skin Fade", "Maximum contrast, crisp lines, and a bold silhouette that sharpens a round face."],
      "short-oval-classic": ["The Side Part", "Timeless and clean. Your face shape can carry almost anything, so we lean into the classic."],
      "short-oval-modern": ["Textured Quiff", "Volume on top with faded sides. Modern without trying too hard."],
      "short-oval-bold": ["Buzz with Beard Fade", "Short on top, faded into a sculpted beard. Bold, sharp, and balanced."],
      "short-square-classic": ["Ivy League", "A collegiate classic that softens strong jawlines with tidy length on top."],
      "short-square-modern": ["Mid Fade with Texture", "Blended fade with textured length that complements a square jaw."],
      "short-square-bold": ["High and Tight", "Military-sharp. Lean into the angles with this confident, bold cut."],
      "medium-round-classic": ["Classic Contour", "Medium length with shape through the sides to slim and frame a round face."],
      "medium-round-modern": ["Messy Fringe", "A modern fringe cut that adds edge and angles where you want them."],
      "medium-round-bold": ["Undercut", "Disconnected length on top with tight sides. Bold contrast, striking result."],
      "medium-oval-classic": ["The Executive", "Neat medium length, side-swept. Boardroom-ready and timeless."],
      "medium-oval-modern": ["Bro Flow", "Effortless medium length with natural movement. Modern and relaxed."],
      "medium-oval-bold": ["Slick Back Undercut", "Slicked length over faded sides. Bold, sleek, unforgettable."],
      "medium-square-classic": ["Side-Swept Classic", "Medium length swept to the side softens a square jaw beautifully."],
      "medium-square-modern": ["Textured Pompadour", "Height and texture up top balance strong features with modern flair."],
      "medium-square-bold": ["Disconnected Undercut", "Sharp disconnect between top and sides for a bold, architectural look."],
      "long-round-classic": ["Layered Classic", "Long layers that frame the face and add shape without bulk."],
      "long-round-modern": ["Man Bun with Fade", "Long on top, clean on the sides. Modern and practical."],
      "long-round-bold": ["Long and Sharp", "Full length with razor-sharp ends. Bold commitment, big payoff."],
      "long-oval-classic": ["Classic Layers", "Timeless long layers with natural movement."],
      "long-oval-modern": ["Textured Shag", "Modern shag with lived-in texture and effortless cool."],
      "long-oval-bold": ["Slicked Long Top", "Long, slicked-back length with tight sides. Red-carpet bold."],
      "long-square-classic": ["Soft Layers", "Long soft layers that ease strong angles into classic shape."],
      "long-square-modern": ["Half-Up Flow", "Modern long style with the top pulled back. Rugged and refined."],
      "long-square-bold": ["Long Undercut", "Full length up top over faded sides. Maximum drama, zero apology."]
    };
    var sqStep = 0, sqAns = [];
    var sqQ = document.getElementById("sqQ"), sqOpts = document.getElementById("sqOpts"),
        sqBack = document.getElementById("sqBack"), sqLabel = document.getElementById("sqLabel"),
        sqResult = document.getElementById("sqResult");
    var SQ_QUESTIONS = JSON.parse(sq.getAttribute("data-questions"));
    function sqRender() {
      if (sqStep >= SQ_QUESTIONS.length) {
        var key = sqAns.join("-");
        var rec = SQ_CUTS[key] || ["The Signature Cut", "A versatile cut tailored to you in the chair after a proper consultation."];
        sqQ.parentElement.classList.add("hidden");
        if (sqBack) sqBack.classList.add("hidden");
        if (sqLabel) sqLabel.textContent = "Your match";
        sqResult.innerHTML =
          '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Sample recommendation</p>' +
          '<p class="font-display font-semibold text-3xl mt-2">' + rec[0] + "</p>" +
          '<p class="text-stone-500 mt-3">' + rec[1] + "</p>" +
          '<div class="flex flex-wrap gap-3 mt-6">' +
          '<a href="contact.html" class="bg-[--brandx] font-semibold px-6 py-3.5 rounded-full text-white" style="background:var(--brand)">Book this cut</a>' +
          '<button id="sqRestart" type="button" class="border-2 font-semibold px-6 py-3.5 rounded-full" style="border-color:var(--accent)">Start over</button></div>' +
          '<p class="text-xs text-stone-400 mt-5">Sample guidance from a demo widget, not a professional consultation.</p>';
        sqResult.classList.remove("hidden");
        var rs = document.getElementById("sqRestart");
        if (rs) rs.addEventListener("click", function () { sqStep = 0; sqAns = []; sqResult.classList.add("hidden"); sqQ.parentElement.classList.remove("hidden"); if (sqBack) sqBack.classList.remove("hidden"); sqRender(); });
        return;
      }
      var q = SQ_QUESTIONS[sqStep];
      sqQ.textContent = q[0];
      if (sqLabel) sqLabel.textContent = "Step " + (sqStep + 1) + " of " + SQ_QUESTIONS.length;
      sqOpts.innerHTML = "";
      q[1].forEach(function (opt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = opt;
        b.addEventListener("click", function () {
          sqAns.push(opt.toLowerCase());
          sqStep++;
          sqRender();
        });
        sqOpts.appendChild(b);
      });
      if (sqBack) sqBack.classList.toggle("hidden", sqStep === 0);
    }
    if (sqBack) sqBack.addEventListener("click", function () { if (sqStep > 0) { sqStep--; sqAns.pop(); sqRender(); } });
    sqRender();
  }

  /* Makeup occasion picker */
  var occ = document.getElementById("occasionPicker");
  if (occ) {
    var occData = JSON.parse(occ.getAttribute("data-options"));
    var occBtns = occ.querySelectorAll(".pick-opt");
    var occOut = document.getElementById("occResult");
    occBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        occBtns.forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        var key = b.getAttribute("data-occ");
        var d = null;
        occData.forEach(function (o) { if (o[0] === key) d = o; });
        if (d && occOut) {
          occOut.innerHTML =
            '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Recommended for you</p>' +
            '<p class="font-display font-semibold text-3xl mt-2">' + d[2] + "</p>" +
            '<p class="text-stone-500 mt-3">' + d[3] + "</p>" +
            '<div class="flex flex-wrap gap-3 mt-6"><a href="contact.html" class="font-semibold px-6 py-3.5 rounded-full text-white" style="background:var(--brand)">Book a consultation</a>' +
            '<a href="services.html" class="border-2 font-semibold px-6 py-3.5 rounded-full" style="border-color:var(--accent)">See services</a></div>' +
            '<p class="text-xs text-stone-400 mt-5">Sample guidance from a demo widget.</p>';
          occOut.classList.remove("hidden");
          occOut.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }

  /* Bridal party estimator (sample only) */
  var brForm = document.getElementById("bridalForm");
  if (brForm) {
    var brRange = document.getElementById("brCount");
    var brCountLabel = document.getElementById("brCountLabel");
    var brOut = document.getElementById("brResult");
    function brCalc() {
      var n = parseInt(brRange.value, 10) || 1;
      brCountLabel.textContent = n + (n === 1 ? " person" : " people");
      var low = 95 * n, high = 165 * n;
      brOut.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Sample estimate</p>' +
        '<p class="font-display font-semibold text-4xl mt-2">$' + low.toLocaleString() + ' <span class="text-xl text-stone-400">to</span> $' + high.toLocaleString() + "</p>" +
        '<p class="text-sm text-stone-500 mt-3">Demo sample range for illustration only, not a real quote. Final pricing depends on look complexity and location.</p>';
      brOut.classList.remove("hidden");
    }
    brRange.addEventListener("input", brCalc);
    brForm.addEventListener("submit", function (e) { e.preventDefault(); brCalc(); brOut.scrollIntoView({ behavior: "smooth", block: "center" }); });
    brCalc();
  }

  /* Massage modality tabs */
  var modWrap = document.getElementById("modTabs");
  if (modWrap) {
    var mbtns = modWrap.querySelectorAll(".tab-btn");
    var mpanels = document.querySelectorAll(".mod-panel");
    mbtns.forEach(function (b) {
      b.addEventListener("click", function () {
        mbtns.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var k = b.getAttribute("data-mod");
        mpanels.forEach(function (p) { p.classList.toggle("hidden", p.getAttribute("data-panel") !== k); });
      });
    });
  }

  /* Massage session estimator (sample only) */
  var seForm = document.getElementById("sessForm");
  if (seForm) {
    var SE_RANGES = { "60": [85, 130], "90": [120, 180], "120": [160, 240] };
    var seSel = document.getElementById("seLen");
    var seOut = document.getElementById("seResult");
    function seCalc() {
      var r = SE_RANGES[seSel.value] || SE_RANGES["60"];
      seOut.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Sample estimate</p>' +
        '<p class="font-display font-semibold text-4xl mt-2">$' + r[0] + ' <span class="text-xl text-stone-400">to</span> $' + r[1] + "</p>" +
        '<p class="text-sm text-stone-500 mt-3">Demo sample range for illustration only, not a real quote. Travel fees may apply outside the core area.</p>';
      seOut.classList.remove("hidden");
    }
    seSel.addEventListener("change", seCalc);
    seForm.addEventListener("submit", function (e) { e.preventDefault(); seCalc(); seOut.scrollIntoView({ behavior: "smooth", block: "center" }); });
    seCalc();
  }

  /* Trainer goal quiz */
  var gq = document.getElementById("goalQuiz");
  if (gq) {
    var GQ_PROG = {
      "lose-new": ["Foundations Fat-Loss", "Two full-body strength sessions plus one conditioning day each week, paired with simple nutrition habits. Built for beginners who want steady, sustainable change."],
      "lose-some": ["Metabolic Strength", "Three strength-focused days with finishers that raise your work capacity while nutrition coaching keeps the deficit comfortable."],
      "lose-adv": ["Performance Cut", "Advanced programming that protects muscle while you lean out: heavy lifts, smart conditioning, precise habit tracking."],
      "muscle-new": ["Build the Base", "Three full-body days mastering the big lifts with perfect form. New lifters grow fastest on the fundamentals."],
      "muscle-some": ["Hypertrophy Split", "A four-day upper/lower split with progressive overload and volume tuned to your recovery."],
      "muscle-adv": ["Advanced Mass Block", "Periodized blocks, accessory precision, and deloads planned like a pro offseason."],
      "strong-new": ["First Barbell", "Learn to squat, hinge, press, and pull safely, then add weight every week. Strength from day one."],
      "strong-some": ["Barbell Club", "Twice-weekly coached barbell sessions chasing PRs on the squat, bench, deadlift, and press."],
      "strong-adv": ["Powerlifting Prep", "Competition-style programming with peaking cycles for lifters chasing big totals."],
      "move-new": ["Move Well", "Mobility, core, and bodyweight basics that rebuild how your body moves, pain-free and confident."],
      "move-some": ["Athletic Base", "Strength plus agility and mobility work for people who want to feel athletic again."],
      "move-adv": ["Conditioning Plus", "High-level conditioning layered on a strength base for durable, all-day athleticism."]
    };
    var gqData = JSON.parse(gq.getAttribute("data-quiz"));
    var gqStep = 0, gqAns = [];
    var gqQ = document.getElementById("gqQ"), gqOpts = document.getElementById("gqOpts"),
        gqBack = document.getElementById("gqBack"), gqLabel = document.getElementById("gqLabel"),
        gqResult = document.getElementById("gqResult");
    function gqRender() {
      if (gqStep >= gqData.length) {
        var rec = GQ_PROG[gqAns.join("-")] || ["Personal Assessment", "Your goals deserve a proper look. Book a free consult and we will build your plan together."];
        gqQ.parentElement.classList.add("hidden");
        if (gqBack) gqBack.classList.add("hidden");
        if (gqLabel) gqLabel.textContent = "Your program";
        gqResult.innerHTML =
          '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Sample recommendation</p>' +
          '<p class="font-display font-semibold text-3xl mt-2">' + rec[0] + "</p>" +
          '<p class="text-stone-500 mt-3">' + rec[1] + "</p>" +
          '<div class="flex flex-wrap gap-3 mt-6">' +
          '<a href="contact.html" class="font-semibold px-6 py-3.5 rounded-full text-white" style="background:var(--brand)">Book a free consult</a>' +
          '<button id="gqRestart" type="button" class="border-2 font-semibold px-6 py-3.5 rounded-full" style="border-color:var(--accent)">Start over</button></div>' +
          '<p class="text-xs text-stone-400 mt-5">Sample guidance from a demo widget, not a medical or fitness prescription.</p>';
        gqResult.classList.remove("hidden");
        var rs = document.getElementById("gqRestart");
        if (rs) rs.addEventListener("click", function () { gqStep = 0; gqAns = []; gqResult.classList.add("hidden"); gqQ.parentElement.classList.remove("hidden"); if (gqBack) gqBack.classList.remove("hidden"); gqRender(); });
        return;
      }
      var q = gqData[gqStep];
      gqQ.textContent = q[0];
      if (gqLabel) gqLabel.textContent = "Step " + (gqStep + 1) + " of " + gqData.length;
      gqOpts.innerHTML = "";
      q[1].forEach(function (opt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = opt[1];
        b.addEventListener("click", function () {
          gqAns.push(opt[0]);
          gqStep++;
          gqRender();
        });
        gqOpts.appendChild(b);
      });
      if (gqBack) gqBack.classList.toggle("hidden", gqStep === 0);
    }
    if (gqBack) gqBack.addEventListener("click", function () { if (gqStep > 0) { gqStep--; gqAns.pop(); gqRender(); } });
    gqRender();
  }

  /* Trainer weekly schedule day filter */
  var schWrap = document.getElementById("classSchedule");
  if (schWrap) {
    var sbtns = schWrap.querySelectorAll(".tab-btn");
    var sdays = schWrap.querySelectorAll(".sch-day");
    sbtns.forEach(function (b) {
      b.addEventListener("click", function () {
        sbtns.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var d = b.getAttribute("data-day");
        sdays.forEach(function (sd) { sd.classList.toggle("hidden", sd.getAttribute("data-daypanel") !== d); });
      });
    });
  }

  /* BMI calculator (demo) */
  var bmiForm = document.getElementById("bmiForm");
  if (bmiForm) {
    var bmiOut = document.getElementById("bmiResult");
    bmiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var h = parseFloat(document.getElementById("bmiH").value);
      var w = parseFloat(document.getElementById("bmiW").value);
      if (!h || !w || h <= 0 || w <= 0) {
        bmiOut.innerHTML = '<p class="text-sm font-semibold text-stone-600">Enter a valid height and weight to calculate.</p>';
        bmiOut.classList.remove("hidden");
        return;
      }
      var bmi = w / Math.pow(h / 100, 2);
      var cat = bmi < 18.5 ? "below the typical range" : (bmi < 25 ? "in the typical range" : (bmi < 30 ? "above the typical range" : "well above the typical range"));
      bmiOut.innerHTML =
        '<p class="text-sm font-semibold uppercase tracking-widest" style="color:var(--accent)">Your result</p>' +
        '<p class="font-display font-semibold text-4xl mt-2">' + bmi.toFixed(1) + "</p>" +
        '<p class="text-stone-500 mt-3">That lands ' + cat + '. BMI is a rough screening tool, not a verdict on your health or fitness.</p>' +
        '<p class="text-xs text-stone-400 mt-4">Demo calculator for illustration only, not medical advice.</p>';
      bmiOut.classList.remove("hidden");
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
