// interfaces
export interface TypewriterSequenceStep {
  action: "type" | "backspace";
  value?: string;
  count?: number;
}
export interface TypewriterOptions {
  cursor?: boolean;
}

// main function
export function start_typewriter(
  element: HTMLElement,
  sequence: Array<TypewriterSequenceStep>,
  options: TypewriterOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    element.innerHTML = "// ";

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
        else make_cursor_blink(cursor);
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

function make_cursor_blink(cursor: HTMLElement): void {
  cursor.style.animation = "blink 1.5s steps(1) infinite";
}
