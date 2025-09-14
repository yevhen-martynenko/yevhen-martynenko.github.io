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

// ----------------------------------------------
// Portfolio Filter
// ----------------------------------------------
function set_active_filter(active_button: HTMLElement): void {
  const filter_buttons = document.querySelectorAll(".filter-btn");
  filter_buttons.forEach((btn) => btn.classList.remove("active"));
  active_button.classList.add("active");
}

function filter_projects(filter: string): void {
  const cards = document.querySelectorAll(".project");

  // Fade out all cards first
  cards.forEach((card) => {
    const element = card as HTMLElement;
    element.style.opacity = "0";
    element.style.transform = "scale(0.95)";
    element.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  });

  // Show/hide cards after fade out animation
  setTimeout(() => {
    let stagger_index = 0;

    cards.forEach((card) => {
      const element = card as HTMLElement;
      const card_type = element.getAttribute("data-type");
      const should_show = filter === "all" || card_type === filter;

      element.style.display = should_show ? "block" : "none";

      if (should_show) {
        setTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "scale(1)";
          element.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";

          // Clean up inline styles
          setTimeout(() => {
            element.style.opacity = "";
            element.style.transform = "";
            element.style.transition = "";
          }, 400);
        }, stagger_index * 60);
        stagger_index++;
      }
    });
  }, 200);
}

function setup_filter_buttons(): void {
  const filter_buttons = document.querySelectorAll(".filter-btn");

  filter_buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const filter = target.getAttribute("data-filter");
      if (filter) {
        set_active_filter(target);
        filter_projects(filter);
      }
    });
  });
}

function setup_external_links(): void {
  const project_cards = document.querySelectorAll(".project");

  project_cards.forEach((card) => {
    const link = card as HTMLAnchorElement;
    if (link.href && link.href.startsWith("http")) {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(link.href, "_blank", "noopener,noreferrer");
      });
    }
  });
}

export function init_portfolio_filter(): void {
  const init_filter = () => {
    const portfolio_section = document.querySelector("#portfolio");
    const projects_exist = document.querySelectorAll(".project").length > 0;

    if (portfolio_section && projects_exist) {
      setup_filter_buttons();
      setup_external_links();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init_filter);
  } else {
    init_filter();
  }
}
