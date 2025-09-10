import { BaseAnimator } from "@utils/abstract_classes.ts";

export class SkillsAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super("#skills");
  }

  protected add_styles(): void {
    // Hide skills
    document.querySelectorAll(".skills__list .skill").forEach((skill) => {
      const element = skill as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.5s ease";
      }
    });

    // Hide badges
    document.querySelectorAll('.skill__tags [class*="badge--"]').forEach((badge) => {
      const element = badge as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
    });

    // Hide languages
    document.querySelectorAll(".language").forEach((language) => {
      const element = language as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateX(-30px)";
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
    this.animate_skills_snake();
    this.animate_elements(".language", 400, 150, "1", "translateX(0)", 750);
    this.animate_elements('.skill__tags [class*="badge--"]', 800, 75, "1", "translateY(0)", 300);
  }

  // Snake pattern animation
  private animate_skills_snake(): void {
    const skills = document.querySelectorAll(".skills__list .skill");
    const snake_order = [0, 1, 2, 5, 4, 3, 6, 7, 8];

    snake_order.forEach((skill_index, order_index) => {
      if (skills[skill_index]) {
        setTimeout(() => {
          const skill = skills[skill_index] as HTMLElement;
          skill.style.opacity = "1";
          skill.style.transform = "translateY(0)";
          this.clean_element_styles(skill, 500);
        }, order_index * 100);
      }
    });
  }
}
