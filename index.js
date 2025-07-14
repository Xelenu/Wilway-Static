let isLoading = false;
const TAB_COOLDOWN = 800;
let lastTabSwitch = 0;
let cloakEnabled = false;
let initialLoadDone = false;
let autoHideEnabled = false;
const AUTOHIDE_THRESHOLD = 50;
let isHoveringBottomBar = false;
let isHoveringToggleButton = false;
let hideTimeout = null;
let fsHideSettingsEnabled = false;

function detectImpactFont() {
  const testString = "test";
  const span = document.createElement('span');
  span.style.fontSize = '100px';
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.textContent = testString;
  document.body.appendChild(span);
  span.style.fontFamily = 'Impact';
  const impactWidth = span.offsetWidth;
  span.style.fontFamily = 'Poppins';
  const fallbackWidth = span.offsetWidth;
  document.body.removeChild(span);
  if (impactWidth === fallbackWidth) {
    document.body.classList.add('no-impact');
  }
}

function buttonClick(buttonNumber) {
  if (isLoading) return;
  isLoading = true;
  const loadingScreen = document.getElementById('loadingScreen');
  const progressCircle = document.querySelector('.progress-circle circle');
  const iframe = document.getElementById('contentIframe');
  const buttons = document.querySelectorAll('.theme-button');
  const homeContainer = document.querySelector('.home-container');
  const minDuration = 1000;
  const maxDuration = 1300;
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  buttons.forEach(btn => btn.classList.add('disabled'));
  buttons.forEach(btn => btn.classList.remove('selected'));
  buttons[buttonNumber - 1].classList.add('selected');
  console.log(`Button ${buttonNumber} clicked`);
  const sources = {
    2: '/vm/',
    3: '/gam/',
    4: '/ai/',
    5: '/chat/',
    6: '/chesao/',
    7: '/misc/',
    8: '/partner/',
    9: '/about/',
    10: '/credits/'
  };
  const sourceUrl = sources[buttonNumber];
  console.log('Resolved URL:', sourceUrl);
  if (buttonNumber === 1) {
    iframe.style.display = 'none';
    homeContainer.classList.remove('hidden');
    console.log('Home button clicked, showing background and home elements');
  } else if (sourceUrl) {
    iframe.src = sourceUrl;
    iframe.style.display = 'block';
    homeContainer.classList.add('hidden');
    console.log(`Loading iframe with: ${sourceUrl}`);
  } else {
    console.warn(`⚠️ No URL defined for button ${buttonNumber}. Reverting to Home.`);
    iframe.style.display = 'none';
    homeContainer.classList.remove('hidden');
    buttons[buttonNumber - 1].classList.remove('selected');
    buttons[0].classList.add('selected');
    isLoading = false;
    buttons.forEach(btn => btn.classList.remove('disabled'));
    return;
  }
  fetch('/core/messages.json')
    .then(response => response.json())
    .then(data => {
      const messages = data.messages;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const loadingText = document.getElementById('loading-text');
      if (loadingText) {
        loadingText.textContent = randomMessage;
      }
    })
    .catch(() => {
      const loadingText = document.getElementById('loading-text');
      if (loadingText) {
        loadingText.textContent = "Loading Wilway...";
      }
    });
  loadingScreen.style.display = 'flex';
  loadingScreen.style.animation = 'none';
  progressCircle.style.animation = 'none';
  loadingScreen.offsetHeight;
  loadingScreen.style.animation = `loadingFade ${duration}ms linear forwards`;
  progressCircle.style.animation = `progressFill ${duration}ms linear forwards`;
  setTimeout(() => {
    buttons.forEach(btn => btn.classList.remove('disabled'));
    loadingScreen.style.display = 'none';
    isLoading = false;
  }, duration);
}

document.querySelectorAll('.theme-button').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const effect = document.createElement('span');
    effect.className = 'click-effect';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    this.appendChild(effect);
    effect.addEventListener('animationend', () => {
      effect.remove();
    });
  });
});

