export function init_portfolio_filter() {
  const filter_btns = document.querySelectorAll(".filter-btn");
  const project_cards = document.querySelectorAll(".project-card");

  filter_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filter_btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter projects
      const filter = (btn as HTMLElement).dataset.filter;
      project_cards.forEach((card) => {
        const card_element = card as HTMLElement;
        if (filter === "all" || card_element.dataset.type === filter) {
          card_element.style.display = "block";
        } else {
          card_element.style.display = "none";
        }
      });
    });
  });
}
