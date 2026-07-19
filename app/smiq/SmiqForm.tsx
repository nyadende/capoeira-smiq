"use client";

import { useState, useEffect } from "react";
import { submitResponse } from "./actions";

// ── Segment data — keys/icons/English fallbacks ───────────────────────────────

const SEGMENTS = [
  {
    key: "curious",
    label: "The Curious One",
    icon: "🌱",
    desc: "New or just exploring — haven't trained regularly yet",
    question: "When it comes to starting Capoeira, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I don't know where to find a school near me...",
  },
  {
    key: "student",
    label: "The Student",
    icon: "🎵",
    desc: "Training consistently, learning the ropes of jogo and music",
    question: "When it comes to growing in your Capoeira practice, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I struggle to find time to train consistently...",
  },
  {
    key: "practitioner",
    label: "The Practitioner",
    icon: "🌀",
    desc: "Years of training, playing rodas, deepening your art",
    question: "When it comes to taking your Capoeira to the next level, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. I feel like my progress has plateaued...",
  },
  {
    key: "teacher",
    label: "The Teacher",
    icon: "🪘",
    desc: "Mestre, instructor, or building your own group / school",
    question: "When it comes to teaching Capoeira and growing your school or group, what is your single biggest challenge or frustration right now?",
    placeholder: "e.g. Retaining students beyond the first few months...",
  },
  {
    key: "lapsed",
    label: "The One Who Left",
    icon: "🌙",
    desc: "Trained before but stepped away — life, injury, or something else pulled you out",
    question: "You trained Capoeira and then stepped away — what was the single biggest reason you left?",
    placeholder: "e.g. Life got in the way and I never found my way back...",
  },
] as const;

// ── Teacher detail options ────────────────────────────────────────────────────

const TEACHING_ROLES = [
  { value: "classes",    tkey: "role_classes", label: "I teach classes",                         sub: "Affiliated with or employed by someone else's school" },
  { value: "own-school", tkey: "role_own",     label: "I teach & run my own school or group",   sub: "I own or lead my own school or group" },
  { value: "admin",      tkey: "role_admin",   label: "I run a school but don't teach regularly", sub: "Administrative / leadership role" },
  { value: "online",     tkey: "role_online",  label: "I teach primarily online",                sub: "YouTube, courses, or digital platforms" },
];

const GRADUATION_LEVELS = [
  { value: "monitor",        tkey: "grad_monitor",   label: "Monitor / Instructor",   sub: null as string | null },
  { value: "professor",      tkey: "grad_professor", label: "Professor",              sub: null as string | null },
  { value: "contra-mestre",  tkey: "grad_contra",    label: "Contra-Mestre",          sub: null as string | null },
  { value: "mestre",         tkey: "grad_mestre",    label: "Mestre",                 sub: "Fully graduated master" as string | null },
  { value: "grao-mestre",    tkey: "grad_grao",      label: "Grão-Mestre",            sub: "Grand master" as string | null },
  { value: "ungraded",       tkey: "grad_ungraded",  label: "Not formally graded",    sub: "Self-taught or community teacher" as string | null },
];

// ── i18n helper ───────────────────────────────────────────────────────────────

