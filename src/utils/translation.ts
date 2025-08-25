// interfaces
export interface translation_data {
  [key: string]: any;
}
export interface translation_options {
  languages: string[];
  default_lang?: string;
  button_id: string;
  display_id: string;
}

// main function
export function init_translations(options: translation_options) {
  const { languages, default_lang = "en", button_id, display_id } = options;

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
    const current_lang_span = document.getElementById(display_id);
    if (current_lang_span) {
      const lang_map: Record<string, string> = {
        en: "EN",
        ua: "UA",
        es: "ES",
        ro: "RO",
      };
      current_lang_span.textContent = lang_map[current_lang] || current_lang.toUpperCase();
    }
  }

  async function set_language(lang: string) {
    if (!translations[lang]) {
      await load_translations(lang);
    }
    current_lang = lang;
    localStorage.setItem("language", current_lang);
    update_display();
  }

  function setup_language_button() {
    const language_toggle = document.getElementById(button_id);
    if (language_toggle) {
      language_toggle.addEventListener("click", async () => {
        const current_index = languages.indexOf(current_lang);
        const next_index = (current_index + 1) % languages.length;
        await set_language(languages[next_index]);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await set_language(current_lang);
    setup_language_button();
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
