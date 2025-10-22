// ----------------------------------------------
// Localization Messages
// ----------------------------------------------
import en from "@/../public/i18n/en.messages.json";
import ua from "@/../public/i18n/ua.messages.json";
import ro from "@/../public/i18n/ro.messages.json";
import is from "@/../public/i18n/is.messages.json";

type Locale = "en" | "ua" | "ro" | "is";

const messages_localizations: Record<Locale, typeof en> = {
  en,
  ua,
  ro,
  is,
};
let current_language = "en";

// ----------------------------------------------
// Interfaces
// ----------------------------------------------
interface FormData {
  email: string;
  message: string;
}

interface FormElements {
  form: HTMLFormElement;
  email_input: HTMLInputElement;
  message_textarea: HTMLTextAreaElement;
  submit_button: HTMLButtonElement;
  submit_text: HTMLSpanElement;
  submit_icon: HTMLSpanElement;
  email_error: HTMLSpanElement;
  message_error: HTMLSpanElement;
  form_status: HTMLDivElement;
}

// ----------------------------------------------
// Variables
// ----------------------------------------------
const formspree_endpoint = "https://formspree.io/f/xeolqydk";
let form_elements: FormElements;
let is_submitting = false;

// ----------------------------------------------
// Helper Functions
// ----------------------------------------------
function get_current_language(): string {
  return localStorage.getItem("language") || "en";
}

function get_message(key: string): string {
  current_language = get_current_language();
  const messages = messages_localizations[current_language] || messages_localizations["en"];
  return messages[key] || messages_localizations["en"][key] || key;
}

function update_text_content(element: HTMLElement, message_key: string): void {
  element.textContent = get_message(message_key);
}

function update_form_language(): void {
  if (!form_elements) return;

  update_text_content(form_elements.submit_text, "send_message");

  clear_error("email");
  clear_error("message");
  form_elements.form_status.classList.remove("show");
}

// ----------------------------------------------
// Form Functions
// ----------------------------------------------
function get_form_elements(): FormElements {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  const email_input = document.getElementById("email") as HTMLInputElement;
  const message_textarea = document.getElementById("message") as HTMLTextAreaElement;
  const submit_button = form.querySelector(".contact__submit") as HTMLButtonElement;
  const submit_text = form.querySelector(".contact__submit-text") as HTMLSpanElement;
  const submit_icon = form.querySelector(".contact__submit-icon") as HTMLSpanElement;
  const email_error = document.getElementById("email-error") as HTMLSpanElement;
  const message_error = document.getElementById("message-error") as HTMLSpanElement;
  const form_status = document.getElementById("form-status") as HTMLDivElement;

  if (
    !form ||
    !email_input ||
    !message_textarea ||
    !submit_button ||
    !submit_text ||
    !submit_icon ||
    !email_error ||
    !message_error ||
    !form_status
  ) {
    throw new Error("Contact form elements not found");
  }

  return {
    form,
    email_input,
    message_textarea,
    submit_button,
    submit_text,
    submit_icon,
    email_error,
    message_error,
    form_status,
  };
}

function show_error(field: "email" | "message", message_key: string): void {
  const error_element = field === "email" ? form_elements.email_error : form_elements.message_error;
  const input_element = field === "email" ? form_elements.email_input : form_elements.message_textarea;

  update_text_content(error_element, message_key);
  error_element.classList.add("show");
  input_element.setAttribute("aria-invalid", "true");
}

function clear_error(field: "email" | "message"): void {
  const error_element = field === "email" ? form_elements.email_error : form_elements.message_error;
  const input_element = field === "email" ? form_elements.email_input : form_elements.message_textarea;

  error_element.textContent = "";
  error_element.classList.remove("show");
  input_element.removeAttribute("aria-invalid");
}

function show_status(message_key: string, type: "success" | "error"): void {
  update_text_content(form_elements.form_status, message_key);
  form_elements.form_status.className = `contact__status show ${type}`;

  setTimeout(() => {
    form_elements.form_status.classList.remove("show");
  }, 5000);
}

function set_loading_state(loading: boolean): void {
  if (loading) {
    form_elements.form.classList.add("contact__form--loading");
    form_elements.submit_button.disabled = true;
    update_text_content(form_elements.submit_text, "sending");
  } else {
    form_elements.form.classList.remove("contact__form--loading");
    form_elements.submit_button.disabled = false;
    update_text_content(form_elements.submit_text, "send_message");
  }
}

async function submit_form(form_data: FormData): Promise<boolean> {
  try {
    const response = await fetch(formspree_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form_data.email,
        message: form_data.message,
        _replyto: form_data.email,
        _subject: "Contact Form Submission",
      }),
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return false;
  }
}

async function handle_submit(event: Event): Promise<void> {
  event.preventDefault();
  if (is_submitting) return;

  form_elements.form_status.classList.remove("show");

  const is_email_valid = validate_email();
  const is_message_valid = validate_message();

  if (!is_email_valid || !is_message_valid) {
    show_status("fix_errors", "error");
    return;
  }

  is_submitting = true;
  set_loading_state(true);

  const form_data: FormData = {
    email: form_elements.email_input.value.trim(),
    message: form_elements.message_textarea.value.trim(),
  };

  try {
    const success = await submit_form(form_data);

    if (success) {
      show_status("success", "success");
      form_elements.form.reset();
      clear_error("email");
      clear_error("message");
    } else {
      show_status("failed", "error");
    }
  } catch (error) {
    console.error("Submission error:", error);
    show_status("error", "error");
  } finally {
    is_submitting = false;
    set_loading_state(false);
  }
}

function setup_form_validation(): void {
  form_elements.form.addEventListener("submit", handle_submit);
  form_elements.email_input.addEventListener("blur", validate_email);
  form_elements.message_textarea.addEventListener("blur", validate_message);
  form_elements.email_input.addEventListener("input", () => clear_error("email"));
  form_elements.message_textarea.addEventListener("input", () => clear_error("message"));
}

// ----------------------------------------------
// Validation Functions
// ----------------------------------------------
function validate_email(): boolean {
  const email = form_elements.email_input.value.trim();
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    show_error("email", "email_required");
    return false;
  }

  if (!email_regex.test(email)) {
    show_error("email", "email_invalid");
    return false;
  }

  clear_error("email");
  return true;
}

function validate_message(): boolean {
  const message = form_elements.message_textarea.value.trim();

  if (!message) {
    show_error("message", "message_required");
    return false;
  }

  if (message.length < 10) {
    show_error("message", "message_too_short");
    return false;
  }

  if (message.length > 1000) {
    show_error("message", "message_too_long");
    return false;
  }

  clear_error("message");
  return true;
}

// ----------------------------------------------
// Export Function
// ----------------------------------------------
export function init_contact_form(): void {
  const init_form_fn = () => {
    const contact_section = document.querySelector("#contact");
    const form_exists = document.querySelector("#contact-form");

    if (contact_section && form_exists) {
      try {
        form_elements = get_form_elements();
        update_text_content(form_elements.submit_text, "send_message");
        setup_form_validation();

        document.addEventListener("language-changed", update_form_language);
      } catch (error) {
        console.error("Failed to initialize contact form:", error);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init_form_fn);
  } else {
    init_form_fn();
  }
}
