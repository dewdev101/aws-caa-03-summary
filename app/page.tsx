import NotesBrowser from "@/components/NotesBrowser";
import { categories } from "@/content/notes";
import { nodeToText } from "@/lib/text";

export default function Home() {
  const searchable = categories.map((category) => ({
    ...category,
    cards: category.cards.map((card) => ({
      ...card,
      searchText: `${card.title} ${nodeToText(card.body)}`.toLowerCase(),
    })),
  }));

  return (
    <div className="layout">
      <nav>
        <h1>AWS SAA-C03</h1>
        {categories.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.title}
          </a>
        ))}
      </nav>
      <main>
        <NotesBrowser categories={searchable} />
        <footer>สรุปสำหรับทบทวนก่อนสอบ SAA-C03 — แก้ไข/เพิ่มเนื้อหาได้โดยตรงในไฟล์ content/notes.tsx</footer>
      </main>
    </div>
  );
}
