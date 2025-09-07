import { BaseAnimator } from "@utils/abstract_classes.ts";

export class HeroAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super("#hero");
  }

  protected add_styles(): void {
    // Hide hero status
    const status = document.querySelector(".hero__status");
    if (status) {
      const element = status as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(-20px)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero title
    const title = document.querySelector(".hero__title");
    if (title) {
      const element = title as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateX(-30px)";
      element.style.transition = "all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide hero subtitle
    const subtitle = document.querySelector(".hero__subtitle");
    if (subtitle) {
      const element = subtitle as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateX(-35px)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero description
    const description = document.querySelector(".hero__description");
    if (description) {
      const element = description as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateX(-50px)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero actions
    const actions = document.querySelector(".hero__actions");
    if (actions) {
      const element = actions as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide social links
    document.querySelectorAll(".hero__social-link, .hero__location").forEach((social) => {
      const element = social as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "all 0.4s ease";
    });

    // Hide code terminal
    const terminal = document.querySelector(".terminal");
    if (terminal) {
      const element = terminal as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateX(60px)";
      element.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide scroll indicator
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      const element = scrollIndicator as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "all 0.5s ease";
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
        this.trigger_animations();
      }
    });
  }

  private trigger_animations(): void {
    this.animate_element(".hero__status", 200, "1", "translateY(0)", 600);
    this.animate_element(".hero__title", 400, "1", "translateX(0)", 700);
    this.animate_element(".hero__subtitle", 600, "1", "translateX(0)", 600);
    this.animate_element(".hero__description", 800, "1", "translateY(0)", 600);
    this.animate_element(".hero__actions", 1000, "1", "translateY(0)", 700);
    this.animate_element(".terminal", 600, "1", "translateX(0)", 800);
    this.animate_element(".scroll-indicator", 1600, "1", "translateY(0)", 600);

    this.animate_elements(".hero__social-link, .hero__location", 1200, 80, "1", "translateY(0)", 500);
  }
}
