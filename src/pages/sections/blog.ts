import { BaseAnimator } from "@utils/abstract_classes.ts";

export class BlogAnimator extends BaseAnimator {
  private animated = false;

  constructor() {
    super("#blog");
  }

  protected add_styles(): void {
    // Hide blog cards with inline styles
    document.querySelectorAll(".blog__card").forEach((card) => {
      const element = card as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(5rem)";
      element.style.transition = "all 0.6s ease-out";
    });

    // Hide "All Posts" button
    document.querySelectorAll(".blog__btn").forEach((button) => {
      const element = button as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(5rem)";
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
    this.animate_elements(".blog__card", 0, 100, "1", "translateY(0)", 600);
    this.animate_elements(".blog__btn", 200, 100, "1", "translateY(0)", 600);
  }
}

// Animations initialization
let blog_animator: BlogAnimator | null = null;

export function init_blog_animations(): void {
  try {
    const blog_element = document.querySelector("#blog");
    if (blog_element) {
      blog_animator = new BlogAnimator();
    }
  } catch (error) {
    console.warn("Blog animations initialization failed:", error);
  }
}

export function destroy_blog_animations(): void {
  blog_animator?.destroy();
  blog_animator = null;
}
