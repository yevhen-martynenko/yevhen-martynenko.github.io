export function start_typewriter(
  element: HTMLElement,
  sequence: Array<{ action: string; value?: string; count?: number }>,
  options: { cursor?: boolean } = {}
): Promise<void> {
  return new Promise((resolve) => {
    element.innerHTML = "// ";

    const style = document.createElement("style");
    style.textContent = `
      .cursor {
        animation: blink 1s infinite;
      }
    `;
    document.head.appendChild(style);

    let step = 0;
    let char_index = 0;
    let current = sequence[0];

    const cursor = document.createElement("span");
    cursor.textContent = "|";
    cursor.className = "cursor";
    element.appendChild(cursor);

    const type_next = () => {
      if (!current) {
        if (!options.cursor) cursor.remove();
        resolve();
        return;
      }

      if (current.action === "type") {
        if (char_index < (current.value ?? "").length) {
          cursor.remove();
          element.textContent += (current.value as string)[char_index];
          element.appendChild(cursor);
          char_index++;
          setTimeout(type_next, 50);
          return;
        }
      } else if (current.action === "backspace") {
        if ((current.count ?? 0) > 0) {
          cursor.remove();
          element.textContent = element.textContent.slice(0, -1);
          element.appendChild(cursor);
          (current.count as number)--;
          setTimeout(type_next, 75);
          return;
        }
      }
      step++;
      char_index = 0;
      current = sequence[step];
      setTimeout(type_next, 150);
    };
    setTimeout(type_next, 200);
  });
}

function add_cursor(element: HTMLElement): void {
  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.animation = "blink 2s steps(1) infinite";
  element.appendChild(cursor);
}
