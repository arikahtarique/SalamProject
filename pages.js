
const menuBtn = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuDropdown");
if (menuBtn && menuDropdown) {
  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    menuDropdown.classList.toggle("show");
  });
  document.addEventListener("click", function () {
    menuDropdown.classList.remove("show");
  });
}

const header = document.querySelector(".header");
function onScroll() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", onScroll);
onScroll();

function setInvalid(field, bad) {
  field.classList.toggle("invalid", bad);
  return !bad;
}
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function box(form, name) {
  return form.elements[name].closest(".field");
}

// ---------- e-Visa form ----------
const visaForm = document.getElementById("visaForm");
if (visaForm) {
  const today = new Date().toISOString().split("T")[0];
  visaForm.elements["arrival"].min = today;

  visaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const f = visaForm.elements;
    let ok = true;

    ok = setInvalid(box(visaForm, "fullName"), f["fullName"].value.trim().length < 3) && ok;
    ok = setInvalid(box(visaForm, "email"), !isEmail(f["email"].value.trim())) && ok;
    ok = setInvalid(box(visaForm, "nationality"), !f["nationality"].value) && ok;
    ok = setInvalid(box(visaForm, "passport"), !/^[A-Za-z0-9]{6,12}$/.test(f["passport"].value.trim())) && ok;
    ok = setInvalid(box(visaForm, "visaType"), !f["visaType"].value) && ok;
    ok = setInvalid(box(visaForm, "arrival"), !f["arrival"].value || f["arrival"].value < today) && ok;

    // passport must be valid 6 months after arrival
    let badExpiry = true;
    if (f["expiry"].value && f["arrival"].value) {
      const min = new Date(f["arrival"].value);
      min.setMonth(min.getMonth() + 6);
      badExpiry = new Date(f["expiry"].value) < min;
    }
    ok = setInvalid(box(visaForm, "expiry"), badExpiry) && ok;

    if (!f["agree"].checked) {
      alert("Please confirm that the information is correct.");
      ok = false;
    }
    if (!ok) return;

    const ref = "SP-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10);
    document.getElementById("refNumber").textContent = ref;
    document.getElementById("resultName").textContent = f["fullName"].value.trim();
    const result = document.getElementById("visaResult");
    result.classList.add("show");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
    visaForm.reset();
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const f = contactForm.elements;
    let ok = true;

    ok = setInvalid(box(contactForm, "name"), f["name"].value.trim().length < 2) && ok;
    ok = setInvalid(box(contactForm, "email"), !isEmail(f["email"].value.trim())) && ok;
    ok = setInvalid(box(contactForm, "subject"), !f["subject"].value.trim()) && ok;
    ok = setInvalid(box(contactForm, "message"), f["message"].value.trim().length < 10) && ok;
    if (!ok) return;

    document.getElementById("contactResult").classList.add("show");
    contactForm.reset();
  });
}