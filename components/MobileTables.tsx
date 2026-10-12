"use client";

import { useEffect } from "react";

// Card tables are authored as plain <table> markup. On phones we show each row as a
// stacked block instead of a sideways-scrolling grid. This labels each cell with its
// column header (data-label) and marks header rows so CSS can hide them.
function labelTables(root: ParentNode) {
  root.querySelectorAll<HTMLTableElement>(".card table").forEach((table) => {
    if (table.dataset.mt === "1") return;
    const rows = Array.from(table.rows);
    const headRow = rows.find((row) => row.querySelector("th"));
    const labels = headRow
      ? Array.from(headRow.cells).map((cell) => (cell.textContent ?? "").trim())
      : [];
    rows.forEach((row) => {
      if (row === headRow) {
        row.classList.add("mt-head");
        return;
      }
      Array.from(row.cells).forEach((cell, i) => {
        const label = labels[i];
        if (label) cell.setAttribute("data-label", label);
      });
    });
    table.dataset.mt = "1";
  });
}

export default function MobileTables() {
  useEffect(() => {
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => labelTables(document));
    };
    run();
    // Search/filtering re-renders cards, so keep labelling new tables.
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
