import { clipboard_manager } from "@utils/clipboard_manager.ts";
import { start_typewriter } from "@utils/typewriter.ts";
import { run_typewriters, typewriter_sequences, typewriter_strings } from "@pages/sections/hero.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

// let typewriter_has_run = false;
let typewriter_has_run = true;

async function run_modal_typewriters(container: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, 0));

  const comment_el = container.querySelector(".code__comment.typewrite-cbe") as HTMLElement | null;
  const comment_el_2 = container.querySelector(".code__comment.typewrite-dcb") as HTMLElement | null;

  if (!comment_el || !comment_el_2) {
    console.error("Required elements not found in modal container");
    return;
  }

  const current_lang = localStorage.getItem("language") || "en";
  const sequences = typewriter_sequences[current_lang] || typewriter_sequences["en"];

  if (typewriter_has_run) {
    const final_text_1 = typewriter_strings[current_lang]?.contact_comment || typewriter_strings["en"].contact_comment;
    const final_text_2 = typewriter_strings[current_lang]?.copy_comment || typewriter_strings["en"].copy_comment;

    comment_el.textContent = `// ${final_text_1}`;
    comment_el_2.innerHTML = `// ${final_text_2}<span class="cursor" style="animation: 1.5s steps(1) 0s infinite normal none running blink;">|</span>`;
    return;
  }

  typewriter_has_run = true;

  // await start_typewriter(comment_el, sequences.contact_comment, { cursor: false });
  // await start_typewriter(comment_el_2, sequences.copy_comment, { cursor: true });
}

document.addEventListener("DOMContentLoaded", function () {
  const show_code_btn = document.querySelector(".show-code-btn") as HTMLElement;
  const existing_code = document.querySelector(".code") as HTMLElement;
  const body = document.body;

  if (!show_code_btn || !existing_code) return;

  let modal_overlay: HTMLElement | null = null;
  let modal_created = false;
  let clipboard_initialized = false;

  function create_modal() {
    if (modal_created) return;

    // Create modal overlay
    modal_overlay = document.createElement("div");
    modal_overlay.className = "modal__overlay";

    // Create modal content wrapper
    const modal_content = document.createElement("div");
    modal_content.className = "modal__content";

    const code_clone = existing_code.cloneNode(true) as HTMLElement;

    const terminal_header = code_clone.querySelector(".terminal__header") as HTMLElement;
    if (terminal_header) {
      const red_dot = code_clone.querySelector(".terminal__dot--red") as HTMLElement;
      if (red_dot) {
        red_dot.style.position = "relative";

        const red_dot_overlay = document.createElement("div");
        red_dot_overlay.className = "terminal__dot-overlay";
        red_dot_overlay.setAttribute("aria-label", "Close modal");
        red_dot_overlay.addEventListener("click", hide_modal);

        red_dot.appendChild(red_dot_overlay);
        red_dot.addEventListener("click", hide_modal);
      }
    }

    modal_content.appendChild(code_clone);
    modal_overlay.appendChild(modal_content);
    body.appendChild(modal_overlay);

    modal_overlay.addEventListener("click", function (e) {
      if (e.target === modal_overlay) {
        hide_modal();
      }
    });

    modal_content.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    modal_created = true;
  }

  function show_modal() {
    if (!modal_created) create_modal();
    if (!modal_overlay) return;

    modal_overlay.classList.add("active");
    body.classList.add("modal--open");

    if (!clipboard_initialized) {
      clipboard_manager.init();
      clipboard_initialized = true;
    }

    const modal_content = modal_overlay.querySelector(".modal__content") as HTMLElement;
    if (modal_content) {
      setTimeout(() => {
        run_modal_typewriters(modal_content);
      }, 100);
    }
  }

  function hide_modal() {
    if (!modal_overlay) return;

    modal_overlay.classList.remove("active");
    body.classList.remove("modal--open");

    if (show_code_btn) {
      show_code_btn.focus();
    }
  }

  show_code_btn.addEventListener("click", function (e) {
    e.preventDefault();
    show_modal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal_overlay && modal_overlay.classList.contains("active")) {
      hide_modal();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > MOBILE_MAX_WIDTH && modal_overlay && modal_overlay.classList.contains("active")) {
      hide_modal();
    }
  });
});
