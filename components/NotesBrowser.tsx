"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Card, Category } from "@/content/notes";
import { quizzes } from "@/content/quiz";
import QuizModal from "@/components/QuizModal";
import FlashcardModal from "@/components/FlashcardModal";

type SearchableCategory = Omit<Category, "cards"> & {
  cards: (Card & { searchText: string; preview: string })[];
};

function NinjaMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="ninja-crest"
    >
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="2" />
      <circle
        cx="32"
        cy="32"
        r="23"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="34 4 7 3"
      />
      <path
        d="M9 44 6 34m48-18 4 11M17 10l10-5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fill="currentColor"
        fontSize="37"
        fontFamily="Yu Mincho, Hiragino Mincho ProN, serif"
      >
        忍
      </text>
    </svg>
  );
}

const categorySymbols: Record<string, number> = {
  networking: 0,
  storage: 1,
  "storage-services": 2,
  database: 3,
  "compute-messaging": 4,
  iam: 5,
  management: 6,
  dr: 7,
  "high-availability": 8,
  "high-performance": 9,
  billing: 10,
  analytics: 11,
  governance: 12,
  api: 13,
};

function CategorySymbol({ id }: { id: string }) {
  const index = categorySymbols[id] ?? 0;
  return (
    <span className="category-symbol" aria-hidden="true" data-symbol={id}>
      <span
        className="category-symbol-art"
        style={{
          backgroundPosition: `${(index % 4) * (100 / 3)}% ${Math.floor(index / 4) * (100 / 3)}%`,
        }}
      />
    </span>
  );
}

function StudyIcon({ scroll = false }: { scroll?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {scroll ? (
        <>
          <path d="M6 3h12v15H6zM6 3C2 3 2 7 6 7m12 11c4 0 4 4 0 4H6M9 7h6M9 10h6M9 13h4" />
        </>
      ) : (
        <>
          <path d="M12 5C8 2 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-6-2-10 1Zm0 0v16M5 7l4 1M5 10l4 1m6-3 4-1m-4 4 4-1" />
        </>
      )}
    </svg>
  );
}

