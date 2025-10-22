import { initialize_cv_buttons } from "@utils/download_cv_button.ts";
import { matrix } from "@utils/matrix.ts";
import { start_typewriter } from "@utils/typewriter.ts";
import { terminal_manager } from "@utils/terminal_manager.ts";
import { clipboard_manager } from "@utils/clipboard_manager.ts";
import { scroll_manager } from "@utils/scroll_manager.ts";
import { animate_button_icon } from "@utils/button_animations.ts";
import "@utils/code_toggle.ts";

import { MOBILE_MAX_WIDTH } from "@/constants.ts";

// ----------------------------------------------
// Typewriters
// ----------------------------------------------
interface TypewriterSequences {
  [key: string]: {
    contact_comment: Action[];
    copy_comment: Action[];
  };
}

export const typewriter_strings = {
  en: {
    contact_comment: "Ways to get in touch with me",
    copy_comment: "Click to copy any of the details",
  },
  ua: {
    contact_comment: "Способи зв'язку зі мною",
    copy_comment: "Натисніть щоб скопіювати деталі",
  },
  is: {
    contact_comment: "Hlæða til að hafa samband með mig",
    copy_comment: "Klikkja hafa samband með mig",
  },
  ro: {
    contact_comment: "Modalitî de a mă contacta",
    copy_comment: "Apăsați pentru a coipa detaliile",
  },
};

export const typewriter_sequences: TypewriterSequences = {
  en: {
    contact_comment: [
      { action: "type", value: "Ways t oge" },
      { action: "backspace", count: 4 },
      { action: "type", value: "o get in touch with me" },
    ],
    copy_comment: [
      { action: "type", value: "Click to ocpy " },
      { action: "backspace", count: 5 },
      { action: "type", value: "copy any of the details" },
    ],
  },
  ua: {
    contact_comment: [
      { action: "type", value: "Способи зв'яз" },
      { action: "backspace", count: 2 },
      { action: "type", value: "язку зі мною" },
    ],
    copy_comment: [
      { action: "type", value: "Натисніть щоб скопі" },
      { action: "backspace", count: 4 },
      { action: "type", value: "копіювати деталі" },
    ],
  },
  is: {
    contact_comment: [
      { action: "type", value: "Hlæða til að gafa" },
      { action: "backspace", count: 4 },
      { action: "type", value: "hafa samband með mig" },
    ],
    copy_comment: [
      { action: "type", value: "Klikkja hafa sambnda" },
      { action: "backspace", count: 3 },
      { action: "type", value: "and með mig" },
    ]
  },
  ro: {
    contact_comment: [
      { action: "type", value: "Modalitî" },
      { action: "backspace", count: 1 },
      { action: "type", value: "ăți de a mă contacta" },
    ],
    copy_comment: [
      { action: "type", value: "Apăsați pentru a coipa" },
      { action: "backspace", count: 3 },
      { action: "type", value: "pia detaliile" },
    ],
  },
};

async function run_typewriters() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const comment_el = document.querySelector(".code__comment.typewrite-cbe") as HTMLElement | null;
  const comment_el_2 = document.querySelector(".code__comment.typewrite-dcb") as HTMLElement | null;

  if (!comment_el || !comment_el_2) {
    console.error("Required elements not found");
    return;
  }

  const current_lang = localStorage.getItem("language") || "en";
  const sequences = typewriter_sequences[current_lang] || typewriter_sequences["en"];

  await start_typewriter(comment_el, sequences.contact_comment, { cursor: false });
  await start_typewriter(comment_el_2, sequences.copy_comment, { cursor: true });
}

// ----------------------------------------------
// Hero
// ----------------------------------------------
interface HeroElements {
  hero: HTMLElement | null;
  status_indicator: HTMLElement | null;
  buttons: NodeListOf<HTMLButtonElement | HTMLAnchorElement>;
  social_links: NodeListOf<HTMLAnchorElement>;
  location_link: HTMLAnchorElement | null;
}

class HeroSection {
  private elements: HeroElements;

  constructor() {
    this.elements = this.get_elements();
    this.init();
  }

  private get_elements(): HeroElements {
    return {
      hero: document.getElementById("hero"),
      status_indicator: document.querySelector(".hero__status-indicator"),
      buttons: document.querySelectorAll(".hero__actions .btn"),
      social_links: document.querySelectorAll(".hero__social-link"),
      location_link: document.querySelector(".hero__location"),
    };
  }

  private init(): void {
    this.setup_event_listeners();
    if (window.innerWidth > MOBILE_MAX_WIDTH) {
      run_typewriters();
    }
  }

  private setup_event_listeners(): void {
    this.elements.buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => animate_button_icon({ btn: btn }));
    });

    this.elements.social_links.forEach((link) => {
      link.addEventListener("click", (e) => this.handle_social_click(e));
    });

    if (this.elements.location_link) {
      this.elements.location_link.addEventListener("click", () => {
        console.log("Opening location in Google Maps...");
      });
    }
  }

  private handle_social_click(e: Event): void {
    const link = e.currentTarget as HTMLAnchorElement;
    if (link.href.startsWith("mailto:") || link.classList.contains("hero__location")) return;

    console.log(`Navigating to: ${link.getAttribute("href")}`);
  }
}

// ----------------------------------------------
// Hero module controller
// ----------------------------------------------
export const hero = {
  async init(): Promise<void> {
    new HeroSection();
    matrix.start_matrix("matrix-canvas");
    clipboard_manager.init();
    terminal_manager.init();
    initialize_cv_buttons();

    // Wait for layout to stabilize
    await this.wait_for_layout_stable();
    scroll_manager.init();
    scroll_manager.setup_scroll_animations();
  },

  wait_for_layout_stable(): Promise<void> {
    return new Promise((resolve) => {
      let resize_timer: number;
      let last_height = document.documentElement.scrollHeight;

      const resize_observer = new ResizeObserver(() => {
        clearTimeout(resize_timer);
        resize_timer = window.setTimeout(() => {
          const current_height = document.documentElement.scrollHeight;
          if (current_height === last_height) {
            resize_observer.disconnect();
            resolve();
          }
          last_height = current_height;
        }, 50);
      });

      resize_observer.observe(document.body);

      setTimeout(() => {
        resize_observer.disconnect();
        resolve();
      }, 1000);
    });
  },
};
