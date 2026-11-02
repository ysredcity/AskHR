export type ReportNoteQuote = { id: string; title: string; content: string };

/** The report stays script-free; its trusted host binds these controls. */
export function bindReportNotes(document: Document, options: { onQuote: (quote: ReportNoteQuote) => void; onSave: () => void }) {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>(".distribution-report .analysis-notes, .final-report .notes-grid, .final-report #risks > .two-columns, .summary-report .summary-card > .note, .summary-report .decision-panel, .summary-report .decision-callout").forEach((region, index) => {
    region.contentEditable = "false";
    region.classList.add("report-editable-notes");
    const paragraphs = region.matches("p") ? [region.querySelector<HTMLElement>(":scope > span")!].filter(Boolean) : Array.from(region.querySelectorAll<HTMLElement>("p"));
    const notes = paragraphs.map(paragraph => ({ paragraph, name: paragraph.previousElementSibling?.textContent?.trim() || region.querySelector("h3,h4,strong")?.textContent?.trim() || "分析内容" }));
    const title = (region.matches(".decision-callout") ? region.querySelector("strong")?.textContent?.replace(/：$/, "") : undefined) || region.closest(".analysis-card,.diagnosis-card,.summary-card,.report-section")?.querySelector(".section-title,.diagnosis-title,h3")?.textContent?.trim() || `分析结果 ${index + 1}`;
    const actions = document.createElement("div");
    actions.className = "report-note-actions";
    actions.setAttribute("role", "toolbar");
    actions.setAttribute("aria-label", `${title}操作`);
    const button = (text: string, label: string) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "report-note-button";
      element.textContent = text;
      element.setAttribute("aria-label", label);
      return element;
    };
    const quote = button("引用", `引用${title}`);
    const edit = button("编辑", `编辑${title}`);
    actions.append(quote, edit);
    region.append(actions);
    let editor: HTMLFormElement | null = null;
    const stopEditing = () => {
      editor?.remove();
      editor = null;
      delete region.dataset.editing;
      edit.focus({ preventScroll: true });
    };
    quote.onclick = () => {
      options.onQuote({
        id: `report-note-${index}`,
        title,
        content: notes.map(note => `### ${note.name}\n\n${note.paragraph.textContent ?? ""}`).join("\n\n"),
      });
    };
    edit.onclick = () => {
      if (editor) return;
      editor = document.createElement("form");
      editor.className = "report-note-editor";
      editor.setAttribute("aria-label", `编辑${title}`);
      const inputs = notes.map(note => {
        const label = document.createElement("label");
        label.className = "report-note-field";
        const name = note.name;
        const caption = document.createElement("span");
        caption.textContent = name;
        const input = document.createElement("textarea");
        input.name = name;
        input.setAttribute("aria-label", `${title}：${name}`);
        input.value = note.paragraph.textContent ?? "";
        input.rows = 3;
        label.append(caption, input);
        editor!.append(label);
        return input;
      });
      const footer = document.createElement("div");
      footer.className = "report-note-editor-actions";
      const cancel = button("取消", `取消编辑${title}`);
      const save = button("保存", `保存${title}`);
      save.classList.add("report-note-button-primary");
      cancel.onclick = stopEditing;
      footer.append(cancel, save);
      editor.append(footer);
      const commit = () => {
        inputs.forEach((input, i) => {
          const paragraph = notes[i].paragraph;
          if (paragraph) paragraph.textContent = input.value;
        });
        stopEditing();
        options.onSave();
      };
      save.onclick = commit;
      editor.onsubmit = event => { event.preventDefault(); commit(); };
      editor.onkeydown = event => {
        if (event.key === "Escape") { event.preventDefault(); stopEditing(); }
        else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); commit(); }
      };
      region.dataset.editing = "true";
      region.append(editor);
      inputs[0]?.focus({ preventScroll: true });
    };
    cleanups.push(() => { actions.remove(); editor?.remove(); delete region.dataset.editing; });
  });
  return () => cleanups.forEach(cleanup => cleanup());
}

/** Do not save hover controls or uncommitted form values into the report. */
export function serializeReport(document: Document) {
  const root = document.documentElement.cloneNode(true) as HTMLElement;
  root.querySelectorAll(".report-note-actions,.report-note-editor").forEach(node => node.remove());
  root.querySelectorAll(".report-editable-notes[data-editing]").forEach(node => node.removeAttribute("data-editing"));
  return `<!doctype html>${root.outerHTML}`;
}
