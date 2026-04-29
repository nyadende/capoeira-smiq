"use client";

import { useState } from "react";
import { submitResponse } from "./actions";

// ── Segment data ─────────────────────────────────────────────────────────────

const SEGMENTS = [
  {
    key: "curious",
    label: "The Curious One",
    icon: "🌱",
    desc: "New or just exploring — haven't trained regularly yet",
    question:
      "When it comes to starting Capoeira, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I don't know where to find a school near me...",
  },
  {
    key: "student",
    label: "The Student",
    icon: "🎵",
    desc: "Training consistently, learning the ropes of jogo and music",
    question:
      "When it comes to growing in your Capoeira practice, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I struggle to find time to train consistently...",
  },
  {
    key: "practitioner",
    label: "The Practitioner",
    icon: "🌀",
    desc: "Years of training, playing rodas, deepening your art",
    question:
      "When it comes to taking your Capoeira to the next level, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I feel like my progress has plateaued...",
  },
  {
    key: "teacher",
    label: "The Teacher",
    icon: "🪘",
    desc: "Mestre, instructor, or building your own group / school",
    question:
      "When it comes to teaching Capoeira and growing your school or group, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. Retaining students beyond the first few months...",
  },
  {
    key: "lapsed",
    label: "The One Who Left",
    icon: "🌙",
    desc: "Trained before but stepped away — life, injury, or something else pulled you out",
    question:
      "You trained Capoeira and then stepped away — what was the single biggest reason you left?",
    placeholder: "e.g. Life got in the way and I never found my way back...",
  },
] as const;

// ── Teacher detail options ────────────────────────────────────────────────────

const TEACHING_ROLES = [
  {
    value: "classes",
    label: "I teach classes",
    sub: "Affiliated with or employed by someone else's school",
  },
  {
    value: "own-school",
    label: "I teach & run my own school or group",
    sub: "I own or lead my own school or group",
  },
  {
    value: "admin",
    label: "I run a school but don't teach regularly",
    sub: "Administrative / leadership role",
  },
  {
    value: "online",
    label: "I teach primarily online",
    sub: "YouTube, courses, or digital platforms",
  },
];

