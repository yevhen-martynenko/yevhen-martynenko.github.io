export abstract class BaseAnimator {
  protected observer: IntersectionObserver | null = null;
  protected target: Element;

  constructor(target_selector: string) {
    const element = document.querySelector(target_selector);
    if (!element) throw new Error(`Target element "${target_selector}" not found.`);
    this.target = element;
    this.init();
  }

  private init(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.add_styles();
    this.setup_animations();
    document.body.classList.add("animations-loaded");
  }

  protected abstract add_styles(): void;
  protected abstract setup_animations(): void;

  // Clean up styles after animation
  protected clean_element_styles(element: HTMLElement, cleanup_delay: number): void {
    setTimeout(() => {
      element.style.opacity = "";
      element.style.transform = "";
      element.style.transition = "";
    }, cleanup_delay);
  }

  // Helper for animating single element
  protected animate_element(
    selector: string,
    delay: number,
    final_opacity: string = "1",
    final_transform: string = "translate(0)",
    cleanup_delay: number = 600
  ): void {
    const element = document.querySelector(selector);
    if (element) {
      setTimeout(() => {
        const el = element as HTMLElement;
        el.style.opacity = final_opacity;
        el.style.transform = final_transform;
        this.clean_element_styles(el, cleanup_delay);
      }, delay);
    }
  }

  // Helper for animating multiple elements
  protected animate_elements(
    selector: string,
    base_delay: number,
    stagger_delay: number = 0,
    final_opacity: string = "1",
    final_transform: string = "translate(0)",
    cleanup_delay: number = 600
  ): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      setTimeout(
        () => {
          const el = element as HTMLElement;
          el.style.opacity = final_opacity;
          el.style.transform = final_transform;
          this.clean_element_styles(el, cleanup_delay);
        },
        base_delay + index * stagger_delay
      );
    });
  }

  public destroy(): void {
    this.observer?.disconnect();
  }
}
