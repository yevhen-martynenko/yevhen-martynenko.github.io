import { BaseAnimator } from "@utils/abstract_classes.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

class ExperienceAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".experience__list");
  }

  protected add_styles(): void {
    // Hide experience cards
    document.querySelectorAll(".experience__list .card").forEach((card) => {
      const element = card as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(5rem)";
      element.style.transition = "all 0.8s ease";
    });

    // Hide tech stack tags
    document.querySelectorAll(".experience__list .tech-stack__tag").forEach((tag) => {
      const element = tag as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "scale(0.75)";
      element.style.transition = "all 0.4s ease";
    });

    // Hide experience periods
    document.querySelectorAll(".experience__list .experience__period").forEach((period) => {
      const element = period as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "scale(0.75)";
      element.style.transition = "all 0.6s ease";
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
    this.animate_elements(".experience__list .card", 0, 250, "1", "translateY(0)", 800);
    this.animate_elements(".experience__list .experience__period", 150, 250, "1", "scale(1)", 400);
    this.animate_elements(".experience__list .tech-stack__tag", 300, 80, "1", "scale(1)", 400);
  }
}

class EducationAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".education");
  }

  protected add_styles(): void {
    // Hide education cards
    document.querySelectorAll(".education .card").forEach((card) => {
      const element = card as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(5rem)";
      element.style.transition = "all 0.8s ease";
    });

    // Hide education periods
    document.querySelectorAll(".education .education__period").forEach((period) => {
      const element = period as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "scale(0.75)";
      element.style.transition = "all 0.4s ease";
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
    this.animate_elements(".education .card", 0, 250, "1", "translateY(0)", 800);
    this.animate_elements(".education .education__period", 150, 250, "1", "scale(1)", 400);
  }
}

// Animations initialization
let experience_animator: ExperienceAnimator | null = null;
let education_animator: EducationAnimator | null = null;

export function init_experience_animations(): void {
  try {
    const experience_element = document.querySelector(".experience__list");
    if (experience_element) {
      experience_animator = new ExperienceAnimator();
    }

    const education_element = document.querySelector(".education");
    if (education_element) {
      education_animator = new EducationAnimator();
    }
  } catch (error) {
    console.warn("Experience animations initialization failed:", error);
  }
}

export function destroy_experience_animations(): void {
  experience_animator?.destroy();
  education_animator?.destroy();
  experience_animator = null;
  education_animator = null;
}
