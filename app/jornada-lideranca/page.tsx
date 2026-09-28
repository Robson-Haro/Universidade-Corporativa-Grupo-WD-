"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { leadershipModules } from "@/lib/course-data";

type ProgressMap = Record<string, { status: string; score?: number }>;

export default function JornadaLiderancaPage() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wd_uc_progress");
      if (saved) setProgress(JSON.parse(saved));
    } catch {
      // A jornada continua disponível.
    }
  }, []);

  return (
    <main className="uc-page">
      <div className="uc-inner">
        <Link className="uc-back" href="/">
          ← Universidade Corporativa
        </Link>

        <section className="uc-inner-hero">
          <span className="uc-kicker">Jornada do Conhecimento · Trilha ativa</span>
          <h1>Jornada de Liderança</h1>
          <p>
            O TreinamentoWD1 passa a fazer parte da Universidade Corporativa como
            uma jornada estruturada em dois módulos independentes. Cada módulo
            mantém seu conteúdo original e recebe uma avaliação própria. A
            certificação é liberada quando os dois módulos forem aprovados.
          </p>
        </section>

        <section className="uc-module-grid" aria-label="Módulos da Jornada de Liderança">
          {leadershipModules.map((module) => {
            const current = progress[module.id];
            const passed = current?.status === "passed";
            return (
              <article className="uc-module-panel" key={module.id}>
                <span className="uc-pill">Módulo {module.number}</span>
                <h2>{module.title}</h2>
                <p>
                  <strong>{module.subtitle}</strong>
                </p>
                <p>{module.description}</p>

                <ul className="uc-topic-list">
                  {module.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>

                <p>
                  <strong>Status:</strong>{" "}
                  {passed
                    ? "Avaliação aprovada · " + String(current.score || 0) + "%"
                    : current
                      ? "Avaliação realizada · " + String(current.score || 0) + "%"
                      : "Conteúdo disponível"}
                </p>

                <div className="uc-module-actions">
                  <Link
                    className="uc-button uc-button-primary"
                    href={"/jornada-lideranca/" + module.id}
                  >
                    Entrar no módulo
                  </Link>
                  <Link
                    className="uc-button uc-button-secondary"
                    href={"/avaliacao/" + module.number}
                  >
                    {passed ? "Rever avaliação" : "Fazer avaliação"}
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        <section className="uc-course-grid" style={{ marginTop: 24 }}>
          <article className="uc-course-card uc-course-card-dark">
            <span className="uc-pill">Etapa final</span>
            <h3>Certificado da Jornada</h3>
            <p>
              Aprovação mínima de 70% nas avaliações do Módulo 1 e do Módulo 2.
            </p>
            <Link href="/certificados">Acessar certificação →</Link>
          </article>

          <article className="uc-course-card">
            <span className="uc-pill">Resultado · Módulo 1</span>
            <h3>
              {progress["modulo-1"]?.score != null
                ? String(progress["modulo-1"].score) + "%"
                : "Pendente"}
            </h3>
            <p>Se conhecendo para liderar.</p>
            <Link href="/avaliacao/1">Abrir avaliação</Link>
          </article>

          <article className="uc-course-card">
            <span className="uc-pill">Resultado · Módulo 2</span>
            <h3>
              {progress["modulo-2"]?.score != null
                ? String(progress["modulo-2"].score) + "%"
                : "Pendente"}
            </h3>
            <p>Comunicação e Excelência.</p>
            <Link href="/avaliacao/2">Abrir avaliação</Link>
          </article>
        </section>
      </div>
    </main>
  );
}
