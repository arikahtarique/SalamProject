(function () {

  var KEY = "sp_bookings";

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  var bookBtn = $("bookBtn");
  var bookDrop = $("bookDropdown");
  var menuDrop = $("menuDropdown");
  var menuBtn = $("menuBtn");

  if (bookBtn && bookDrop) {
    bookBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menuDrop) menuDrop.classList.remove("show");
      bookDrop.classList.toggle("show");
    });
    document.addEventListener("click", function () {
      bookDrop.classList.remove("show");
    });
    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        bookDrop.classList.remove("show");
      });
    }
  }

  var tabs = document.querySelectorAll(".bk-tab");
  var forms = document.querySelectorAll(".bk-form");

  function showTab(name) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle("active", on);
      if (on) found = true;
    });
    if (!found) return;
    forms.forEach(function (f) {
      f.classList.toggle("active", f.dataset.form === name);
    });
    $("bkResult").classList.remove("show");
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { showTab(t.dataset.tab); });
  });

  document.querySelectorAll("[data-tab-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      showTab(a.dataset.tabLink);
      if (bookDrop) bookDrop.classList.remove("show");
    });
  });

  if (location.hash.indexOf("#booking-") === 0) {
    showTab(location.hash.replace("#booking-", ""));
    // explore.html ke Booking menu se aane par seedha form tak scroll ho
    setTimeout(function () {
      var box = document.getElementById("booking");
      if (box) box.scrollIntoView();
    }, 50);
  }

 
  var today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('.bk-form input[type="date"]').forEach(function (d) {
    d.min = today;
  });

  // end date can't be before start date
  [["h_in", "h_out"], ["f_dep", "f_ret"], ["c_pick", "c_drop"]].forEach(function (pair) {
    var a = $(pair[0]), b = $(pair[1]);
    if (!a || !b) return;
    a.addEventListener("change", function () {
      b.min = a.value || today;
      if (b.value && b.value < b.min) b.value = "";
    });
  });

  var retField = $("f_ret") ? $("f_ret").closest(".field") : null;
  document.querySelectorAll('input[name="trip"]').forEach(function (r) {
    r.addEventListener("change", function () {
      var oneWay = document.querySelector('input[name="trip"]:checked').value === "one-way";
      if (retField) {
        retField.style.opacity = oneWay ? ".45" : "1";
        $("f_ret").disabled = oneWay;
        if (oneWay) { $("f_ret").value = ""; retField.classList.remove("invalid"); }
      }
    });
  });
  function fmt(v) {
    return new Date(v + "T00:00:00").toLocaleDateString("en-GB",
      { day: "numeric", month: "short", year: "numeric" });
  }
  function nights(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }
  function mark(input, bad) {
    input.closest(".field").classList.toggle("invalid", bad);
    return !bad;
  }
  function empty(input) { return !String(input.value).trim(); }
  function badNum(input, min, max) {
    var n = Number(input.value);
    return !(n >= min && n <= max);
  }

  var ICONS = {
    hotels: "fa-hotel",
    flights: "fa-plane",
    tours: "fa-route",
    cars: "fa-car-side"
  };
  var LABELS = {
    hotels: "Hotel",
    flights: "Flight",
    tours: "Tour",
    cars: "Car rental"
  };

  var builders = {

    hotels: function (f) {
      var ok = true;
      ok = mark(f.h_city, empty(f.h_city)) && ok;
      ok = mark(f.h_in, empty(f.h_in)) && ok;
      ok = mark(f.h_out, empty(f.h_out) || f.h_out.value <= f.h_in.value) && ok;
      ok = mark(f.h_guests, badNum(f.h_guests, 1, 12)) && ok;
      ok = mark(f.h_rooms, badNum(f.h_rooms, 1, 6)) && ok;
      if (!ok) return null;
      var n = nights(f.h_in.value, f.h_out.value);
      return {
        type: "hotels",
        title: "Hotel in " + f.h_city.value,
        details: [
          fmt(f.h_in.value) + " to " + fmt(f.h_out.value) + " (" + n + (n === 1 ? " night" : " nights") + ")",
          f.h_guests.value + " guest(s), " + f.h_rooms.value + " room(s)"
        ]
      };
    },

    flights: function (f) {
      var oneWay = f.trip.value === "one-way";
      var ok = true;
      ok = mark(f.f_from, empty(f.f_from)) && ok;
      ok = mark(f.f_to, empty(f.f_to) || f.f_to.value === f.f_from.value) && ok;
      ok = mark(f.f_dep, empty(f.f_dep)) && ok;
      if (!oneWay) ok = mark(f.f_ret, empty(f.f_ret) || f.f_ret.value < f.f_dep.value) && ok;
      ok = mark(f.f_pax, badNum(f.f_pax, 1, 9)) && ok;
      if (!ok) return null;
      return {
        type: "flights",
        title: f.f_from.value + " to " + f.f_to.value,
        details: [
          (oneWay ? "One way, " + fmt(f.f_dep.value)
                  : "Return, " + fmt(f.f_dep.value) + " to " + fmt(f.f_ret.value)),
          f.f_pax.value + " passenger(s), " + f.f_cabin.value
        ]
      };
    },

    tours: function (f) {
      var ok = true;
      ok = mark(f.t_pkg, empty(f.t_pkg)) && ok;
      ok = mark(f.t_start, empty(f.t_start)) && ok;
      ok = mark(f.t_pax, badNum(f.t_pax, 1, 20)) && ok;
      if (!ok) return null;
      return {
        type: "tours",
        title: f.t_pkg.value,
        details: [
          "Starts " + fmt(f.t_start.value),
          f.t_pax.value + " traveller(s)"
        ]
      };
    },

    cars: function (f) {
      var ok = true;
      ok = mark(f.c_city, empty(f.c_city)) && ok;
      ok = mark(f.c_pick, empty(f.c_pick)) && ok;
      ok = mark(f.c_drop, empty(f.c_drop) || f.c_drop.value < f.c_pick.value) && ok;
      ok = mark(f.c_type, empty(f.c_type)) && ok;
      if (!ok) return null;
      return {
        type: "cars",
        title: f.c_type.value + " in " + f.c_city.value,
        details: [
          fmt(f.c_pick.value) + " to " + fmt(f.c_drop.value),
          f.c_driver.checked ? "With driver" : "Self drive"
        ]
      };
    }
  };

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var booking = builders[form.dataset.form](form.elements);
      if (!booking) return;

      booking.id = "SB-" + Date.now().toString(36).toUpperCase().slice(-6) +
                   Math.floor(Math.random() * 90 + 10);
      var list = read();
      list.unshift(booking);
      write(list);

      showResult(booking);
      form.reset();
      resetFlightUI();
      renderList();
    });
  });

  function resetFlightUI() {
    if (!retField) return;
    retField.style.opacity = "1";
    $("f_ret").disabled = false;
  }

  function showResult(b) {
    var box = $("bkResult");
    box.innerHTML =
      '<i class="fa-solid fa-circle-check"></i>' +
      "<h3>Booking request received</h3>" +
      "<p><b>" + esc(b.title) + "</b></p>" +
      "<p>" + esc(b.details.join("  |  ")) + "</p>" +
      '<p class="ref">' + esc(b.id) + "</p>" +
      "<p>Demo only: no real booking was made and no payment was taken.</p>";
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function renderList() {
    var wrap = $("bkList");
    var none = $("bkNone");
    var list = read();
    wrap.innerHTML = "";
    none.style.display = list.length ? "none" : "block";

    list.forEach(function (b) {
      var item = document.createElement("div");
      item.className = "bk-item";
      item.innerHTML =
        '<div class="ico"><i class="fa-solid ' + (ICONS[b.type] || "fa-ticket") + '"></i></div>' +
        '<div class="bk-info">' +
          "<small>" + esc(LABELS[b.type] || "Booking") + "</small>" +
          "<h4>" + esc(b.title) + "</h4>" +
          "<p>" + esc(b.details.join("  |  ")) + "</p>" +
        "</div>" +
        '<div class="bk-side">' +
          '<span class="bk-id">' + esc(b.id) + "</span>" +
          '<button type="button" class="bk-cancel" data-id="' + esc(b.id) + '">Cancel</button>' +
        "</div>";
      wrap.appendChild(item);
    });
  }

  $("bkList").addEventListener("click", function (e) {
    var btn = e.target.closest(".bk-cancel");
    if (!btn) return;
    if (!confirm("Cancel this booking?")) return;
    write(read().filter(function (b) { return b.id !== btn.dataset.id; }));
    renderList();
  });

  renderList();

  /* ---------- Sub navbar: highlight current section ---------- */
  var links = document.querySelectorAll(".subnav a[data-spy]");
  if ("IntersectionObserver" in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.dataset.spy] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          if (map[en.target.id]) map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

})();

(function () {
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
})();