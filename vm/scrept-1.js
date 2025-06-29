import Hyperbeam from "https://unpkg.com/@hyperbeam/web@latest/dist/index.js";

function isUserPremium() {
  const token = localStorage.getItem("cvm_token");
  if (!token) return false;
  return localStorage.getItem("cvm_premium") === "1";
}

function initApp() {
if (isUserPremium()) {
  document.documentElement.classList.add("premium-theme");
} else {
  document.documentElement.classList.remove("premium-theme");
}

if (isUserPremium()) {

  const warningH2 = document.querySelector('#warning h2');
  if (warningH2) {
    warningH2.textContent = "...";
  }

  const paras = document.querySelectorAll('#warning .overlay-content p');
  if (paras[1]) {
    paras[1].textContent =
      "...";
  }
  if (paras[2]) {
    paras[2].innerHTML = 
      `...`;
  }

  document.querySelectorAll('#warning .overlay-content i').forEach(elem => {
    const txt = elem.textContent.trim();
    if (txt === "What is premium?") {
      elem.textContent = " ";
    } else if (txt === "Why is there a time limit, and what is the point of having an account?") {
      elem.textContent = " ";
    }
  });

  const serverSwitch = document.getElementById('server-switch');
  if (serverSwitch) {
    serverSwitch.innerHTML = `
      <button data-url="https://example.com/" class="selected">Main 🟢</button>
      <button data-url="https://example.com/">1 🟢</button>
    `;
  }

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const username = localStorage.getItem("cvm_username") || "User";
  const greetingText = `Good ${timeOfDay}, ${username}`;

  const h2 = document.querySelector("#warning .overlay-content > h2");
  if (h2) {
    const greeting = document.createElement("p");
    greeting.textContent = greetingText;
    greeting.style.fontSize = "30px";
    greeting.style.fontWeight = "bold";
    greeting.style.marginTop = "8px";
    h2.insertAdjacentElement("afterend", greeting);
  }
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getUsername() {
  return localStorage.getItem("cvm_username") || "User";
}

let serverUrl = 'https://example.com/';
const selectedButton = document.querySelector('#server-switch button.selected');
if (selectedButton) {
  serverUrl = selectedButton.dataset.url;
} else {
  console.warn('No selected server-switch button found; using default URL.');
}
const serverButtons = document.querySelectorAll('#server-switch button');
if (serverButtons.length > 0) {
  serverButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serverButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      serverUrl = btn.dataset.url;
    });
  });
} else {
  console.warn('No server-switch buttons found; using default server URL.');
}

  async function start() {
    setTimeout(() => document.getElementById('black-notif').classList.add('active'), 5000);
    try {
      const res = await fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      const { embed_url } = await res.json();
      await Hyperbeam(
        document.getElementById("hyperbeam-container"),
        embed_url,
        { iframeAttributes: { allow: "fullscreen" } }
      );
    } catch {
      const e = document.getElementById('error-message');
      e.style.display = 'block';
      e.textContent = "It's either one, you ran the VM on a proxy, two, you tried to run the VM in the VM, or three, you tried to skid.";
    }
  }

 const acknowledgeCheckbox = document.getElementById('acknowledge-checkbox');
const closeWarningButton = document.getElementById('close-warning');
if (acknowledgeCheckbox && closeWarningButton) {
  acknowledgeCheckbox.addEventListener('change', e => {
    closeWarningButton.disabled = !e.target.checked;
  });
  closeWarningButton.addEventListener('click', () => {
    const warningOverlay = document.getElementById('warning');
    if (warningOverlay) {
      warningOverlay.classList.remove('active');
    }
    start();
    startSessionTimer();
  });
} else {
  console.error('Acknowledge checkbox or close-warning button not found.');
}
  const notifNo = document.getElementById('notif-no');
