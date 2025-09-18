export const scroll_manager = {
  init(): void {
    if (window.scrollY > 0) {
      const indicator = document.querySelector(".scroll-indicator");
      if (indicator) {
        indicator.style.transition = "none";
        indicator.classList.add("hidden");
        indicator.offsetHeight;
        indicator.style.transition = "";
      }
    }

    window.addEventListener("scroll", () => {
      document.querySelector(".scroll-indicator")?.classList.add("hidden");
    });
  },

  setup_scroll_animations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animate_els = document.querySelectorAll(
      ".hero__status, .hero__title, .hero__subtitle, .hero__description, .hero__actions, .hero__social, .terminal"
    );

    animate_els.forEach((el) => observer.observe(el));
  },
};
