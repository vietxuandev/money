/**
 * Mobile-specific fixes for PWA touch responsiveness
 * Addresses iOS Safari and mobile browser quirks
 */

export function initMobileFixes() {
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  // Fix iOS active state for touch events
  if (isIOS) {
    document.addEventListener("touchstart", () => {}, { passive: true });
  }

  // Disable pull-to-refresh on iOS PWA
  if (isIOS && isStandalone) {
    let lastTouchY = 0;
    let preventPullToRefresh = false;

    document.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) {
          return;
        }
        lastTouchY = e.touches[0].clientY;
        preventPullToRefresh = window.scrollY === 0;
      },
      { passive: false },
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;

        if (preventPullToRefresh) {
          // Prevent pull-to-refresh if scrolling down at top of page
          if (touchYDelta > 0) {
            e.preventDefault();
            return;
          }
          preventPullToRefresh = false;
        }
      },
      { passive: false },
    );
  }

  // Prevent zoom on double-tap for all buttons and interactive elements
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false },
  );

  // Add active class handling for iOS
  if (isIOS) {
    const addActiveClass = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        const button =
          target.tagName === "BUTTON" ? target : target.closest("button");
        button?.classList.add("touch-active");
      }
    };

    const removeActiveClass = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        const button =
          target.tagName === "BUTTON" ? target : target.closest("button");
        button?.classList.remove("touch-active");
      }
    };

    document.addEventListener("touchstart", addActiveClass, { passive: true });
    document.addEventListener("touchend", removeActiveClass, { passive: true });
    document.addEventListener("touchcancel", removeActiveClass, {
      passive: true,
    });
  }
}