const notifYes = document.getElementById('notif-yes');
const blackOk = document.getElementById('black-ok');
const fullscreenBtn = document.getElementById('fullscreen-btn');
if (notifNo) {
  notifNo.addEventListener('click', () =>
    document.getElementById('black-notif').classList.remove('active')
  );
} else {
  console.warn('notif-no element not found.');
}
if (notifYes) {
  notifYes.addEventListener('click', () => {
    document.getElementById('black-notif').classList.remove('active');
    document.getElementById('black-alert').classList.add('active');
  });
} else {
  console.warn('notif-yes element not found.');
}
if (blackOk) {
  blackOk.addEventListener('click', () =>
    document.getElementById('black-alert').classList.remove('active')
  );
} else {
  console.warn('black-ok element not found.');
}
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  });
} else {
  console.warn('fullscreen-btn element not found.');
}
document.addEventListener('fullscreenchange', () => {
  const inFS = !!document.fullscreenElement;
  const bottomBar = document.getElementById('bottom-bar');
  if (bottomBar) {
    bottomBar.style.display = inFS ? 'none' : 'flex';
  } else {
    console.warn('bottom-bar element not found.');
  }
  document.getElementById('hyperbeam-container')
          .classList.toggle('fullscreen-mode', inFS);
});

function startSessionTimer() {
  const timerElement = document.getElementById('session-timer');
  if (!timerElement) {
    console.error('Session timer element (#session-timer) not found.');
    return;
  }
  let seconds = 45 * 40;
  timerElement.style.display = 'block';
  updateTimerDisplay(seconds);
  const interval = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      updateTimerDisplay(seconds);
    } else {
      clearInterval(interval);
      window.removeEventListener('beforeunload', blockUnload);
      window.location.href = 'https://nuhuh.learnstats.xyz/';
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const timerElement = document.getElementById('session-timer');
  if (timerElement) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

  document.addEventListener('keydown', e => {
    if (e.ctrlKey) {
      if (!['c','v','C','V'].includes(e.key)) e.preventDefault();
    } else if (e.altKey||e.metaKey) {
      e.preventDefault();
    } else if (['F1','F5','Tab','Escape'].includes(e.key)) {
      e.preventDefault();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const guestBtn = document.getElementById("auth-guest");
  const submit = document.getElementById("auth-submit");
  const toggle = document.getElementById("auth-toggle");
  const titleEl = document.getElementById("auth-title");
  const userEl = document.getElementById("auth-username");
  const passEl = document.getElementById("auth-password");
  const errorEl = document.getElementById("auth-error");
  const WORKER_BASE = "https://useless-vos-acc-runner.grady.lol";

  let isSignup = false;
  let started = false;

  function finishAuth() {
    if (overlay) {
      overlay.style.display = "none";
    } else {
      console.warn("Overlay element not found, cannot hide.");
    }
    if (!started) {
      started = true;
      initApp();
    }
  }

  if (localStorage.getItem("cvm_token")) {
    finishAuth();
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      localStorage.removeItem("cvm_token");
      localStorage.removeItem("cvm_premium");
      localStorage.removeItem("cvm_username");
      finishAuth();
    });
  } else {
    console.error("Guest button (#auth-guest) not found.");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      isSignup = !isSignup;
      if (titleEl) titleEl.textContent = isSignup ? "Sign Up" : "Login";
      if (submit) submit.textContent = isSignup ? "Sign Up" : "Login";
      if (toggle) toggle.textContent = isSignup
        ? "Already have an account? Login"
        : "Don't have an account? Sign up";
      if (errorEl) errorEl.textContent = "";
    });
  } else {
    console.error("Toggle button (#auth-toggle) not found.");
  }

  if (submit) {
    submit.addEventListener("click", async () => {
      const username = userEl ? userEl.value.trim() : "";
      const password = passEl ? passEl.value : "";
      if (!username || !password) {
        if (errorEl) errorEl.textContent = "Please fill in both fields.";
        return;
      }
      const endpoint = isSignup ? "/signup" : "/login";
      try {
        const res = await fetch(WORKER_BASE + endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");
        localStorage.setItem("cvm_token", data.token);
        localStorage.setItem("cvm_username", username);
        localStorage.setItem("cvm_premium", data.premium ? "1" : "0");
        finishAuth();
      } catch (err) {
        if (errorEl) errorEl.textContent = err.message;
      }
    });
  } else {
    console.error("Submit button (#auth-submit) not found.");
  }
});
