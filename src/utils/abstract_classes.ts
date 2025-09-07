export abstract class BaseAnimator {
  protected observer: IntersectionObserver | null = null;
  protected target: Element;

  constructor(targetSelector: string) {
    const el = document.querySelector(targetSelector);
    if (!el) throw new Error(`Target element "${targetSelector}" not found.`);
    this.target = el;
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
  protected clean_element_styles(element: HTMLElement, cleanupDelay: number): void {
    setTimeout(() => {
      element.style.opacity = "";
      element.style.transform = "";
      element.style.transition = "";
    }, cleanupDelay);
  }

  // Helper for animating single element
  protected animate_element(
    selector: string,
    delay: number,
    finalOpacity: string = "1",
    finalTransform: string = "translate(0)",
    cleanupDelay: number = 600
  ): void {
    const element = document.querySelector(selector);
    if (element) {
      setTimeout(() => {
        const el = element as HTMLElement;
        el.style.opacity = finalOpacity;
        el.style.transform = finalTransform;
        this.clean_element_styles(el, cleanupDelay);
      }, delay);
    }
  }

  // Helper for animating multiple elements
  protected animate_elements(
    selector: string,
    baseDelay: number,
    staggerDelay: number = 0,
    finalOpacity: string = "1",
    finalTransform: string = "translate(0)",
    cleanupDelay: number = 600
  ): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      setTimeout(
        () => {
          const el = element as HTMLElement;
          el.style.opacity = finalOpacity;
          el.style.transform = finalTransform;
          this.clean_element_styles(el, cleanupDelay);
        },
        baseDelay + index * staggerDelay
      );
    });
  }

  public destroy(): void {
    this.observer?.disconnect();
  }
}
