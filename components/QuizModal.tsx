"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { QuizQuestion } from "@/content/quiz";
import Quiz from "@/components/Quiz";

export default function QuizModal({
  questions,
}: {
  questions: QuizQuestion[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Mount the quiz on first open, then keep it mounted so answers survive closing.
  const [opened, setOpened] = useState(false);

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

  // Sync body scroll lock and focus return with any way of closing
  // (close button, Esc key, backdrop click).
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="quiz-open-btn"
        onClick={open}
      >
        <span className="quiz-open-title">ทดสอบวิชานินจา</span>
        <span className="quiz-open-meta">
          แบบทดสอบท้ายหมวด · {questions.length} ข้อ
        </span>
        <span className="quiz-chevron" aria-hidden="true">
          ↗
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="quiz-dialog"
        aria-label="แบบทดสอบท้ายหมวด"
        onClick={(e) => {
          // Clicks on the dimmed backdrop land on the <dialog> element itself.
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="quiz-dialog-head">
          <span className="quiz-dialog-title">
            ทดสอบวิชานินจา · {questions.length} ข้อ
          </span>
          <button
            type="button"
            className="quiz-dialog-close"
            onClick={close}
            aria-label="ปิดแบบทดสอบ"
          >
            ✕
          </button>
        </div>
        <div className="quiz-dialog-body">
          {opened && <Quiz questions={questions} />}
          <button
            type="button"
            className="quiz-dialog-done"
            onClick={close}
          >
            ปิดแบบทดสอบ
          </button>
        </div>
      </dialog>
    </>
  );
}