function toggleSettingsPanel() {
  const panel = document.getElementById('settingsPanel');
  const pauseButton = panel.querySelector('.animation-button');
  const isVisible = !panel.classList.contains('hidden');
  if (isVisible) {
    panel.classList.add('hidden');
    setTimeout(() => {
      panel.style.display = 'none';
    }, 300);
  } else {
    panel.style.display = 'flex';
    panel.offsetHeight;
    panel.classList.remove('hidden');
  }
  const background = document.querySelector('.background');
  pauseButton.textContent = background.classList.contains('paused') ? '🔴 Animation' : '🟢 Animation';
}

function toggleBottomBar() {
  const bottomBar = document.querySelector('.bottom-bar');
  const hoverArea = document.querySelector('.hover-area');
  const fullscreenButton = document.querySelector('.fullscreen-button');
  const toggleButton = document.querySelector('.toggle-bar-button');
  const isVisible = !bottomBar.classList.contains('hidden');
  if (isVisible) {
    bottomBar.classList.add('hidden');
    hoverArea.classList.add('hidden');
    if (!document.fullscreenElement) {
      fullscreenButton.classList.remove('hidden');
      fullscreenButton.style.display = 'flex';
    }
    toggleButton.textContent = '🔼';
    if (!toggleButton.textContent.match(/🔼/)) {
      toggleButton.textContent = '▲';
    }
    setTimeout(() => {
      bottomBar.style.display = 'none';
      hoverArea.style.display = 'none';
    }, 300);
  } else {
    bottomBar.style.display = 'flex';
    hoverArea.style.display = 'block';
    fullscreenButton.style.display = 'none';
    bottomBar.offsetHeight;
    hoverArea.offsetHeight;
    bottomBar.classList.remove('hidden');
    hoverArea.classList.remove('hidden');
    fullscreenButton.classList.add('hidden');
    toggleButton.textContent = '🔽';
    if (!toggleButton.textContent.match(/🔽/)) {
      toggleButton.textContent = '▼';
    }
  }
}

function toggleFullscreen() {
  const fullscreenButton = document.querySelector('.fullscreen-button');
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
    fullscreenButton.style.display = 'none';
    fullscreenButton.classList.add('hidden');
  }
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

function toggleCloak() {
  cloakEnabled = !cloakEnabled;
  const btn = document.getElementById('cloakBtn');
  setCookie('cloakEnabled', cloakEnabled ? 'true' : 'false', 30);
  btn.textContent = `${cloakEnabled ? '🟢' : '🔴'} Cloak`;
  if (cloakEnabled) {
    openCloakedWindow();
  }
}

