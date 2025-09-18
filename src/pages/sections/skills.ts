import { BaseAnimator } from "@utils/abstract_classes.ts";
import { MOBILE_MAX_WIDTH } from "@/constants.ts";

class SkillsListAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".skills__list");
  }

  protected add_styles(): void {
    // Hide skills
    document.querySelectorAll(".skills__list .skill").forEach((skill) => {
      const element = skill as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(2.5rem)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.5s ease";
      }
    });
  }

  protected setup_animations(): void {
    this.observer = new IntersectionObserver((entries) => this.handle_intersection(entries), { threshold: 0.2 });

    const skills_list = document.querySelector(".skills__list");
    if (skills_list) {
      this.observer.observe(skills_list);
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
    this.animate_skills_snake();
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

class SkillsBadgesAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super(".skill__tags");
  }

  protected add_styles(): void {
    // Hide badges
    document.querySelectorAll('.skill__tags [class*="badge--"]').forEach((badge) => {
      const element = badge as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(2rem)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.3s ease";
      }
    });
  }

  protected setup_animations(): void {
    this.observer = new IntersectionObserver((entries) => this.handle_intersection(entries), { threshold: 0.2 });

    const skill_tags = document.querySelector(".skill__tags");
    if (skill_tags) {
      this.observer.observe(skill_tags);
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
    this.animate_elements('.skill__tags [class*="badge--"]', 200, 75, "1", "translateY(0)", 300);
  }
}

class LanguagesAnimator extends BaseAnimator {
  private animated = false;
  private is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

  constructor() {
    super(".languages__list");
  }

  protected add_styles(): void {
    this.is_mobile = window.innerWidth <= MOBILE_MAX_WIDTH;

    // Hide languages
    document.querySelectorAll(".language").forEach((language) => {
      const element = language as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = this.is_mobile ? "translateY(3rem)" : "translateX(3rem)";
      if (!element.style.transition && !getComputedStyle(element).transition.includes("all")) {
        element.style.transition = "all 0.6s ease";
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
        this.trigger_animation();
      }
    });
  }

  private trigger_animation(): void {
    this.animate_elements(".language", 200, 150, "1", this.is_mobile ? "translateY(0)" : "translateX(0)", 750);
  }
}

// Animations initialization
let skills_animator: SkillsListAnimator | null = null;
let badges_animator: SkillsBadgesAnimator | null = null;
let languages_animator: LanguagesAnimator | null = null;

export function init_skills_animations(): void {
  try {
    const skills_list = document.querySelector(".skills__list");
    if (skills_list) {
      skills_animator = new SkillsListAnimator();
    }

    const skill_tags = document.querySelector(".skill__tags");
    if (skill_tags) {
      badges_animator = new SkillsBadgesAnimator();
    }

    const languages = document.querySelector(".languages__list");
    if (languages) {
      languages_animator = new LanguagesAnimator();
    }
  } catch (error) {
    console.warn("Skills animations initialization failed:", error);
  }
}

export function destroy_skills_animations(): void {
  skills_animator?.destroy();
  badges_animator?.destroy();
  languages_animator?.destroy();
  skills_animator = null;
  badges_animator = null;
  languages_animator = null;
}
