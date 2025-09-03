import "@styles/pages/index.scss";

import "@pages/sections/hero.ts";
import "@pages/sections/experience.ts";
import "@pages/sections/skills.ts";
import "@pages/sections/portfolio.ts";
import "@pages/sections/blog.ts";
import "@pages/sections/contact.ts";

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
