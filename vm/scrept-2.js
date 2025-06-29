document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");

    const WORKER_BASE = "https://useless-vos-acc-runner.grady.lol";
    let isSignup = false;

    const titleEl = document.getElementById("auth-title");
    const userEl  = document.getElementById("auth-username");
    const passEl  = document.getElementById("auth-password");
    const submit  = document.getElementById("auth-submit");
    const toggle  = document.getElementById("auth-toggle");
    const guest   = document.getElementById("auth-guest");
    const errorEl = document.getElementById("auth-error");
    const signoutBtn = document.getElementById("signout-btn");

    function updateAuthUI() {
      const loggedIn = !!localStorage.getItem("cvm_token");
      if (signoutBtn) {
        signoutBtn.style.display = loggedIn ? "inline-block" : "none";
      }
    }

    toggle.addEventListener("click", () => {
      isSignup = !isSignup;
      titleEl.textContent  = isSignup ? "Sign Up" : "Login";
      submit.textContent   = isSignup ? "Sign Up" : "Login";
      toggle.textContent   = isSignup
        ? "Already have an account? Login"
        : "Don't have an account? Sign up";
      errorEl.textContent = "";
    });

  submit.addEventListener("click", async () => {
  const username = userEl.value.trim();
  const password = passEl.value;

  if (!username || !password) {
    errorEl.textContent = "Please fill in both fields.";
    return;
  }

  submit.disabled = true;
  errorEl.textContent = "";

  const endpoint = isSignup ? "/signup" : "/login";

  try {
    const res = await fetch(WORKER_BASE + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      if (data.error?.includes("UNIQUE")) {
        throw new Error("That username is already taken. Please choose another.");
      }
      throw new Error(data.error || "Unknown error");
    }

    localStorage.setItem("cvm_token", data.token);
    localStorage.setItem("cvm_username", username);
    localStorage.setItem("cvm_premium", data.premium ? "1" : "0");

    updateAuthUI();
    overlay.style.display = "none";

   if (isSignup) {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  location.reload();
}

  } catch (err) {
    errorEl.textContent = err.message;
    submit.disabled = false;
  }
});
    guest.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    if (localStorage.getItem("cvm_token")) {
      overlay.style.display = "none";
    }

    if (signoutBtn) {
      signoutBtn.addEventListener("click", () => {
        localStorage.removeItem("cvm_token");
        localStorage.removeItem("cvm_username");
        updateAuthUI();
        overlay.style.display = "flex";
      });
    }

    updateAuthUI();
  });

   okButton.addEventListener("click", () => {
  document.getElementById("alertBox").classList.add("fade-out");
  setTimeout(() => {
    document.getElementById("alertBox").style.display = "none";
  }, 760);
});

document.addEventListener("DOMContentLoaded", () => {
  function isUserPremium() {
    const token = localStorage.getItem("cvm_token");
    if (!token) {
      console.log("No token found in localStorage, user is not premium.");
      return false;
    }
    const isPremium = localStorage.getItem("cvm_premium") === "1";
    console.log(`Premium status: ${isPremium}`);
    return isPremium;
  }

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  function getUsername() {
    const username = localStorage.getItem("cvm_username") || "User";
    console.log(`Username retrieved: "${username}"`);
    return username;
  }

  const overlayContent = document.querySelector("#warning .overlay-content");
  if (!overlayContent) {
    console.log("No overlay-content found in #warning, cannot proceed.");
    return;
  }

  const h2 = overlayContent.querySelector("h2");
  if (!h2) {
    console.log("No h2 found in overlay-content, cannot add greeting.");
    return;
  }

  const username = getUsername();
  if (username !== "User") {
    const existingGreeting = document.querySelector("#user-greeting");
    if (!existingGreeting) {
      const timeOfDay = getTimeOfDay();
      const greetingText = `Good ${timeOfDay}, ${username}`;
      const greeting = document.createElement("p");
      greeting.id = "user-greeting";
      greeting.textContent = greetingText;
      greeting.style.fontSize = "30px";
      greeting.style.fontWeight = "bold";
      greeting.style.marginTop = "8px";
      h2.insertAdjacentElement("afterend", greeting);
      console.log(`Created greeting: "${greetingText}"`);
    } else {
      console.log(`Greeting already exists with ID user-greeting: "${existingGreeting.textContent}"`);
    }
  } else {
    console.log("No username in localStorage (guest user), skipping greeting creation.");
  }

  setTimeout(() => {
    console.log("Checking for duplicate paragraphs in overlay-content.");
    const paragraphs = overlayContent.querySelectorAll("p");
    if (paragraphs.length === 0) {
      console.log("No <p> elements found in overlay-content, nothing to check.");
      return;
    }

    console.log("Paragraphs before duplicate removal:");
    paragraphs.forEach((p, index) => {
      console.log(`Index ${index}: "${p.textContent}" (ID: ${p.id || "none"})`);
    });

    const seenText = new Set();
    paragraphs.forEach((p, index) => {
      const text = p.textContent.trim().toLowerCase();
      if (seenText.has(text)) {
        console.log(`Removing duplicate paragraph at index ${index}: "${p.textContent}" (ID: ${p.id || "none"})`);
        p.remove();
      } else {
        seenText.add(text);
        console.log(`Keeping paragraph at index ${index}: "${p.textContent}" (ID: ${p.id || "none"})`);
      }
    });

    console.log(`Duplicate check complete. Total paragraphs after processing: ${overlayContent.querySelectorAll("p").length}`);
  }, 100);
});

    let awayTimestamp = null;
const maxAwayTime = 5 * 60 * 1000;

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    awayTimestamp = Date.now();
  } else if (document.visibilityState === 'visible') {
    awayTimestamp = null;
  }
});

setInterval(() => {
  if (awayTimestamp) {
    if (Date.now() - awayTimestamp > maxAwayTime) {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      location.reload();
    }
  }
}, 10000);
