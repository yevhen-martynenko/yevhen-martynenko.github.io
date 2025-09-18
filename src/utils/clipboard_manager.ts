import { show_message } from "@utils/messages.ts";

export const clipboard_manager = {
  init(): void {
    document.querySelectorAll(".copyable").forEach((el) => {
      el.addEventListener("click", () => {
        const copy_text = el.getAttribute("data-copy");
        if (!copy_text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copy_text).then(() => {
            el.classList.add("copied");
            setTimeout(() => el.classList.remove("copied"), 1500);
            show_message(`"${copy_text}" copied to clipboard`, "success");
          });
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = copy_text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            show_message(`"${copy_text}" copied to clipboard`, "success");
          } catch {
            show_message("Failed to copy text", "error");
          }
          document.body.removeChild(textarea);
        }
      });
    });
  },
};
