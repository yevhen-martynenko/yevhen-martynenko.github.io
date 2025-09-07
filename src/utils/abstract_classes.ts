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
  }

  protected abstract add_styles(): void;
  protected abstract setup_animations(): void;

  public destroy(): void {
    this.observer?.disconnect();
  }
}
