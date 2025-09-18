import { BaseAnimator } from "@utils/abstract_classes.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

export class HeroAnimator extends BaseAnimator {
  private animated = false;
  private is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

  constructor() {
    super("#hero");
  }

  protected add_styles(): void {
    this.is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

    // Hide hero status
    const status = document.querySelector(".hero__status");
    if (status) {
      const element = status as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(-1.5rem)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero title
    const title = document.querySelector(".hero__title");
    if (title) {
      const element = title as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(-2.5rem)" : "translateX(-2.5rem)";
      element.style.transition = "all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide hero subtitle
    const subtitle = document.querySelector(".hero__subtitle");
    if (subtitle) {
      const element = subtitle as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(-1.75rem)" : "translateX(-2.5rem)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero description
    const description = document.querySelector(".hero__description");
    if (description) {
      const element = description as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(2rem)" : "translateX(-3.5rem)";
      element.style.transition = "all 0.6s ease";
    }

    // Hide hero actions
    const actions = document.querySelector(".hero__actions");
    if (actions) {
      const element = actions as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(2rem)";
      element.style.transition = "all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide social links
    document.querySelectorAll(".hero__social-link, .hero__location").forEach((social) => {
      const element = social as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(2rem)";
      element.style.transition = "all 0.4s ease";
    });

    // Hide code terminal
    const terminal = document.querySelector(".terminal");
    if (terminal) {
      const element = terminal as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(3rem)" : "translateX(5rem)";
      element.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    }

    // Hide scroll indicator
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      const element = scrollIndicator as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(1.5rem)";
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
    this.animate_element(".hero__title", 400, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 700);
    this.animate_element(".hero__subtitle", 600, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 600);
    this.animate_element(".hero__description", 800, "1", "translateY(0)", 600);
    this.animate_element(".hero__actions", 1000, "1", "translateY(0)", 700);
    this.animate_element(".terminal", 600, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 800);
    this.animate_element(".scroll-indicator", 1600, "1", "translateY(0)", 600);
    this.animate_elements(".hero__social-link, .hero__location", 1200, 80, "1", "translateY(0)", 500);
  }
}

// Animations initialization
let hero_animator: HeroAnimator | null = null;

export function init_hero_animations(): void {
  try {
    const hero_element = document.querySelector(".hero");
    if (hero_element) {
      hero_animator = new HeroAnimator();
    }
  } catch (error) {
    console.warn("Hero animations initialization failed:", error);
  }
}

export function destroy_hero_animations(): void {
  hero_animator?.destroy();
  hero_animator = null;
}
