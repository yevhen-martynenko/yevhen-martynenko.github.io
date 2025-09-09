import { BaseAnimator } from "@utils/abstract_classes.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

class ContactFormAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".contact__form");
  }

  protected add_styles(): void {
    // Hide form
    const form_wrapper = this.target as HTMLElement;
    form_wrapper.style.opacity = "0";
    form_wrapper.style.transform = "translateY(4rem)";
    if (!form_wrapper.style.transition && !getComputedStyle(form_wrapper).transition.includes("all")) {
      form_wrapper.style.transition = "all 0.75s ease";
    }
  }

  protected setup_animations(): void {
    this.observer = new IntersectionObserver((entries) => this.handle_intersection(entries), { threshold: 0.2 });
    if (this.target) {
      this.observer.observe(this.target);
    }
  }

  private handle_intersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !this.animated) {
        this.animated = true;
        this.trigger_animation();
      }
    });
  }

  private trigger_animation(): void {
    this.animate_element(".contact__form", 100, "1", "translateY(0)", 750);
  }
}

class SocialLinksAnimator extends BaseAnimator {
  private animated = false;
  private is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

  constructor() {
    super(".contact__socials");
  }

  protected add_styles(): void {
    this.is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

    // Hide all social links
    document.querySelectorAll(".contact__social").forEach((social) => {
      const element = social as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(2rem)" : "translateX(2rem)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.5s ease";
      }
    });
  }

  protected setup_animations(): void {
    this.observer = new IntersectionObserver((entries) => this.handle_intersection(entries), { threshold: 0.2 });
    if (this.target) {
      this.observer.observe(this.target);
    }
  }

  private handle_intersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !this.animated) {
        this.animated = true;
        this.trigger_animations();
      }
    });
  }

  private trigger_animations(): void {
    this.animate_elements(".contact__social", 300, 100, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 500);
  }
}

// Animations initialization
let form_animator: ContactFormAnimator | null = null;
let social_animator: SocialLinksAnimator | null = null;

export function init_contact_animations(): void {
  try {
    const form_element = document.querySelector(".contact__form");
    if (form_element) {
      form_animator = new ContactFormAnimator();
    }

    const social_elements = document.querySelectorAll(".contact__socials");
    if (social_elements.length > 0) {
      social_animator = new SocialLinksAnimator();
    }
  } catch (error) {
    console.warn("Contact animations initialization failed:", error);
  }
}

export function destroy_contact_animations(): void {
  form_animator?.destroy();
  social_animator?.destroy();
  form_animator = null;
  social_animator = null;
}
