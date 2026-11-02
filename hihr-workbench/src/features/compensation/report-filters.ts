/** The iframe stays script-free; report controls are bound by its existing host. */
export function bindReportFilters(document: Document) {
  for (const section of document.querySelectorAll<HTMLElement>(".distribution-report .analysis-card")) {
    const controls = [...section.querySelectorAll<HTMLSelectElement>("select[data-filter]")];
    if (!controls.length) continue;
    const matches = (element: HTMLElement, chart: boolean) => controls.every(control => {
      const field = control.dataset.filter;
      if (!field || !control.value) return true;
      const value = element.getAttribute(`data-${chart ? "chart-" : ""}${field}`);
      return !value || value === control.value;
    });
    const apply = () => {
      for (const row of section.querySelectorAll<HTMLTableRowElement>("tbody tr")) row.hidden = !matches(row, false);
      for (const cell of section.querySelectorAll<HTMLElement>(".heat-cell")) cell.style.opacity = matches(cell, true) ? "1" : ".15";
    };
    for (const control of controls) control.addEventListener("change", apply);
  }
}
