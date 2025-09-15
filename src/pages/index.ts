import "@styles/pages/index.scss";

import { handle_cv } from "@utils/handle_cv.ts";
import { init_translations } from "@utils/translation.ts";
import { init_mobile_menu } from "@utils/mobile_menu.ts";

import "@pages/sections/hero.ts";

import { hero } from "@pages/sections/hero.ts";
import { init_hero_animations } from "@pages/sections/hero_animations.ts";
import { init_experience_animations } from "@pages/sections/experience.ts";
import { init_skills_animations } from "@pages/sections/skills.ts";
import { init_portfolio_animations, init_portfolio_filter } from "@pages/sections/portfolio.ts";
import { init_blog_animations } from "@pages/sections/blog.ts";
import { init_contact_form } from "@pages/sections/contact.ts";
import { init_contact_animations } from "@pages/sections/contact_animations.ts";

import { MOBILE_MAX_WIDTH } from "@/constants.ts";

document.addEventListener("DOMContentLoaded", () => {
  hero.init();

  // ----------------------------------------------
  // Animations
  // ----------------------------------------------
  init_hero_animations();
  init_experience_animations();
  init_skills_animations();
  init_portfolio_animations();
  init_blog_animations();
  init_contact_animations();

  // ----------------------------------------------
  // Download and open CV
  // ----------------------------------------------
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
  // Smooth scroll for navigation
  // ----------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target_id = this.getAttribute("href");
      const target_el = document.querySelector(target_id);

      if (target_el) {
        const header_height = document.querySelector(".header").offsetHeight;
        let target_pos = target_el.getBoundingClientRect().top + window.scrollY - header_height;

        window.scrollTo({
          top: target_pos,
          behavior: "smooth",
        });
      }
    });
  });

  // ----------------------------------------------
  // Misc
  // ----------------------------------------------
  init_contact_form();
  init_portfolio_filter();
});

// ----------------------------------------------
// Translations
// ----------------------------------------------
const i18n = init_translations({
  languages: ["en", "ua", "ro"],
  default_lang: "en",
  button_ids: ["language-toggle", "mobile-language-toggle"],
  display_ids: ["current-lang", "mobile-current-lang"],
});

const logo = document.querySelector(".logo");

if (logo) {
  logo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ----------------------------------------------
// Mobile (burger) menu
// ----------------------------------------------
init_mobile_menu({
  menu_btn_id: "mobile-menu-btn",
  mobile_menu_id: "mobile-menu",
  nav_link_selector: ".mobile-nav-link",
  breakpoint: MOBILE_MAX_WIDTH,
});
