import { BaseAnimator } from "@utils/abstract_classes.ts";

export class ExperienceAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".experience__list");
  }

  protected add_styles(): void {
    // Hide experience cards
    document.querySelectorAll(".experience__list .card").forEach((card) => {
      const element = card as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(60px)";
      element.style.transition = "all 0.8s ease";
    });

    // Hide tech stack tags
    document.querySelectorAll(".experience__list .tech-stack__tag").forEach((tag) => {
      const element = tag as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "scale(0.8)";
      element.style.transition = "all 0.4s ease";
    });

    // Hide experience periods
    document.querySelectorAll(".experience__list .experience__period").forEach((period) => {
      const element = period as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "scale(0.8)";
      element.style.transition = "all 0.4s ease";
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
    this.animate_elements(".experience__list .card", 0, 250, "1", "translateY(0)", 800);
    this.animate_elements(".experience__list .experience__period", 150, 250, "1", "scale(1)", 400);
    this.animate_elements(".experience__list .tech-stack__tag", 300, 40, "1", "scale(1)", 400);
  }
}
