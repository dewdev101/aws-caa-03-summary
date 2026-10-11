"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/quiz";

function QuizItem({ index, item }: { index: number; item: QuizQuestion }) {
  const correctSet = new Set(
    Array.isArray(item.correct) ? item.correct : [item.correct],
  );
  const multi = Array.isArray(item.correct);
  const required = correctSet.size;

  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const isCorrect =
    checked &&
    selected.length === required &&
    selected.every((i) => correctSet.has(i));

  function choose(i: number) {
    if (checked) return;
    if (!multi) {
      setSelected([i]);
      return;
    }
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  const correctText = [...correctSet]
    .sort((a, b) => a - b)
    .map((i) => `"${item.options[i]}"`)
    .join(" และ ");

  return (
    <div className="quiz-q">
      <p className="quiz-question">
        {index + 1}. {item.q}
        {multi && <span className="quiz-hint">เลือก {required} ข้อ</span>}
      </p>
      <div className="quiz-options">
        {item.options.map((opt, i) => {
          const stateClass = checked
            ? correctSet.has(i)
              ? "opt-correct"
              : selected.includes(i)
                ? "opt-wrong"
                : ""
            : "";
          return (
            <label key={i} className={`quiz-option ${stateClass}`}>
              <input
                type={multi ? "checkbox" : "radio"}
                name={`quiz-${index}-${item.q}`}
                checked={selected.includes(i)}
                disabled={checked}
                onChange={() => choose(i)}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      <button
        type="button"
        className="quiz-check-btn"
        disabled={checked || selected.length !== required}
        onClick={() => setChecked(true)}
      >
        ตรวจคำตอบ
      </button>
      {checked && (
        <div
          className={`quiz-result show ${isCorrect ? "correct-result" : "wrong-result"}`}
        >
          {isCorrect
            ? "✔ ถูกต้อง!"
            : `✘ ยังไม่ถูก คำตอบที่ถูกคือ ${correctText}`}
          <div className="quiz-explain">{item.explain}</div>
        </div>
      )}
    </div>
  );
}

export default function Quiz({ questions }: { questions?: QuizQuestion[] }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div className="quiz-wrap">
      <p className="quiz-wrap-title">แบบทดสอบท้ายหมวด ({questions.length} ข้อ)</p>
      {questions.map((item, i) => (
        <QuizItem key={i} index={i} item={item} />
      ))}
    </div>
  );
}