export default function NotesBrowser({
  categories,
}: {
  categories: SearchableCategory[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const term = query.trim().toLowerCase();
  const total = categories.reduce(
    (count, category) => count + category.cards.length,
    0,
  );
  const matches = categories.map((category) => ({
    ...category,
    cards: category.cards.filter(
      (card) =>
        !term ||
        `${category.title} ${card.searchText}`.toLowerCase().includes(term),
    ),
  }));
  const visible = matches.filter(
    (category) =>
      (selected === "all" || selected === category.id) && category.cards.length,
  );
  const count = visible.reduce(
    (sum, category) => sum + category.cards.length,
    0,
  );
  const selectedTitle = categories.find(
    (category) => category.id === selected,
  )?.title;

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      if (categories.some((category) => category.id === id)) {
        setSelected(id);
      } else if (!id) {
        setSelected("all");
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [categories]);

  // On phones the menu starts collapsed (a compact bar); it expands as a vertical list.
  useEffect(() => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarCollapsed(true);
    }
  }, []);

  function chooseTopic(id: string) {
    setSelected(id);
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarCollapsed(true);
    }
    window.history.replaceState(
      null,
      "",
      id === "all"
        ? window.location.pathname + window.location.search
        : `#${id}`,
    );
  }

  function reset() {
    setQuery("");
    chooseTopic("all");
  }

  return (
    <div className="layout">
      <a className="skip-link" href="#study-notes">
        ข้ามไปยังเนื้อหา
      </a>
      <aside
        className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          aria-expanded={!sidebarCollapsed}
          aria-controls="topic-navigation"
          aria-label={sidebarCollapsed ? "ขยายแถบเมนู" : "ยุบแถบเมนู"}
          title={sidebarCollapsed ? "ขยายแถบเมนู" : "ยุบแถบเมนู"}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
            <path d={sidebarCollapsed ? "m13 9 3 3-3 3" : "m17 9-3 3 3 3"} />
          </svg>
        </button>
        <a
          className="brand"
          href="#"
          onClick={reset}
          aria-label="Cloud Ninja หน้าหลัก"
        >
          <span className="brand-mark">
            <NinjaMark />
          </span>
          <span className="brand-label">
            CLOUD NINJA<small>AWS STUDY DOJO</small>
          </span>
        </a>
        <div className="course-label">
          <span className="status-dot" /> SAA-C03 <span>STUDY GUIDE</span>
        </div>
        <nav id="topic-navigation" aria-label="หมวดหมู่บทเรียน">
          <p className="eyebrow nav-label">YOUR TRAINING</p>
          <button
            className={`nav-item ${selected === "all" ? "active" : ""}`}
            onClick={() => chooseTopic("all")}
            aria-pressed={selected === "all"}
            aria-label="ทุกหมวดหมู่"
            title="ทุกหมวดหมู่"
          >
            <span className="nav-number">◈</span>
            <span className="nav-text">ทุกหมวดหมู่</span>
            <span className="nav-count">{total}</span>
          </button>
          <p className="eyebrow nav-label topics-label">STUDY TOPICS</p>
          {categories.map((category, index) => (
            <button
              key={category.id}
              data-cat={category.id}
              className={`nav-item ${selected === category.id ? "active" : ""}`}
              onClick={() => chooseTopic(category.id)}
              aria-pressed={selected === category.id}
              aria-label={category.title}
              title={category.title}
            >
              <span className="nav-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="nav-text">{category.title}</span>
              <span className="nav-count">{category.cards.length}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="dojo-seal" lang="ja" aria-label="นินจา">
            忍
          </span>
          <span className="eyebrow">
            THE NINJA WAY · <span lang="ja">忍道</span>
          </span>
          <p>ฝึกทีละนิด เข้าใจทีละเรื่อง</p>
          <small>ทุกครั้งที่ทบทวน คืออีกก้าวที่ใกล้เป้าหมาย</small>
        </div>
        <div className="sidebar-bottom">
          AWS Certified Solutions Architect<span>Associate · SAA-C03</span>
        </div>
      </aside>
      <main id="study-notes" tabIndex={-1}>
        <div className="main-scene" aria-hidden="true">
          <Image
            src="/images/ninja-moon-castle.png"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 85vw"
            preload
            className="scene-image"
          />
        </div>
        <header className="topbar">
          <span>
            คลังความรู้ <span className="breadcrumb-slash">/</span>{" "}
            <strong>เตรียมสอบ AWS</strong>
          </span>
          <span className="edition">
            SAA-C03 <span className="status-dot" />
          </span>
        </header>
        <div className="main-content">
          <section className="hero" aria-labelledby="page-title">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="red-line" /> CLOUD NINJA · AWS STUDY DOJO
              </p>
              <div className="hero-japanese" lang="ja">
                <span>学びの道場</span>
                <span className="hero-japanese-rule" />
              </div>
              <h1 id="page-title">
                ฝึกสกิล Cloud
                <br />
                <span>ในแบบนินจา</span>
              </h1>
              <p className="hero-description">
                <strong>สรุป AWS SAA-C03 ที่อ่านง่าย เข้าใจไว</strong>
                <br />
                เลือกหัวข้อที่อยากฝึก แล้วค่อย ๆ เก็บความรู้ไปทีละเรื่อง
              </p>
              <a className="primary-button" href="#notes-list">
                เริ่มทบทวน <span aria-hidden="true">↗</span>
              </a>
            </div>
            <span className="art-seal" lang="ja" aria-hidden="true">
              忍
            </span>
            <div className="hero-foot">
              <span>
                <StudyIcon />
                <strong>
                  {categories.length.toString().padStart(2, "0")}
                </strong>{" "}
                หมวดความรู้
              </span>
              <span>
                <StudyIcon scroll />
                <strong>{total}</strong> บทสรุปพร้อมอ่าน
              </span>
              <span className="hero-foot-note">
                เรียนรู้ให้เข้าใจ ไม่ใช่แค่จำ
              </span>
            </div>
          </section>
          <section
            className="study-library"
            aria-labelledby="library-title"
            id="notes-list"
          >
            <div className="library-heading">
              <div>
                <p className="eyebrow">
                  <span lang="ja">巻物</span> · THE KNOWLEDGE SCROLLS
                </p>
                <h2 id="library-title">{selectedTitle || "คลังวิชานินจา"}</h2>
              </div>
              <span className="library-count">
                {selected === "all" ? "ทุกหมวดหมู่" : "หมวดที่เลือก"}
              </span>
            </div>
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.5"
                  cy="10.5"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              <label className="sr-only" htmlFor="notes-search">
                ค้นหาบทสรุปในหมวดที่เลือก
              </label>
              <input
                id="notes-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาหัวข้อหรือคำสำคัญ เช่น VPC, STS, DynamoDB..."
              />
              {query && (
                <button className="clear-search" onClick={() => setQuery("")}>
                  ล้าง
                </button>
              )}
            </div>
            <div className="results-bar">
              <span role="status">
                {term
                  ? `พบ ${count} บทสรุปสำหรับ “${query.trim()}”`
                  : `${count} บทสรุป · เลือกอ่านได้ตามจังหวะของคุณ`}
              </span>
              {selected !== "all" && (
                <button
                  className="text-button"
                  onClick={() => chooseTopic("all")}
                >
                  ดูทุกหมวดหมู่ →
                </button>
              )}
            </div>
            {visible.length === 0 && (
              <div className="empty-state">
                <span aria-hidden="true">◎</span>
                <h3>ยังไม่พบบทสรุปที่ตรงกัน</h3>
                <p>ลองใช้คำที่สั้นลง หรือค้นหาในทุกหมวดหมู่</p>
                <button className="primary-button" onClick={reset}>
                  แสดงบทสรุปทั้งหมด
                </button>
              </div>
            )}
            {visible.map((category) => (
              <section
                key={category.id}
                id={category.id}
                data-cat={category.id}
                className={`category ${selected !== "all" ? "category-selected" : ""}`}
                aria-labelledby={`${category.id}-title`}
              >
                <div className="category-heading">
                  <span className="category-number">
                    {String(
                      categories.findIndex((item) => item.id === category.id) +
                        1,
                    ).padStart(2, "0")}
                  </span>
                  <h3 id={`${category.id}-title`}>{category.title}</h3>
                  <span className="category-rule" />
                  <span className="category-count">
                    {category.cards.length} บทสรุป
                  </span>
                </div>
                {category.cards.map((card) => {
                  const cardIndex = category.cards.findIndex(
                    (item) => item.title === card.title,
                  );
                  return (
                    <article key={card.title} className="card">
                      <details className="lesson-details">
                        <summary
                          className="lesson-summary"
                          aria-label={`อ่านบทสรุป ${card.title}`}
                        >
                          <CategorySymbol id={category.id} />
                          <span className="lesson-copy">
                            <span className="lesson-title">{card.title}</span>
                            <span className="lesson-preview">
                              {card.preview}
                            </span>
                          </span>
                          <span className="card-index">
                            {String(cardIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="lesson-arrow" aria-hidden="true">
                            →
                          </span>
                        </summary>
                        <div className="card-body">{card.body}</div>
                      </details>
                    </article>
                  );
                })}
                {!term && quizzes[category.id]?.length > 0 && (
                  <div className="study-actions">
                    <QuizModal questions={quizzes[category.id]} />
                    <FlashcardModal
                      categoryId={category.id}
                      questions={quizzes[category.id]}
                    />
                  </div>
                )}
              </section>
            ))}
          </section>
          <footer>
            <span>
              CLOUD NINJA <span className="footer-divider">/</span> SAA-C03
              STUDY DOJO
            </span>
            <span>ฝึกฝนอย่างมีเป้าหมาย ทบทวนอย่างเข้าใจ</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
