import { BaseAnimator } from "@utils/abstract_classes.ts";

export class PortfolioAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super("#portfolio");
  }

  protected add_styles(): void {
    // Hide portfolio cards
    document.querySelectorAll(".project").forEach((card) => {
      const element = card as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(5rem)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      }
    });

    // Hide filter buttons
    document.querySelectorAll(".filter-btn").forEach((button) => {
      const element = button as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(-1.5rem)";
      element.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
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
    this.animate_elements(".filter-btn", 0, 100, "1", "translateY(0)", 600);
    this.animate_elements(".project", 200, 100, "1", "translateY(0)", 600);
  }
}

// Animations initialization
let portfolio_animator: PortfolioAnimator | null = null;

export function init_portfolio_animations(): void {
  try {
    const portfolio_element = document.querySelector("#portfolio");
    if (portfolio_element) {
      portfolio_animator = new PortfolioAnimator();
    }
  } catch (error) {
    console.warn("Portfolio animations initialization failed:", error);
  }
}

export function destroy_portfolio_animations(): void {
  portfolio_animator?.destroy();
  portfolio_animator = null;
}
