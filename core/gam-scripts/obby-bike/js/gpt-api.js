window.googletag = window.googletag || {
  cmd: []
};

const REWARDED_LOAD_INTERVAL = 10 * 1000; // 10 seconds

let gamingInterstitialSlot, rewardedSlot;
let showInterstitialFn = null;
let showRewardedFn = null;
let loadRewardedInterval = null;

if (['true', '1', 'on'].includes(getScriptDataAttrValue('testMode'))) {
  console.log("--- TEST MODE ---");
  INTERSTITIAL_SLOT_PATH = "/6355419/Travel/Europe/France/Paris";
  REWARDED_SLOT_PATH = "/22639388115/rewarded_web_example";
} else {
  INTERSTITIAL_SLOT_PATH = "/23138561638/rocketgames.io_interstitial";
  REWARDED_SLOT_PATH = "/23138561638/ingame_rewarded";
}

function defineGamingInterstitialSlot() {
  gamingInterstitialSlot = googletag.defineOutOfPageSlot(INTERSTITIAL_SLOT_PATH, googletag.enums.OutOfPageFormat.GAME_MANUAL_INTERSTITIAL);

  // Slot returns null if the page or device does not support interstitials.
  if (gamingInterstitialSlot) {
    gamingInterstitialSlot.addService(googletag.pubads());
    return true;
  }

  return false;
}

function defineRewardedSlot() {
  rewardedSlot = googletag.defineOutOfPageSlot(REWARDED_SLOT_PATH, googletag.enums.OutOfPageFormat.REWARDED);

  // Slot returns null if the page or device does not support rewarded ads.
  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());
    return true;
  }

  return false;
}

function createNewRewardedSlot() {
  if (defineRewardedSlot()) {
    googletag.display(rewardedSlot);
  }
}

function destroyRewardedSlot() {
  googletag.destroySlots([rewardedSlot]);
  rewardedSlot = null;
}

function addGamingInterstitialListeners() {
  // Add event listener to register click handler once interstitial loads.
  // If this event doesn't fire, check the browser console for errors.
  googletag.pubads().addEventListener("gameManualInterstitialSlotReady", (slotReadyEvent) => {
    if (gamingInterstitialSlot === slotReadyEvent.slot) {
      console.log("Interstitial ready");
      showInterstitialFn = slotReadyEvent.makeGameManualInterstitialVisible;
    }
  });

  googletag.pubads().addEventListener("gameManualInterstitialSlotClosed", () => {
    // Gaming interstitial ad slots are one-time use, so destroy the old slot
    // and create a new one.
    if (gamingInterstitialSlot) {
      googletag.destroySlots([gamingInterstitialSlot]);
      showInterstitialFn = null;
    }

    if (defineGamingInterstitialSlot()) {
      googletag.display(gamingInterstitialSlot);
    }

    sendMsgResumeGameAfterAds();
  });
}

function addRewardedListeners() {
  googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
    if (rewardedSlot === event.slot) {
      showRewardedFn = event.makeRewardedVisible;

      sendMsgRewardedAdsLoaded();

      if (loadRewardedInterval) {
        console.log("Clear the load rewarded interval, since rewarded slot is ready.");
        clearInterval(loadRewardedInterval);
        loadRewardedInterval = null;
      }
    }
  });

  googletag.pubads().addEventListener("rewardedSlotGranted", function() {
    destroyRewardedSlot();

    sendMsgRewardSuccessful();
    sendMsgResumeGameAfterAds();

    createNewRewardedSlot();
  });

  googletag.pubads().addEventListener("rewardedSlotClosed", function() {
    destroyRewardedSlot();

    sendMsgRewardedAdsDismissed();
    sendMsgResumeGameAfterAds();

    createNewRewardedSlot();
  });

  googletag.pubads().addEventListener("slotRenderEnded", (event) => {
    if (event.slot === rewardedSlot && event.isEmpty) {
      destroyRewardedSlot();

      sendMsgRewardedAdsNotLoaded();

      if (loadRewardedInterval) {
        // if interval is already running, return here
        return;
      }

      console.log(`Create interval to try to load rewarded every ${REWARDED_LOAD_INTERVAL / 1000} seconds.`);
      loadRewardedInterval = setInterval(function() {
        console.log("Trying to load rewarded ads again...");

        createNewRewardedSlot();
      }, REWARDED_LOAD_INTERVAL);
    }
  });
}

function InitSDKJs() {
  console.log('"Init SDK" Called');

  googletag.cmd.push(() => {
    // Define a gaming interstitial ad slot.
    defineGamingInterstitialSlot();
    // Define a rewarded ad slot.
    defineRewardedSlot();

    // Add gaming interstitial event listeners.
    addGamingInterstitialListeners();
    // Add rewarded event listeners.
    addRewardedListeners();

    const game = getScriptDataAttrValue('game');

    if (game) {
      // Configure page-level targeting.
      googletag.pubads().setTargeting('game', [game]);
    }

    // Enable SRA and services.
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();

    googletag.display(gamingInterstitialSlot);
    googletag.display(rewardedSlot);
  });
}

function CallInterstitialAdsJs() {
  console.log('"Call Interstitial Ads" Called');

  if (gamingInterstitialSlot && typeof showInterstitialFn === 'function') {
    sendMsgPauseGameBeforeAds();
    showInterstitialFn();
  }
}

function CallRewardedAdsJs() {
  console.log('"Call Rewarded Ads" Called');

  if (rewardedSlot && typeof showRewardedFn === 'function') {
    sendMsgPauseGameBeforeAds();
    showRewardedFn();
  }
}

function sendMsgRewardedAdsLoaded() {
  console.info("SendMessageToUnityInstance: Rewarded ready");
  myGameInstance.SendMessage('RHMAdsManager', 'isRewardedAdsLoaded');
}

function sendMsgRewardedAdsNotLoaded() {
  console.info("SendMessageToUnityInstance: Rewarded is not ready");
  myGameInstance.SendMessage('RHMAdsManager', 'isRewardedAdsNotLoaded');
}

function sendMsgRewardedAdsDismissed() {
  console.info("SendMessageToUnityInstance: Reward dismissed")
  myGameInstance.SendMessage('RHMAdsManager', 'RewardedAdsFailed');
  refocusCanvas();
}

function sendMsgRewardSuccessful() {
  console.info("SendMessageToUnityInstance: Reward successful")
  myGameInstance.SendMessage('RHMAdsManager', 'RewardedAdsSuccessfull');
  refocusCanvas();
}

function sendMsgPauseGameBeforeAds() {
  console.info("SendMessageToUnityInstance: Pause game before ads");
  myGameInstance.SendMessage('RHMAdsManager', 'pauseGame');
}

function sendMsgResumeGameAfterAds() {
  console.info("SendMessageToUnityInstance: Resume game after ads");
  myGameInstance.SendMessage('RHMAdsManager', 'resumeGame');
}

function refocusCanvas() {
  if (!canvas.hasAttribute('tabIndex')) {
    canvas.setAttribute('tabIndex', '0');
  }
  canvas.focus();
}

function getScriptDataAttrValue(paramName) {
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    if (script.src && script.src.includes('gpt-api.js') && script.dataset[paramName]) {
      return script.dataset[paramName];
    }
  }
  return null; // Return null if script or parameter not found
}