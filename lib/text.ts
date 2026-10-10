import { isValidElement, type ReactNode } from "react";

// Flattens a ReactNode tree into plain text so cards can be searched
// the same way the original page searched `card.textContent`.
export function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeToText(node.props.children);
  return "";
}
