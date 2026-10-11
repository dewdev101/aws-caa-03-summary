import NotesBrowser from "@/components/NotesBrowser";
import { categories } from "@/content/notes";
import { nodeToText } from "@/lib/text";
import { isValidElement, type ReactNode } from "react";

function firstParagraph(node: ReactNode): string {
  if (Array.isArray(node)) {
    return node.map(firstParagraph).find(Boolean) || "";
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) return "";
  if (node.type === "p" || node.type === "li") {
    return nodeToText(node.props.children);
  }
  return firstParagraph(node.props.children);
}

export default function Home() {
  const searchable = categories.map((category) => ({
    ...category,
    cards: category.cards.map((card) => ({
      ...card,
      preview: (
        firstParagraph(card.body) ||
        `เปรียบเทียบ ${card.title} และทบทวนประเด็นสำคัญสำหรับสอบ SAA-C03`
      )
        .replace(/\s+/g, " ")
        .trim(),
      searchText: `${card.title} ${nodeToText(card.body)}`.toLowerCase(),
    })),
  }));

  return <NotesBrowser categories={searchable} />;
}
