
(function () {

  const USERS_KEY = "sp_users";      // saare registered users (demo: browser mein)
  const SESSION_KEY = "sp_session";  // abhi login user

  document.body.insertAdjacentHTML("beforeend", `
    <div class="sp-overlay" id="spOverlay">
      <div class="sp-modal" role="dialog" aria-modal="true" aria-label="Sign in">

        <button class="sp-close" id="spClose" aria-label="Close">&times;</button>

        <div class="sp-side">
          <h2>Salam <b>Pakistan</b></h2>
        </div>

        <div class="sp-main">

          <div class="sp-tabs">
            <button class="sp-tab active" data-tab="login">Sign In</button>
            <button class="sp-tab" data-tab="register">New Account</button>
          </div>

          <!-- LOGIN -->
          <form class="sp-form active" id="spLoginForm" novalidate>
            <div class="sp-field">
              <i class="fa-regular fa-envelope lead"></i>
              <input type="email" name="email" placeholder="Email" autocomplete="email">
            </div>
            <div class="sp-field">
              <i class="fa-solid fa-lock lead"></i>
              <input type="password" name="password" placeholder="Password" autocomplete="current-password">
              <button type="button" class="sp-eye" aria-label="Show password">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
            <button type="button" class="sp-forgot" id="spForgot">Forgot your password?</button>
            <div class="sp-msg" id="spLoginMsg"></div>
            <button type="submit" class="sp-submit">Login</button>
          </form>

          <!-- REGISTER -->
          <form class="sp-form" id="spRegisterForm" novalidate>
            <div class="sp-field">
              <i class="fa-regular fa-user lead"></i>
              <input type="text" name="name" placeholder="Full name" autocomplete="name">
            </div>
            <div class="sp-field">
              <i class="fa-regular fa-envelope lead"></i>
              <input type="email" name="email" placeholder="Email" autocomplete="email">
            </div>
            <div class="sp-field">
              <i class="fa-solid fa-lock lead"></i>
              <input type="password" name="password" placeholder="Password (min 6 characters)" autocomplete="new-password">
              <button type="button" class="sp-eye" aria-label="Show password">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
            <div class="sp-field">
              <i class="fa-solid fa-lock lead"></i>
              <input type="password" name="confirm" placeholder="Confirm password" autocomplete="new-password">
            </div>
            <div class="sp-msg" id="spRegisterMsg"></div>
            <button type="submit" class="sp-submit">Create Account</button>
          </form>

        </div>
      </div>
    </div>
  `);

  const overlay = document.getElementById("spOverlay");
  const loginForm = document.getElementById("spLoginForm");
  const registerForm = document.getElementById("spRegisterForm");
  const loginMsg = document.getElementById("spLoginMsg");
  const registerMsg = document.getElementById("spRegisterMsg");


  function readJSON(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  async function hashPassword(password) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    }
    return btoa(unescape(encodeURIComponent(password)));
  }

  async function registerUser(name, email, password) {
    const users = readJSON(USERS_KEY, []);
    const exists = users.some(function (u) { return u.email === email; });
    if (exists) {
      return { ok: false, message: "This email is already registered." };
    }
    users.push({ name: name, email: email, passwordHash: await hashPassword(password) });
    writeJSON(USERS_KEY, users);
    return { ok: true, user: { name: name, email: email } };
  }

  async function loginUser(email, password) {
    const users = readJSON(USERS_KEY, []);
    const hash = await hashPassword(password);
    const user = users.find(function (u) {
      return u.email === email && u.passwordHash === hash;
    });
    if (!user) {
      return { ok: false, message: "Wrong email or password." };
    }
    return { ok: true, user: { name: user.name, email: user.email } };
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setMsg(el, text, type) {
    el.textContent = text || "";
    el.className = "sp-msg" + (type ? " " + type : "");
  }

  function showTab(name) {
    document.querySelectorAll(".sp-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === name);
    });
    loginForm.classList.toggle("active", name === "login");
    registerForm.classList.toggle("active", name === "register");
    setMsg(loginMsg, "");
    setMsg(registerMsg, "");
  }

  function openModal(tab) {
    showTab(tab || "login");
    overlay.classList.add("open");
  }
  function closeModal() {
    overlay.classList.remove("open");
  }

  const oldBtn = document.getElementById("accountBtn");
  const accountBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(accountBtn, oldBtn);

  function getSession() {
    return readJSON(SESSION_KEY, null);
  }

  function updateAccountButton() {
    const session = getSession();
    accountBtn.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "fa-regular fa-user";
    accountBtn.appendChild(icon);
    accountBtn.appendChild(document.createTextNode(
      " " + (session ? session.name.split(" ")[0] : "Sign In")
    ));
    accountBtn.classList.toggle("logged-in", !!session);
  }

  accountBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const session = getSession();
    if (session) {
      if (confirm("Logged in as " + session.email + ".\nDo you want to log out?")) {
        try { localStorage.removeItem(SESSION_KEY); } catch (err) {}
        updateAccountButton();
      }
    } else {
      openModal("login");
    }
  });

  updateAccountButton();

  document.getElementById("spClose").addEventListener("click", closeModal);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.querySelectorAll(".sp-tab").forEach(function (tab) {
    tab.addEventListener("click", function () { showTab(tab.dataset.tab); });
  });

  // password show / hide
  document.querySelectorAll(".sp-eye").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = btn.parentNode.querySelector("input");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.firstElementChild.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
    });
  });

  document.getElementById("spForgot").addEventListener("click", function () {
    setMsg(loginMsg, "Password reset will work once a backend is connected.", "error");
  });

  /* LOGIN submit */
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = loginForm.email.value.trim().toLowerCase();
    const password = loginForm.password.value;

    if (!isEmail(email)) return setMsg(loginMsg, "Please enter a valid email.", "error");
    if (!password) return setMsg(loginMsg, "Please enter your password.", "error");

    const btn = loginForm.querySelector(".sp-submit");
    btn.disabled = true;
    const result = await loginUser(email, password);
    btn.disabled = false;

    if (!result.ok) return setMsg(loginMsg, result.message, "error");

    writeJSON(SESSION_KEY, result.user);
    updateAccountButton();
    setMsg(loginMsg, "Welcome back, " + result.user.name + "!", "success");
    loginForm.reset();
    setTimeout(closeModal, 900);
  });

  /* REGISTER submit */
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim().toLowerCase();
    const password = registerForm.password.value;
    const confirm = registerForm.confirm.value;

    if (name.length < 2) return setMsg(registerMsg, "Please enter your full name.", "error");
    if (!isEmail(email)) return setMsg(registerMsg, "Please enter a valid email.", "error");
    if (password.length < 6) return setMsg(registerMsg, "Password must be at least 6 characters.", "error");
    if (password !== confirm) return setMsg(registerMsg, "Passwords do not match.", "error");

    const btn = registerForm.querySelector(".sp-submit");
    btn.disabled = true;
    const result = await registerUser(name, email, password);
    btn.disabled = false;

    if (!result.ok) return setMsg(registerMsg, result.message, "error");

    writeJSON(SESSION_KEY, result.user);
    updateAccountButton();
    setMsg(registerMsg, "Account created. Welcome, " + name + "!", "success");
    registerForm.reset();
    setTimeout(closeModal, 1100);
  });

})();