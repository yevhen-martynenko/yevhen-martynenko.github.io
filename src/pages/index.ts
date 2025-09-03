import "@styles/pages/index.scss";

import "@pages/sections/hero.ts";
import "@pages/sections/experience.ts";
import "@pages/sections/skills.ts";
import "@pages/sections/portfolio.ts";
import "@pages/sections/blog.ts";
import "@pages/sections/contact.ts";

// ----------------------------------------------
// Download and open CV
// ----------------------------------------------
import { handle_cv } from "@utils/handle_cv.ts";

const download_handler = () => {
  handle_cv("assets/Backend_Yevhen_Martynenko_CV.pdf", {
    mode: "both",
    base_name: "Backend_Yevhen_Martynenko_CV",
  });
};

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest(".download-cv-btn");

  if (button) {
    event.preventDefault();
    event.stopPropagation();
    download_handler();
  }
});

// ----------------------------------------------
// Translations
// ----------------------------------------------
import { init_translations } from "@utils/translation.ts";

const i18n = init_translations({
  languages: ["en", "ua", "ro"],
  default_lang: "en",
  button_ids: ["language-toggle", "mobile-language-toggle"],
  display_ids: ["current-lang", "mobile-current-lang"],
});

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");

  if (logo) {
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// ----------------------------------------------
// Smooth scroll for navigation
// ----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

import "@utils/mobile_menu.ts";
