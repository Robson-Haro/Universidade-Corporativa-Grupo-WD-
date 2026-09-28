"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { assessments } from "@/lib/course-data";

type Participant = { name: string; email: string };

export default function AssessmentClient({ moduleId }: { moduleId: "1" | "2" }) {
  const questions = assessments[moduleId];
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [message, setMessage] = useState("");
  const [showCorrections, setShowCorrections] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wd_uc_participant");
      if (saved) setParticipant(JSON.parse(saved));
    } catch {
      // Sem efeito.
    }
  }, []);

  const title =
    moduleId === "1" ? "Se conhecendo para liderar" : "Comunicação e Excelência";

  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  function saveParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim().toLowerCase(),
    };
    if (next.name.length < 3 || !next.email.includes("@")) return;
    localStorage.setItem("wd_uc_participant", JSON.stringify(next));
    setParticipant(next);
    setMessage("");

    fetch("/api/universidade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "participant", participant: next }),
    }).catch(() => undefined);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!participant) {
      setMessage("Identifique-se antes de concluir a avaliação.");
      return;
    }
    if (answered !== questions.length) {
      setMessage(
        "Responda todas as " + String(questions.length) + " questões antes de finalizar.",
      );
      return;
    }

    const correct = questions.reduce(
      (total, question) =>
        total + (answers[question.id] === question.correct ? 1 : 0),
      0,
    );
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    setResult({ score, passed });
    setShowCorrections(true);
    setMessage("");

    try {
      const progress = JSON.parse(localStorage.getItem("wd_uc_progress") || "{}");
      progress["modulo-" + moduleId] = {
        status: passed ? "passed" : "attempted",
        score,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("wd_uc_progress", JSON.stringify(progress));
    } catch {
      // Resultado continua visível mesmo sem localStorage.
    }

    fetch("/api/universidade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "assessment",
        participant,
        journey: "lideranca",
        module_id: "modulo-" + moduleId,
        score,
        passed,
        answers,
      }),
    }).catch(() => undefined);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setShowCorrections(false);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="uc-page">
      <div className="uc-assessment">
        <Link className="uc-back" href="/jornada-lideranca">
          ← Jornada de Liderança
        </Link>

        <section className="uc-inner-hero">
          <span className="uc-kicker">Avaliação · Módulo {moduleId}</span>
          <h1>{title}</h1>
          <p>
            Esta avaliação consolida os pontos centrais do módulo. Responda todas
            as questões. O aproveitamento mínimo para aprovação é de 70%.
          </p>
        </section>

        {result ? (
          <section className="uc-result">
            <span className="uc-kicker">Resultado da avaliação</span>
            <strong>{result.score}%</strong>
            <p>
              {result.passed
                ? "Aprovado. Esta etapa da Jornada de Liderança está concluída."
                : "Você ainda não atingiu os 70%. Revise o conteúdo e faça uma nova tentativa."}
            </p>
            <div className="uc-module-actions">
              <Link className="uc-button uc-button-secondary" href="/jornada-lideranca">
                Voltar à jornada
              </Link>
              {!result.passed ? (
                <button className="uc-button uc-button-primary" type="button" onClick={retry}>
                  Tentar novamente
                </button>
              ) : moduleId === "1" ? (
                <Link className="uc-button uc-button-primary" href="/jornada-lideranca/modulo-2">
                  Seguir para o Módulo 2 →
                </Link>
              ) : (
                <Link className="uc-button uc-button-primary" href="/certificados">
                  Ver certificação →
                </Link>
              )}
            </div>
          </section>
        ) : null}

        {!participant ? (
          <section className="uc-question">
            <span className="uc-kicker">Antes de começar</span>
            <h3>Identifique-se para registrar seu resultado</h3>
            <form onSubmit={saveParticipant}>
              <label className="uc-form-field">
                Nome completo
                <input name="name" minLength={3} required autoComplete="name" />
              </label>
              <label className="uc-form-field">
                E-mail
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <button className="uc-button uc-button-primary" type="submit">
                Salvar e iniciar
              </button>
            </form>
          </section>
        ) : (
          <p style={{ marginTop: 22 }}>
            Participante: <strong>{participant.name}</strong>
          </p>
        )}

        <form onSubmit={submit}>
          {questions.map((question, index) => {
            const chosen = answers[question.id];
            const correctionVisible = showCorrections && chosen != null;
            return (
              <section className="uc-question" key={question.id}>
                <span className="uc-pill">
                  Questão {index + 1} de {questions.length}
                </span>
                <h3>{question.prompt}</h3>
                {question.options.map((option, optionIndex) => {
                  const isCorrect = correctionVisible && optionIndex === question.correct;
                  const isWrongChoice =
                    correctionVisible &&
                    chosen === optionIndex &&
                    optionIndex !== question.correct;
                  return (
                    <label
                      className={[
                        "uc-option",
                        isCorrect ? "is-correct" : "",
                        isWrongChoice ? "is-wrong" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={chosen === optionIndex}
                        disabled={Boolean(result)}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: optionIndex,
                          }))
                        }
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
                {correctionVisible ? (
                  <p className="uc-explanation">
                    <strong>Comentário:</strong> {question.explanation}
                  </p>
                ) : null}
              </section>
            );
          })}

          {message ? <div className="uc-alert">{message}</div> : null}

          {!result ? (
            <div className="uc-submit-row">
              <span>
                {answered} de {questions.length} respondidas
              </span>
              <button
                className="uc-button uc-button-primary"
                type="submit"
                disabled={!participant}
              >
                Finalizar avaliação
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
