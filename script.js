(() => {
  const story = document.querySelector(".story");
  const modal = document.getElementById("terms-modal");
  const openBtn = document.getElementById("open-terms");
  const closeBtn = document.getElementById("close-terms");

  if (!modal || !openBtn || !closeBtn) return;

  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let lastFocus = null;

  const openModal = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    // Force reflow so fade-in transition runs
    void modal.offsetWidth;
    modal.classList.add("is-open");
    story?.classList.add("is-modal-open");
    openBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    story?.classList.remove("is-modal-open");
    openBtn.setAttribute("aria-expanded", "false");

    const onEnd = (event) => {
      if (event.target !== modal) return;
      modal.hidden = true;
      modal.removeEventListener("transitionend", onEnd);
      lastFocus?.focus?.();
    };

    modal.addEventListener("transitionend", onEnd);
  };

  openBtn.setAttribute("aria-expanded", "false");
  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-terms]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = [...modal.querySelectorAll(focusableSelector)].filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
