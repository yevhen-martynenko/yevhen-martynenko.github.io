// ==================================================
// Header animation
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
  const header_el = document.querySelector(".header");
  const hero_sentinel_el = document.getElementById("hero-sentinel");
  const nav_links = document.querySelectorAll(".nav-link");

  if (!header_el || !hero_sentinel_el) return;

  const header_observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        header_el.classList.remove("visible__header");
      } else {
        header_el.classList.add("visible__header");
        animate_links();
      }
    });
  });

  header_observer.observe(hero_sentinel_el);

  function animate_links() {
    nav_links.forEach((link, index) => {
      link.style.opacity = "0";
      link.style.transform = "translateY(-10px)";
      link.style.transition = "opacity 0.4s ease, transform 0.4s ease";

      setTimeout(
        () => {
          link.style.opacity = "1";
          link.style.transform = "translateY(0)";
        },
        100 + index * 150
      );
    });
  }

  function update_active_links() {
    const section_ids = ["hero", "experience", "skills", "portfolio", "blog", "contact"];
    const scroll_pos = window.scrollY + 100;

    section_ids.forEach((section_id) => {
      const section_el = document.getElementById(section_id);
      const nav_link = document.querySelector(`a[href="#${section_id}"]`);

      if (section_el && nav_link) {
        const section_top = section_el.offsetTop;
        const section_bottom = section_top + section_el.offsetHeight;

        if (scroll_pos >= section_top && scroll_pos < section_bottom) {
          nav_links.forEach((link) => link.classList.remove("active"));
          nav_link.classList.add("active");
        }
      }
    });
  }

  let scroll_timer;
  window.addEventListener("scroll", function () {
    if (scroll_timer) {
      clearTimeout(scroll_timer);
    }
    scroll_timer = setTimeout(update_active_links, 10);
  });

  update_active_links();
});

// ==================================================
// Footer animation
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  const footer_el = document.querySelector("footer");

  if (!footer_el) return;

  const footer_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer_el.classList.add("animate");
        }
      });
    },
    { threshold: 0.3 }
  );

  footer_observer.observe(footer_el);
});
