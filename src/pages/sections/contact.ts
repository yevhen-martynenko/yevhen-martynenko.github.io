import { BaseAnimator } from "@utils/abstract_classes.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

export class ContactAnimator extends BaseAnimator {
  private animated = false;
  private is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

  constructor() {
    super("#contact");
  }

  protected add_styles(): void {
    this.is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

    // Hide contact form
    const form_wrapper = document.querySelector(".contact__form");
    if (form_wrapper) {
      const element = form_wrapper as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(60px)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.75s ease";
      }
    }

    // Hide social links
    document.querySelectorAll(".contact__social").forEach((social) => {
      const element = social as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(30px)" : "translateX(30px)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.5s ease";
      }
    });
  }

  protected setup_animations(): void {
    this.observer = new IntersectionObserver(
      (entries) => this.handle_intersection(entries), 
      { threshold: 0.2 }
    );
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
    this.animate_element(".contact__form", 100, "1", "translateY(0)", 750);
    this.animate_elements(".contact__social", 300, 100, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 500);
  }
}
