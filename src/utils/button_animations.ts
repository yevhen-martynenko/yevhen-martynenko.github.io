// interfaces
export interface ButtonHoverAnimationOptions {
  btn: HTMLButtonElement;
  translation?: { x?: number; y?: number };
  duration?: number;
}

// functions
export function animate_button_icon(options: ButtonHoverAnimationOptions): void {
  const { btn, translation = {}, duration = 220 } = options;
  const { x = 5, y = -5 } = translation;

  btn.addEventListener("mouseenter", () => {
    const icon = btn.querySelector(".btn__icon") as SVGElement | null;
    if (!icon) return;

    const transform = btn.classList.contains("btn--primary")
      ? `translateX(${x}px)`
      : `translateY(${y}px)`;

    icon.style.transform = transform;

    setTimeout(() => {
      icon.style.transform = "";
    }, duration);
  });
}
