"use client";

import { useState } from "react";
import type { Card, Category } from "@/content/notes";

type SearchableCategory = Omit<Category, "cards"> & {
  cards: (Card & { searchText: string })[];
};

export default function NotesBrowser({ categories }: { categories: SearchableCategory[] }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาคำ เช่น STS, CIDR, DMS..."
        />
      </div>

      {categories.map((category) => {
        const visible = category.cards.filter((card) => !term || card.searchText.includes(term));
        // Keep hidden sections in the DOM so sidebar anchors still resolve.
        return (
          <section
            key={category.id}
            id={category.id}
            className={visible.length ? "category" : "category hidden"}
          >
            <h2>{category.title}</h2>
            {visible.map((card) => (
              <div key={card.title} className="card">
                <h3>{card.title}</h3>
                {card.body}
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
