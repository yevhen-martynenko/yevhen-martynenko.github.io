import { show_message } from "@utils/messages.ts";

export const terminal_manager = {
  init(): void {
    const close_btn = document.getElementsByClassName("terminal__dot--red")[0] as HTMLElement;
    const minimize_btn = document.getElementsByClassName("terminal__dot--yellow")[0] as HTMLElement;
    const maximize_btn = document.getElementsByClassName("terminal__dot--green")[0] as HTMLElement;

    if (close_btn) {
      close_btn.addEventListener("click", () => show_message("nuh uh", "error"));
    }
  },
};
