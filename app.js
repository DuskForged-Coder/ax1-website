(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const meter = document.querySelector(".scroll-meter span");
  const toast = document.querySelector(".toast");

  document.querySelector("#year").textContent = String(new Date().getFullYear());

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      navigation.classList.toggle("open", open);
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
      });
    });
  }

  const installTabs = [...document.querySelectorAll("[data-install-tab]")];
  const installPanels = [...document.querySelectorAll("[data-install-panel]")];
  const selectInstallPlatform = (platform, moveFocus = false) => {
    installTabs.forEach((tab) => {
      const selected = tab.dataset.installTab === platform;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus();
    });
    installPanels.forEach((panel) => {
      panel.hidden = panel.dataset.installPanel !== platform;
    });
  };
  installTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectInstallPlatform(tab.dataset.installTab));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % installTabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + installTabs.length) % installTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = installTabs.length - 1;
      else return;
      event.preventDefault();
      selectInstallPlatform(installTabs[next].dataset.installTab, true);
    });
  });
  const detectedPlatform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  if (detectedPlatform.includes("win")) selectInstallPlatform("windows");
  else if (detectedPlatform.includes("linux")) selectInstallPlatform("linux");
  else if (detectedPlatform.includes("mac")) selectInstallPlatform("macos");

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -5% 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  let frame = 0;
  const depthItems = [...document.querySelectorAll("[data-depth]")];
  const updateScrollEffects = () => {
    frame = 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    meter?.style.setProperty("transform", `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`);
    if (reducedMotion) return;
    const viewportCenter = window.innerHeight * 0.5;
    depthItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const distance = (rect.top + rect.height * 0.5 - viewportCenter) / window.innerHeight;
      const depth = Number(item.dataset.depth) || 0;
      const shift = Math.max(-28, Math.min(28, -distance * depth * 120));
      item.style.setProperty("--scroll-shift", `${shift.toFixed(1)}px`);
    });
  };
  const queueScrollUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateScrollEffects);
  };
  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate, { passive: true });
  updateScrollEffects();

  if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  let toastTimer;
  const announceCopy = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1700);
  };
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.dataset.copy.replaceAll("&quot;", '"');
      try {
        await navigator.clipboard.writeText(command);
        announceCopy("Command copied");
      } catch {
        const field = document.createElement("textarea");
        field.value = command;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        document.execCommand("copy");
        field.remove();
        announceCopy("Command copied");
      }
    });
  });
})();