function openCloakedWindow() {
  const currentUrl = window.location.href;
  const blankWindow = window.open('about:blank', '_blank');
  if (blankWindow) {
    blankWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>‎ </title>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          iframe { width: 100vw; height: 100vh; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${currentUrl}" allowfullscreen></iframe>
      </body>
      </html>
    `);
    blankWindow.document.close();
    window.location.href = 'https://classroom.google.com/';
  }
}

function toggleAnimation() {
  const background = document.querySelector('.background');
  const pauseButton = document.querySelector('.animation-button');
  const isPaused = background.classList.contains('paused');
  if (isPaused) {
    background.classList.remove('paused');
    pauseButton.textContent = '🟢 Animation';
    setCookie('animationPaused', 'false', 30);
  } else {
    background.classList.add('paused');
    pauseButton.textContent = '🔴 Animation';
    setCookie('animationPaused', 'true', 30);
  }
}

function toggleAutoHide() {
  autoHideEnabled = !autoHideEnabled;
  const btn = document.getElementById('autoHideBtn');
  setCookie('autoHideBar', autoHideEnabled ? 'true' : 'false', 30);
  if (autoHideEnabled) {
    hideBottomBar();
    hideToggleButton();
    document.addEventListener('mousemove', handleMouseMoveForAutoHide);
  } else {
    document.removeEventListener('mousemove', handleMouseMoveForAutoHide);
    showBottomBar();
    showToggleButton();
    setTimeout(() => location.reload(), 200);
  }
  btn.textContent = `${autoHideEnabled ? '🟢' : '🔴'} Auto-hide Bar`;
}

function handleMouseMoveForAutoHide(e) {
  const y = e.clientY;
  const height = window.innerHeight;
  if (y > height - AUTOHIDE_THRESHOLD) {
    showBottomBar();
    clearTimeout(hideTimeout);
  } else {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isHoveringBottomBar && !isHoveringToggleButton) {
        hideBottomBar();
      }
    }, 300);
  }
}

function hideBottomBar() {
  const bottomBar = document.querySelector('.bottom-bar');
  if (bottomBar) {
    bottomBar.style.transition = 'opacity 0.3s ease';
    bottomBar.style.opacity = '0';
    setTimeout(() => {
      bottomBar.style.display = 'none';
    }, 300);
  }
}

function showBottomBar() {
  const bottomBar = document.querySelector('.bottom-bar');
  if (bottomBar) {
    bottomBar.style.display = 'flex';
    bottomBar.offsetHeight;
    bottomBar.style.transition = 'opacity 0.3s ease';
    bottomBar.style.opacity = '1';
  }
}

function hideToggleButton() {
  const toggleBtn = document.querySelector('.toggle-bar-button');
  if (toggleBtn) {
    toggleBtn.style.transition = 'opacity 0.3s ease';
    toggleBtn.style.opacity = '0 Tracing';
    setTimeout(() => {
      toggleBtn.style.display = 'none';
    }, 300);
  }
}

function showToggleButton() {
  const toggleBtn = document.querySelector('.toggle-bar-button');
  if (toggleBtn) {
    toggleBtn.style.display = 'block';
    toggleBtn.offsetHeight;
    toggleBtn.style.transition = 'opacity 0.3s ease';
    toggleBtn.style.opacity = '1';
  }
}

const bottomBar = document.querySelector('.bottom-bar');
if (bottomBar) {
  bottomBar.addEventListener('mouseenter', () => {
    isHoveringBottomBar = true;
    clearTimeout(hideTimeout);
  });
  bottomBar.addEventListener('mouseleave', () => {
    isHoveringBottomBar = false;
    hideTimeout = setTimeout(() => {
      if (autoHideEnabled) hideBottomBar();
    }, 300);
  });
}

function toggleFsHideSettings() {
  fsHideSettingsEnabled = !fsHideSettingsEnabled;
  const btn = document.getElementById('fsHideSettingsBtn');
  setCookie('fsHideSettings', fsHideSettingsEnabled ? 'true' : 'false', 30);
  updateSettingsButtonVisibility();
  btn.textContent = `${fsHideSettingsEnabled ? '🔴' : '🟢'} Settings in fullscreen`;
}

function updateSettingsButtonVisibility() {
  const settingsBtn = document.querySelector('.settings-button');
  if (!settingsBtn) return;
  if (fsHideSettingsEnabled && document.fullscreenElement) {
    settingsBtn.style.display = 'none';
  } else {
    settingsBtn.style.display = 'flex';
  }
}

['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(eventType => {
  document.addEventListener(eventType, () => {
    const fullscreenButton = document.querySelector('.fullscreen-button');
    const bottomBar = document.querySelector('.bottom-bar');
    if (!document.fullscreenElement && bottomBar.classList.contains('hidden')) {
      fullscreenButton.style.display = 'flex';
      fullscreenButton.classList.remove('hidden');
    } else {
      fullscreenButton.style.display = 'none';
      fullscreenButton.classList.add('hidden');
    }
    updateSettingsButtonVisibility();
  });
});

function updatePageTitle() {
  const input = document.getElementById('settingsTabNameInput');
  const newTitle = input.value.trim() || 'Wilway';
  document.title = newTitle;
  setCookie('customTitle', newTitle, 30);
}

document.addEventListener('DOMContentLoaded', () => {
  const autoHideBtn = document.getElementById('autoHideBtn');
  const autoHideCookie = getCookie('autoHideBar');
  if (autoHideBtn) {
    autoHideEnabled = (autoHideCookie === 'true');
    autoHideBtn.textContent = `${autoHideEnabled ? '🟢' : '🔴'} Auto-Hide Bar`;
    if (autoHideEnabled) {
      hideBottomBar();
      hideToggleButton();
      document.addEventListener('mousemove', handleMouseMoveForAutoHide);
    }
  }
  const fsHideSettingsBtn = document.getElementById('fsHideSettingsBtn');
  const fsHideCookie = getCookie('fsHideSettings');
  if (fsHideSettingsBtn) {
    fsHideSettingsEnabled = (fsHideCookie === 'true');
    fsHideSettingsBtn.textContent = `${fsHideSettingsEnabled ? '🔴' : '🟢'} Settings in Fullscreen`;
  }
  const cloakBtn = document.getElementById('cloakBtn');
  const cloakCookie = getCookie('cloakEnabled');
  if (cloakBtn) {
    cloakEnabled = (cloakCookie === 'true');
    cloakBtn.textContent = `${cloakEnabled ? '🟢' : '🔴'} Cloak`;
    if (cloakEnabled && !initialLoadDone) {
      initialLoadDone = true;
      openCloakedWindow();
    }
  }
  const titleInput = document.getElementById('settingsTabNameInput');
  const customTitle = getCookie('customTitle');
  if (customTitle) {
    document.title = customTitle;
    if (titleInput) titleInput.value = customTitle;
  } else {
    document.title = 'Wilway';
  }
  updateSettingsButtonVisibility();
  const loadingScreen = document.getElementById('loadingScreen');
  const progressCircle = document.querySelector('.progress-circle circle');
  const isReturningUser = getCookie('visitedBefore') === 'true';
  let minDuration, maxDuration;
  if (isReturningUser) {
    minDuration = 1800;
    maxDuration = 2000;
  } else {
    minDuration = 3400;
    maxDuration = 4000;
    setCookie('visitedBefore', 'true', 32);
  }
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  loadingScreen.style.animationDuration = `${duration}ms`;
  progressCircle.style.animationDuration = `${duration}ms`;
  loadingScreen.addEventListener('animationend', () => {
    loadingScreen.style.display = 'none';
    const iframe = document.getElementById('contentIframe');
    const buttons = document.querySelectorAll('.theme-button');
    const homeContainer = document.querySelector('.home-container');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[0].classList.add('selected');
  });
  const animationPaused = getCookie('animationPaused');
  const background = document.querySelector('.background');
  const pauseButton = document.querySelector('.animation-button');
  if (animationPaused === 'true') {
    background.classList.add('paused');
    if (pauseButton) pauseButton.textContent = '🔴 Animation';
  } else {
    background.classList.remove('paused');
    if (pauseButton) pauseButton.textContent = '🟢 Animation';
  }
  const toggleButton = document.querySelector('.toggle-bar-button');
  toggleButton.textContent = '🔽';
  if (!toggleButton.textContent.match(/🔽/)) {
    toggleButton.textContent = '▼';
  }
  detectImpactFont();
});

    function toggleSettingsPanel() {
  const panel = document.getElementById('settingsPanel');
  const pauseButton = panel.querySelector('.animation-button');
  const isVisible = !panel.classList.contains('hidden');
  if (isVisible) {
    panel.classList.add('hidden');
    setTimeout(() => {
      panel.style.display = 'none';
    }, 300);
  } else {
    panel.style.display = 'flex';
    panel.offsetHeight;
    panel.classList.remove('hidden');
  }
  const background = document.querySelector('.background');
  pauseButton.textContent = background.classList.contains('paused') ? '🔴 Animation' : '🟢 Animation';
}

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('settingsPanel');
  panel.classList.add('hidden');
  panel.style.display = 'none';
});
