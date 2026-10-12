"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QuizQuestion } from "@/content/quiz";

type Status = "known" | "review";
type Filter = "all" | "todo";

function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

function shuffled(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Flashcards are generated from the category's quiz questions:
// front = the question, back = the correct answer + explanation.
export default function FlashcardModal({
  categoryId,
  questions,
}: {
  categoryId: string;
  questions: QuizQuestion[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const storageKey = `flashcards:${categoryId}`;

  const [opened, setOpened] = useState(false);
  const [order, setOrder] = useState<number[]>(() =>
    Array.from({ length: questions.length }, (_, i) => i),
  );
  const [isShuffled, setIsShuffled] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [showOptions, setShowOptions] = useState(false);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<Record<string, Status>>({});

  // Load saved progress the first time the dialog opens.
  useEffect(() => {
    if (!opened) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setStatus(JSON.parse(raw) as Record<string, Status>);
    } catch {
      /* storage unavailable: progress just won't persist */
    }
  }, [opened, storageKey]);

  const save = useCallback(
    (next: Record<string, Status>) => {
      setStatus(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const keyOf = useCallback(
    (index: number) => hashText(questions[index].q),
    [questions],
  );

  const deck = useMemo(
    () =>
      order.filter(
        (index) => filter === "all" || status[keyOf(index)] !== "known",
      ),
    [order, filter, status, keyOf],
  );

  const knownCount = questions.filter(
    (item) => status[hashText(item.q)] === "known",
  ).length;
  const reviewCount = questions.filter(
    (item) => status[hashText(item.q)] === "review",
  ).length;

  const done = pos >= deck.length;
  const current = done ? null : questions[deck[pos]];

  const open = useCallback(() => {
    setOpened(true);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.body.style.overflow = "";
    };
  }, []);

  function goTo(next: number) {
    setPos(Math.max(0, Math.min(next, deck.length)));
    setFlipped(false);
  }

  function rate(value: Status) {
    if (!current) return;
    const next = { ...status, [keyOf(deck[pos])]: value };
    save(next);
    // In "todo" mode a known card leaves the deck, so the next card slides into this slot.
    if (!(filter === "todo" && value === "known")) {
      setPos(pos + 1);
    }
    setFlipped(false);
  }

  function toggleShuffle() {
    const nextShuffled = !isShuffled;
    setIsShuffled(nextShuffled);
    setOrder(
      nextShuffled
        ? shuffled(questions.length)
        : Array.from({ length: questions.length }, (_, i) => i),
    );
    setPos(0);
    setFlipped(false);
  }

  function changeFilter(next: Filter) {
    setFilter(next);
    setPos(0);
    setFlipped(false);
  }

  function restart() {
    setPos(0);
    setFlipped(false);
  }

  function resetProgress() {
    save({});
    setPos(0);
    setFlipped(false);
  }

  const answerText = current
    ? (Array.isArray(current.correct) ? current.correct : [current.correct])
        .slice()
        .sort((a, b) => a - b)
        .map((i) => current.options[i])
    : [];
  const multi = current ? Array.isArray(current.correct) : false;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="quiz-open-btn fc-open-btn"
        onClick={open}
      >
        <span className="quiz-open-title">แฟลชการ์ด</span>
        <span className="quiz-open-meta">
          ทบทวนทีละใบ · {questions.length} ใบ
        </span>
        <span className="quiz-chevron" aria-hidden="true">
          ↗
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="quiz-dialog fc-dialog"
        aria-label="แฟลชการ์ดประจำหมวด"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(pos + 1);
          if (e.key === "ArrowLeft") goTo(pos - 1);
        }}
      >
        <div className="quiz-dialog-head">
          <span className="quiz-dialog-title">
            แฟลชการ์ด · {questions.length} ใบ
          </span>
          <button
            type="button"
            className="quiz-dialog-close"
            onClick={close}
            aria-label="ปิดแฟลชการ์ด"
          >
            ✕
          </button>
        </div>
        <div className="quiz-dialog-body">
          {opened && (
            <div className="fc-wrap">
              <div className="fc-tools">
                <button
                  type="button"
                  className="fc-chip"
                  aria-pressed={filter === "todo"}
                  onClick={() =>
                    changeFilter(filter === "todo" ? "all" : "todo")
                  }
                >
                  เฉพาะที่ยังไม่จำได้
                </button>
                <button
                  type="button"
                  className="fc-chip"
                  aria-pressed={isShuffled}
                  onClick={toggleShuffle}
                >
                  สลับลำดับ
                </button>
                <button
                  type="button"
                  className="fc-chip"
                  aria-pressed={showOptions}
                  onClick={() => setShowOptions((v) => !v)}
                >
                  แสดงตัวเลือก
                </button>
              </div>

              <div className="fc-progress">
                <span>
                  {done
                    ? "จบชุดแล้ว"
                    : `ใบที่ ${pos + 1} / ${deck.length}`}
                </span>
                <span>
                  จำได้ {knownCount} · ทวน {reviewCount}
                </span>
              </div>
              <div className="fc-bar" aria-hidden="true">
                <span
                  style={{
                    width: `${questions.length ? (knownCount / questions.length) * 100 : 0}%`,
                  }}
                />
              </div>

              {done || !current ? (
                <div className="fc-done">
                  <p className="fc-done-title">
                    {deck.length === 0 ? "ไม่มีใบที่เหลือในชุดนี้" : "ครบทุกใบแล้ว"}
                  </p>
                  <p className="fc-explain">
                    จำได้ {knownCount} จาก {questions.length} ใบ
                    {reviewCount > 0 ? ` · ต้องทวน ${reviewCount} ใบ` : ""}
                  </p>
                  <div className="fc-nav">
                    {deck.length > 0 && (
                      <button
                        type="button"
                        className="fc-btn"
                        onClick={restart}
                      >
                        เริ่มชุดนี้ใหม่
                      </button>
                    )}
                    {filter === "all" && knownCount < questions.length && (
                      <button
                        type="button"
                        className="fc-btn"
                        onClick={() => changeFilter("todo")}
                      >
                        ทวนเฉพาะที่ยังไม่จำได้
                      </button>
                    )}
                    {filter === "todo" && (
                      <button
                        type="button"
                        className="fc-btn"
                        onClick={() => changeFilter("all")}
                      >
                        ดูทุกใบ
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={`fc-card ${flipped ? "is-back" : ""}`}
                    onClick={() => setFlipped((v) => !v)}
                    aria-label={flipped ? "ดูคำถาม" : "ดูคำตอบ"}
                  >
                    {!flipped ? (
                      <>
                        <span className="fc-side">
                          คำถาม
                          {multi ? ` · เลือก ${answerText.length} ข้อ` : ""}
                        </span>
                        <span className="fc-question">{current.q}</span>
                        {showOptions && (
                          <ol className="fc-options">
                            {current.options.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ol>
                        )}
                        <span className="fc-tap">แตะเพื่อดูคำตอบ</span>
                      </>
                    ) : (
                      <>
                        <span className="fc-side">คำตอบ</span>
                        <span className="fc-answer">
                          {answerText.map((text, i) => (
                            <span key={i} className="fc-answer-line">
                              {text}
                            </span>
                          ))}
                        </span>
                        <span className="fc-explain">{current.explain}</span>
                        <span className="fc-tap">แตะเพื่อกลับไปดูคำถาม</span>
                      </>
                    )}
                  </button>
                  <div className="fc-rate">
                    <button
                      type="button"
                      className="fc-btn fc-btn-review"
                      onClick={() => rate("review")}
                    >
                      ยังไม่แน่ใจ
                    </button>
                    <button
                      type="button"
                      className="fc-btn fc-btn-known"
                      onClick={() => rate("known")}
                    >
                      จำได้แล้ว
                    </button>
                  </div>
                  <div className="fc-nav">
                    <button
                      type="button"
                      className="fc-btn"
                      onClick={() => goTo(pos - 1)}
                      disabled={pos === 0}
                    >
                      ← ก่อนหน้า
                    </button>
                    <button
                      type="button"
                      className="fc-btn"
                      onClick={() => goTo(pos + 1)}
                    >
                      ถัดไป →
                    </button>
                  </div>
                </>
              )}

              <div className="fc-foot">
                <button
                  type="button"
                  className="fc-link"
                  onClick={resetProgress}
                >
                  รีเซ็ตความคืบหน้าของหมวดนี้
                </button>
              </div>
            </div>
          )}
          <button type="button" className="quiz-dialog-done" onClick={close}>
            ปิดแฟลชการ์ด
          </button>
        </div>
      </dialog>
    </>
  );
}