function t(key: string, fallback = "", vars?: Record<string, string>): string {
  if (typeof window === "undefined") return fallback;
  return window.i18n?.t(key, vars) || fallback;
}

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
  const [, setTick] = useState(0);

  useEffect(() => {
    function onLangChange() {
      setTick((n) => n + 1);
    }
    document.addEventListener("i18n:change", onLangChange);
    return () => document.removeEventListener("i18n:change", onLangChange);
  }, []);

  const isTeacher = state.segment === "teacher";
  const rawSegment = SEGMENTS.find((s) => s.key === state.segment) ?? null;

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
    if (!state.segment || !rawSegment) return;

    const trimmedName = state.name.trim();
    const trimmedEmail = state.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Please enter your name and email address.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await submitResponse({
      segment: state.segment,
      segmentLabel: rawSegment.label,
      smiqAnswer: state.smiqAnswer,
      teachingRole: isTeacher ? state.teachingRole : null,
      graduationLevel: isTeacher ? state.graduationLevel : null,
      name: trimmedName,
      email: trimmedEmail,
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
            {t("form_success.heading", `Axé, ${firstName}!`, { firstName })}
          </div>
          <p className="success-msg" id="success-msg">
            {isLapsed
              ? t("form_success.body_lapsed", "Thank you for sharing your story. Understanding why people step away matters deeply — your answer will be read carefully.")
              : t("form_success.body_default", "Thank you for sharing. We read every response personally and your answer will help shape something genuinely useful for the Capoeira community.")}
          </p>
          <div className="segment-badge" id="success-badge">
            <span>{rawSegment?.icon}</span>
            <span>{rawSegment ? t(`form_segments.${rawSegment.key}_label`, rawSegment.label) : ""}</span>
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
          <span className="eyebrow">{t("form_step0.eyebrow", "Tell us where you are")}</span>
          <h1>{t("form_step0.h1", "Which of these best describes you?")}</h1>
          <p className="subtitle">{t("form_step0.subtitle", "We'll tailor everything to your journey.")}</p>

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
                <span className="seg-name">{t(`form_segments.${seg.key}_label`, seg.label)}</span>
                <span className="seg-desc">{t(`form_segments.${seg.key}_desc`, seg.desc)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1 ── SMIQ open text ──────────────────────────────────────── */}
      {state.step === 1 && rawSegment && (
        <div key="step-1" className="step" id="step-1">
          <span className="eyebrow" id="smiq-eyebrow">{t("form_step1.eyebrow", "Your biggest challenge")}</span>
          <p className="smiq-label" id="smiq-question">
            {t(`form_segments.${rawSegment.key}_question`, rawSegment.question)}
          </p>
          <textarea
            id="smiq-answer"
            rows={5}
            minLength={10}
            placeholder={t(`form_segments.${rawSegment.key}_placeholder`, rawSegment.placeholder)}
            value={state.smiqAnswer}
            onChange={(e) =>
              setState((prev) => ({ ...prev, smiqAnswer: e.target.value }))
            }
            autoFocus
          />
          <p className="char-hint">
            {t("form_step1.hint", "Please write at least 10 characters — the more detail, the better.")}
          </p>
          <div className="btn-row">
            <button
              className="btn btn-ghost"
              id="back-from-smiq"
              onClick={goBack}
              type="button"
            >
              {t("common.back", "← Back")}
            </button>
            <button
              className="btn btn-primary"
              id="next-from-smiq"
              onClick={goNext}
              disabled={state.smiqAnswer.trim().length < 10}
              type="button"
            >
              {t("common.continue", "Continue →")}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── Teacher detail ──────────────────────────────────────── */}
      {state.step === 2 && (
        <div key="step-2" className="step" id="step-2">
          <span className="eyebrow">{t("form_step2.eyebrow", "A little more about your teaching")}</span>
          <h2>{t("form_step2.h2", "How do you teach?")}</h2>
          <p className="subtitle">{t("form_step2.subtitle", "Both fields required to continue.")}</p>

          <div className="detail-section">
            <span className="detail-label">{t("form_step2.teaching_label", "Teaching situation")}</span>
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
                  <span className="choice-name">{t(`form_step2.${opt.tkey}_label`, opt.label)}</span>
                  <span className="choice-sub">{t(`form_step2.${opt.tkey}_sub`, opt.sub)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <span className="detail-label">{t("form_step2.graduation_label", "Graduation level")}</span>
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
                  <span className="choice-name">{t(`form_step2.${opt.tkey}_label`, opt.label)}</span>
                  {opt.sub && <span className="choice-sub">{t(`form_step2.${opt.tkey}_sub`, opt.sub)}</span>}
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
              {t("common.back", "← Back")}
            </button>
            <button
              className="btn btn-primary"
              id="next-from-teacher"
              onClick={goNext}
              disabled={!state.teachingRole || !state.graduationLevel}
              type="button"
            >
              {t("common.continue", "Continue →")}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── Email capture ───────────────────────────────────────── */}
      {state.step === 3 && (
        <div key="step-3" className="step" id="step-3">
          <span className="eyebrow">{t("form_step3.eyebrow", "Almost there")}</span>
          <h1>{t("form_step3.h1", "Last step — who are you?")}</h1>
          <p className="subtitle">{t("form_step3.subtitle", "So we know whose voice this is.")}</p>
          <hr className="rule" />

          <div className="input-group">
            <label className="field-label" htmlFor="name-input">
              {t("form_step3.name_label", "First name")}
            </label>
            <input
              type="text"
              id="name-input"
              placeholder={t("form_step3.name_placeholder", "e.g. Maria")}
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
              {t("form_step3.email_label", "Email address")}
            </label>
            <input
              type="email"
              id="email-input"
              placeholder={t("form_step3.email_placeholder", "you@example.com")}
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
              {t("common.back", "← Back")}
            </button>
            <button
              className={`btn btn-primary${submitting ? " loading" : ""}`}
              id="submit-btn"
              onClick={handleSubmit}
              disabled={submitting || !state.name.trim() || !state.email.trim()}
              type="button"
            >
              <span className="btn-text">{t("common.submit", "Submit →")}</span>
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
