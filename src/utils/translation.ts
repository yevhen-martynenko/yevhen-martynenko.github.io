// interfaces
export interface translation_data {
  [key: string]: any;
}
export interface translation_options {
  languages: string[];
  default_lang?: string;
  button_ids: string[];
  display_ids: string[];
}

// main function
export function init_translations(options: translation_options) {
  const { languages, default_lang = "en", button_ids, display_ids } = options;
  let current_lang = localStorage.getItem("language") || default_lang;
  const translations: { [lang: string]: translation_data } = {};

  async function load_translations(lang: string): Promise<void> {
    try {
      const response = await fetch(`i18n/${lang}.json`);
      if (response.ok) {
        translations[lang] = await response.json();
        console.log(`Loaded ${lang} translations`, translations[lang]);
      } else {
        console.warn(`Failed to load ${lang}.json: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading ${lang}.json:`, error);
    }
  }

  function update_display() {
    display_ids.forEach((id) => {
      const span = document.getElementById(id);
      if (span) {
        const lang_map: Record<string, string> = {
          en: "EN",
          ua: "UA",
          es: "ES",
          ro: "RO",
        };
        span.textContent = lang_map[current_lang] || current_lang.toUpperCase();
      }
    });
  }

  function getNested(obj: any, key: string): any {
    return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  async function set_language(lang: string) {
    if (!translations[lang]) {
      await load_translations(lang);
    }
    current_lang = lang;
    localStorage.setItem("language", current_lang);
    update_display();
    translate_page();
  }

  function translate_page() {
    const elements = document.querySelectorAll("[data-translate]");
    const current_translations = translations[current_lang] || {};

    elements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      const value = key ? getNested(current_translations, key) : null;

      if (value) {
        if (element instanceof HTMLInputElement && element.type !== "button" && element.type !== "submit") {
          element.placeholder = value;
        } else {
          element.textContent = value;
        }
      }
    });
  }

  function setup_language_buttons() {
    button_ids.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", async () => {
          const current_index = languages.indexOf(current_lang);
          const next_index = (current_index + 1) % languages.length;
          await set_language(languages[next_index]);
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await set_language(current_lang);
    setup_language_buttons();
  });

  return {
    get current_language() {
      return current_lang;
    },
    get translations() {
      return translations[current_lang] || {};
    },
    set_language,
  };
}
