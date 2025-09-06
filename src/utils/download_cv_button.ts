import { animate_button_icon } from "@utils/button_animations.ts";

// config
const MOBILE_BREAKPOINT = 768;

// utils
function is_mobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function is_hero_visible(): boolean {
  const hero_section = document.getElementById("hero");
  if (!hero_section) return false;

  const rect = hero_section.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight * 0.3;
}

// functions
function update_button_visibility(): void {
  const hero_btn = document.querySelector("#hero .btn--secondary") as HTMLButtonElement;
  const float_btn = document.querySelector(".cv-float-btn") as HTMLButtonElement;
  const mobile_btn = document.getElementById("download-cv-mobile");

  if (!hero_btn || !float_btn) return;

  if (mobile_btn) {
    mobile_btn.classList.toggle("is-hidden", !is_mobile());
  }

  if (is_hero_visible()) {
    hero_btn.style.visibility = "";
    float_btn.classList.remove("visible");
  } else {
    hero_btn.style.visibility = "hidden";
    float_btn.classList.add("visible");
  }
}

function create_floating_button(): HTMLButtonElement {
  const hero_btn = document.querySelector("#hero .btn--secondary") as HTMLButtonElement;
  if (!hero_btn) throw new Error("Hero button not found");

  const float_btn = hero_btn.cloneNode(true) as HTMLButtonElement;
  float_btn.classList.add("cv-float-btn");
  document.body.appendChild(float_btn);

  return float_btn;
}

// main function
export function initialize_cv_buttons(): void {
  const hero_section = document.getElementById("hero");
  const hero_btn = hero_section?.querySelector(".btn--secondary") as HTMLButtonElement;

  if (!hero_section || !hero_btn) return;

  const float_btn = create_floating_button();

  animate_button_icon({ btn: hero_btn });
  animate_button_icon({ btn: float_btn });

  const mobile_btn = document.getElementById("download-cv-mobile") as HTMLButtonElement;
  if (mobile_btn) {
    animate_button_icon({ btn: mobile_btn });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      update_button_visibility();
    },
    {
      threshold: [0, 0.3, 1],
      rootMargin: "0px 0px -20px 0px",
    }
  );

  observer.observe(hero_section);

  let resize_timeout: number;
  window.addEventListener("resize", () => {
    clearTimeout(resize_timeout);
    resize_timeout = setTimeout(update_button_visibility, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      setTimeout(update_button_visibility, 100);
    }
  });

  update_button_visibility();

  (window as any).cleanup_button_manager = () => {
    observer.disconnect();
    float_btn.remove();
    hero_btn.style.visibility = "";
    clearTimeout(resize_timeout);
  };
}