const GRADUATION_LEVELS = [
  { value: "monitor", label: "Monitor / Instructor", sub: null },
  { value: "professor", label: "Professor", sub: null },
  { value: "contra-mestre", label: "Contra-Mestre", sub: null },
  { value: "mestre", label: "Mestre", sub: "Fully graduated master" },
  { value: "grao-mestre", label: "Grão-Mestre", sub: "Grand master" },
  { value: "ungraded", label: "Not formally graded", sub: "Self-taught or community teacher" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3 | "success";

type FormState = {
  step: Step;
  segment: string | null;
  smiqAnswer: string;
  teachingRole: string | null;
  graduationLevel: string | null;
  name: string;
  email: string;
};

// ── Step dots ─────────────────────────────────────────────────────────────────

function StepDots({ step, isTeacher }: { step: Step; isTeacher: boolean }) {
  const currentIndex = step === "success" ? 4 : (step as number);

  function dotClass(i: number) {
    if (i === currentIndex) return "dot dot-active";
    if (i < currentIndex) return "dot dot-completed";
    return "dot dot-inactive";
  }

  return (
    <div className="step-dots" id="step-dots">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          id={i === 2 ? "teacher-dot" : undefined}
          className={dotClass(i)}
          data-dot={i}
          style={i === 2 && !isTeacher ? { display: "none" } : undefined}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SmiqForm() {
  const [state, setState] = useState<FormState>({
    step: 0,
    segment: null,
    smiqAnswer: "",
    teachingRole: null,
    graduationLevel: null,
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeacher = state.segment === "teacher";
  const segmentData = SEGMENTS.find((s) => s.key === state.segment) ?? null;

  function setStep(step: Step) {
    setState((prev) => ({ ...prev, step }));
    setError(null);
  }

  function goNext() {
    const next = (state.step as number) + 1;
    setStep((next === 2 && !isTeacher ? 3 : next) as Step);
  }

  function goBack() {
    const prev = (state.step as number) - 1;
    setStep((prev === 2 && !isTeacher ? 1 : prev) as Step);
  }

  function selectSegment(key: string) {
    setState((prev) => ({ ...prev, segment: key, step: 1 }));
    setError(null);
  }

  async function handleSubmit() {
    if (!state.segment || !segmentData) return;
    setSubmitting(true);
    setError(null);

    const result = await submitResponse({
      segment: state.segment,
      segmentLabel: segmentData.label,
      smiqAnswer: state.smiqAnswer,
      teachingRole: isTeacher ? state.teachingRole : null,
      graduationLevel: isTeacher ? state.graduationLevel : null,
      name: state.name,
      email: state.email,
    });

    if (result.ok) {
      setStep("success");
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  }

  // ── Success screen ───────────────────────────────────────────────────────────

  if (state.step === "success") {
    const isLapsed = state.segment === "lapsed";
    const firstName = state.name.split(" ")[0];
    return (
      <div className="card" id="main-card">
        <div id="success-screen">
          <div className="axe-heading" id="success-heading">
            Axé, <em>{firstName}!</em>
          </div>
          <p className="success-msg" id="success-msg">
            {isLapsed
              ? "Thank you for sharing your story. Understanding why people step away matters deeply — your answer will be read carefully."
              : "Thank you for sharing. We read every response personally and your answer will help shape something genuinely useful for the Capoeira community."}
          </p>
          <div className="segment-badge" id="success-badge">
            <span>{segmentData?.icon}</span>
            <span>{segmentData?.label}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" id="main-card">
      <StepDots step={state.step} isTeacher={isTeacher} />

      {/* ── STEP 0 ── Segment picker ──────────────────────────────────────── */}
      {state.step === 0 && (
        <div key="step-0" className="step" id="step-0">
          <span className="eyebrow">Tell us where you are</span>
          <h1>Which of these best describes you?</h1>
          <p className="subtitle">We'll tailor everything to your journey.</p>

          <div className="segment-grid" id="segment-grid">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.key}
                className={`segment-card${seg.key === "lapsed" ? " segment-card--lapsed" : ""}${state.segment === seg.key ? " selected" : ""}`}
                data-segment={seg.key}
                data-label={seg.label}
                onClick={() => selectSegment(seg.key)}
                type="button"
              >
                <span className="seg-icon">{seg.icon}</span>
                <span className="seg-name">{seg.label}</span>
                <span className="seg-desc">{seg.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1 ── SMIQ open text ──────────────────────────────────────── */}
      {state.step === 1 && segmentData && (
        <div key="step-1" className="step" id="step-1">
          <span className="eyebrow" id="smiq-eyebrow">Your biggest challenge</span>
          <p className="smiq-label" id="smiq-question">
            {segmentData.question}
          </p>
          <textarea
            id="smiq-answer"
            rows={5}
            minLength={10}
            placeholder={segmentData.placeholder}
            value={state.smiqAnswer}
            onChange={(e) =>
              setState((prev) => ({ ...prev, smiqAnswer: e.target.value }))
            }
            autoFocus
          />
          <p className="char-hint">
            Please write at least 10 characters — the more detail, the better.
          </p>
          <div className="btn-row">
            <button
              className="btn btn-ghost"
              id="back-from-smiq"
              onClick={goBack}
              type="button"
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              id="next-from-smiq"
              onClick={goNext}
              disabled={state.smiqAnswer.trim().length < 10}
              type="button"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── Teacher detail ──────────────────────────────────────── */}
      {state.step === 2 && (
        <div key="step-2" className="step" id="step-2">
          <span className="eyebrow">A little more about your teaching</span>
          <h2>How do you teach?</h2>
          <p className="subtitle">Both fields required to continue.</p>

          <div className="detail-section">
            <span className="detail-label">Teaching situation</span>
            <div className="role-grid" id="role-grid">
              {TEACHING_ROLES.map((opt) => (
                <button
                  key={opt.value}
                  className={`choice-card${state.teachingRole === opt.value ? " selected" : ""}`}
                  data-role={opt.value}
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, teachingRole: opt.value }))
                  }
                >
                  <span className="choice-name">{opt.label}</span>
                  <span className="choice-sub">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <span className="detail-label">Graduation level</span>
            <div className="grad-grid" id="grad-grid">
              {GRADUATION_LEVELS.map((opt) => (
                <button
                  key={opt.value}
                  className={`choice-card${state.graduationLevel === opt.value ? " selected" : ""}`}
                  data-grad={opt.value}
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, graduationLevel: opt.value }))
                  }
                >
                  <span className="choice-name">{opt.label}</span>
                  {opt.sub && <span className="choice-sub">{opt.sub}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="btn-row">
            <button
              className="btn btn-ghost"
              id="back-from-teacher"
              onClick={goBack}
              type="button"
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              id="next-from-teacher"
              onClick={goNext}
              disabled={!state.teachingRole || !state.graduationLevel}
              type="button"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── Email capture ───────────────────────────────────────── */}
      {state.step === 3 && (
        <div key="step-3" className="step" id="step-3">
          <span className="eyebrow">Almost there</span>
          <h1>Last step — who are you?</h1>
          <p className="subtitle">So we know whose voice this is.</p>
          <hr className="rule" />

          <div className="input-group">
            <label className="field-label" htmlFor="name-input">
              First name
            </label>
            <input
              type="text"
              id="name-input"
              placeholder="e.g. Maria"
              value={state.name}
              onChange={(e) =>
                setState((prev) => ({ ...prev, name: e.target.value }))
              }
              autoFocus
              autoComplete="given-name"
            />
          </div>

          <div className="input-group">
            <label className="field-label" htmlFor="email-input">
              Email address
            </label>
            <input
              type="email"
              id="email-input"
              placeholder="you@example.com"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              autoComplete="email"
            />
          </div>

          <div className="btn-row">
            <button
              className="btn btn-ghost"
              id="back-from-email"
              onClick={goBack}
              type="button"
            >
              ← Back
            </button>
            <button
              className={`btn btn-primary${submitting ? " loading" : ""}`}
              id="submit-btn"
              onClick={handleSubmit}
              disabled={submitting || !state.name.trim() || !state.email.trim()}
              type="button"
            >
              <span className="btn-text">Submit →</span>
              <span className="spinner" />
            </button>
          </div>
          {error && (
            <div className="error-msg" id="submit-error">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
