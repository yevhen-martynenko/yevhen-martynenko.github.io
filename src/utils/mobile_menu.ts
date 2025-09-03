// interfaces
export interface BurgerMenuOptions {
  menu_btn_id: string;
  mobile_menu_id: string;
  nav_link_selector: string;
  breakpoint?: number;
}

// main function
export function init_mobile_menu(options: BurgerMenuOptions = {}) {
  const { menu_btn_id, mobile_menu_id, nav_link_selector, breakpoint = 768 } = options;

  let is_menu_open = false;
  let menu_btn: HTMLElement | null = null;
  let mobile_menu: HTMLElement | null = null;
  let mobile_nav_links: NodeListOf<HTMLElement>;

  function toggle_menu() {
    if (is_menu_open) {
      close_menu();
    } else {
      open_menu();
    }
  }

  function open_menu() {
    if (!menu_btn || !mobile_menu) return;

    is_menu_open = true;
    menu_btn.classList.add("active");
    mobile_menu.classList.add("active");
    document.body.classList.add("menu-open");
    reset_animations();
  }

  function close_menu() {
    if (!menu_btn || !mobile_menu) return;

    is_menu_open = false;
    menu_btn.classList.remove("active");
    mobile_menu.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function reset_animations() {
    mobile_nav_links.forEach((link, index) => {
      link.style.animation = "none";
      link.offsetHeight;
      link.style.animation = `fade_in_up 0.5s ease forwards`;
      link.style.animationDelay = `${index * 0.1}s`;
    });
  }

  function setup_event_listeners() {
    menu_btn?.addEventListener("click", toggle_menu);
    mobile_nav_links.forEach((link) => {
      link.addEventListener("click", close_menu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > breakpoint && is_menu_open) {
        close_menu();
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (is_menu_open && !mobile_menu?.contains(target) && !menu_btn?.contains(target)) {
        close_menu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && is_menu_open) {
        close_menu();
      }
    });

    document.addEventListener(
      "touchmove",
      (e) => {
        if (is_menu_open) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  function init_elements() {
    menu_btn = document.getElementById(menu_btn_id);
    mobile_menu = document.getElementById(mobile_menu_id);
    mobile_nav_links = document.querySelectorAll(nav_link_selector);
  }

  document.addEventListener("DOMContentLoaded", () => {
    init_elements();
    setup_event_listeners();
  });

  return {
    open: open_menu,
    close: close_menu,
    toggle: toggle_menu,
    get is_open() {
      return is_menu_open;
    },
  };
}
