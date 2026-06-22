// ===============================================
// Yuyeon Kim — site navigation & transitions
// ===============================================

(() => {
  const screens = document.querySelectorAll(".screen");
  const veil = document.getElementById("veil");

  const screenMap = {
    home: document.getElementById("screen-home"),
    work: document.getElementById("screen-work"),
    work1: document.getElementById("screen-work1"),
    marketing: document.getElementById("screen-marketing"),
    work2: document.getElementById("screen-marketing"),
    about: document.getElementById("screen-about"),
    contact: document.getElementById("screen-contact"),
  };

  let current = "home";
  let isAnimating = false;

  function originFromEvent(el) {
    if (!el) return { x: "50%", y: "50%" };
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return { x: `${x}px`, y: `${y}px` };
  }

  function goTo(targetKey, originEl) {
    if (isAnimating) return;
    const targetScreen = screenMap[targetKey];
    const currentScreen = screenMap[current];
    if (!targetScreen || targetScreen === currentScreen) return;

    isAnimating = true;

    const origin = originFromEvent(originEl);
    veil.style.setProperty("--vx", origin.x);
    veil.style.setProperty("--vy", origin.y);
    veil.classList.add("is-active");

    // step 1: fade current screen out + veil in
    currentScreen.classList.add("is-leaving");

    setTimeout(() => {
      currentScreen.classList.remove("is-active", "is-leaving");
      targetScreen.classList.add("is-active");
      window.scrollTo({
        top: 0,
        behavior: "instant" in window ? "instant" : "auto",
      });

      // step 2: fade veil out to reveal new screen
      requestAnimationFrame(() => {
        veil.classList.remove("is-active");
      });

      current = targetKey;
      history.pushState(
        { screen: targetKey },
        "",
        targetKey === "home" ? "#" : `#${targetKey}`,
      );

      setTimeout(() => {
        isAnimating = false;
      }, 480);
    }, 420);
  }

  // ---- wire up nav buttons ----
  document.querySelectorAll("[data-target]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(el.dataset.target, el);
    });
  });

  document.querySelectorAll("[data-home-link]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goTo("home", el);
    });
  });

  document.querySelectorAll("[data-back]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goTo("home", el);
    });
  });

  document.querySelectorAll("[data-back-to]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(el.dataset.backTo, el);
    });
  });

  // ---- browser back/forward support ----
  window.addEventListener("popstate", (e) => {
    const key = (e.state && e.state.screen) || "home";
    if (key !== current) goTo(key, null);
  });

  // ---- restore initial state from hash, if present ----
  const initialHash = window.location.hash.replace("#", "");
  if (
    initialHash &&
    screenMap[initialHash] &&
    screenMap[initialHash] !== screenMap.home
  ) {
    screenMap.home.classList.remove("is-active");
    screenMap.home.style.display = "none";
    screenMap[initialHash].classList.add("is-active");
    current = initialHash;
  }

  // ---- keyboard: Escape goes back to home from any subpage ----
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && current !== "home") {
      goTo("home", null);
    }
  });
})();
