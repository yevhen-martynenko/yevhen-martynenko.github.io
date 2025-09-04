// interfaces
export interface CVHandlerOptions {
  mode?: "open" | "download" | "both";
  base_name?: string;
}

// main function
export function handle_cv(file_path: string, options: CVHandlerOptions = {}) {
  const { mode = "open", base_name = "document" } = options;

  const download_pdf = () => {
    const link = document.createElement("a");
    const date = new Date();
    const date_string = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    link.href = file_path;
    link.download = `${base_name}_${date_string}.pdf`;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (mode === "open" || mode === "both") {
    window.open(file_path, "_blank");
  }

  if (mode === "download" || mode === "both") {
    setTimeout(() => download_pdf(), mode === "both" ? 100 : 0);
  }
}
