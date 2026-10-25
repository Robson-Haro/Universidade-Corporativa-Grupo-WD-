"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TRAINING_BASE_URL } from "@/lib/course-data";

type Participant = { name: string; email: string };

export default function ModuleFrame({
  moduleNumber,
  title,
  trainingPath,
}: {
  moduleNumber: 1 | 2 | 3;
  title: string;
  trainingPath: string;
}) {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wd_uc_participant");
      if (saved) setParticipant(JSON.parse(saved));
    } catch {
      // Mantém o conteúdo acessível.
    }
  }, []);

  const trainingUrl = useMemo(() => {
    const url = new URL(trainingPath, TRAINING_BASE_URL);
    url.searchParams.set("universidade", "grupo-wd");
    if (participant?.name) url.searchParams.set("nome", participant.name);
    if (participant?.email) url.searchParams.set("email", participant.email);
    return url.toString();
  }, [participant, trainingPath]);

  return (
    <main className="uc-page" style={{ minHeight: "100vh", paddingTop: 1 }}>
      <header className="uc-embed-toolbar">
        <div className="uc-embed-title">
          <img
            src={TRAINING_BASE_URL + "/grupo-wd.png"}
            alt="Grupo WD"
          />
          <div>
            <small>Universidade Corporativa · Jornada de Liderança</small>
            <strong>Módulo {moduleNumber} · {title}</strong>
          </div>
        </div>

        <div className="uc-embed-actions">
          <select aria-label="Selecionar módulo" value={moduleNumber} onChange={event => router.push("/jornada-lideranca/modulo-" + event.target.value)}>
            <option value={1}>Módulo 1</option><option value={2}>Módulo 2</option><option value={3}>Módulo 3</option>
          </select>
          <Link className="uc-button uc-button-secondary" href="/jornada-lideranca">
            ← Jornada
          </Link>
          <a
            className="uc-button uc-button-secondary"
            href={trainingUrl}
            target="_blank"
            rel="noreferrer"
          >
            Abrir conteúdo em tela cheia
          </a>
          {moduleNumber !== 3 && <Link
            className="uc-button uc-button-primary"
            href={"/avaliacao/" + moduleNumber}
          >
            Ir para avaliação →
          </Link>}
        </div>
      </header>

      <section className="uc-embed-shell">
        <iframe
          className="uc-embed-frame"
          src={trainingUrl}
          title={"Treinamento WD · Módulo " + moduleNumber}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
        />
      </section>
    </main>
  );
}
