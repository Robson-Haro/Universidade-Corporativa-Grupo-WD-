"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { futureTracks } from "@/lib/course-data";

type Participant = { name: string; email: string };
type ProgressItem = { status: string; score?: number; updated_at?: string };
type ProgressMap = Record<string, ProgressItem>;

const TRAINING_BASE = "https://treinamento-wd-1.vercel.app";

export default function HomeClient() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [showIdentity, setShowIdentity] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const savedParticipant = localStorage.getItem("wd_uc_participant");
      const savedProgress = localStorage.getItem("wd_uc_progress");
      if (savedParticipant) setParticipant(JSON.parse(savedParticipant));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
    } catch {
      // Mantém a experiência funcional mesmo sem armazenamento local.
    }
  }, []);

  useEffect(() => {
    if (!participant?.email) return;
    fetch("/api/universidade?email=" + encodeURIComponent(participant.email))
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.progress?.length) return;
        const remote: ProgressMap = {};
        for (const item of data.progress as Array<{
          module_id: string;
          status: string;
          score?: number;
          updated_at?: string;
        }>) {
          remote[item.module_id] = {
            status: item.status,
            score: item.score,
            updated_at: item.updated_at,
          };
        }
        setProgress((current) => {
          const next = { ...current, ...remote };
          localStorage.setItem("wd_uc_progress", JSON.stringify(next));
          return next;
        });
      })
      .catch(() => undefined);
  }, [participant]);

  const completed = useMemo(
    () =>
      Object.values(progress).filter(
        (item) => item.status === "passed" || item.status === "completed",
      ).length,
    [progress],
  );

  const searchableTracks = [
    {
      id: "lideranca",
      number: "01",
      title: "Jornada de Liderança",
      description:
        "Autoconhecimento, comunicação e excelência para quem lidera pessoas e operações.",
      active: true,
    },
    ...futureTracks.map((track) => ({ ...track, active: false })),
  ].filter((track) =>
    (track.title + " " + track.description)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function saveIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim().toLowerCase(),
    };
    if (next.name.length < 3 || !next.email.includes("@")) return;
    localStorage.setItem("wd_uc_participant", JSON.stringify(next));
    setParticipant(next);
    setShowIdentity(false);

    fetch("/api/universidade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "participant", participant: next }),
    }).catch(() => undefined);
  }

  return (
    <main className="uc-page">
      <div className="uc-bg-hex uc-bg-hex-one" aria-hidden="true" />
      <div className="uc-bg-hex uc-bg-hex-two" aria-hidden="true" />

      <header className="uc-header">
        <Link href="/" className="uc-brand" aria-label="Universidade Corporativa Grupo WD">
          <img src={TRAINING_BASE + "/grupo-wd.png"} alt="Grupo WD" />
          <span>
            <strong>Universidade Corporativa</strong>
            <small>Grupo WD</small>
          </span>
        </Link>

        <nav className="uc-nav" aria-label="Navegação principal">
          <Link href="/" className="is-active">Início</Link>
          <a href="#trilhas">Trilhas</a>
          <Link href="/jornada-lideranca">Meus Cursos</Link>
          <Link href="/certificados">Certificados</Link>
        </nav>

        <button
          className="uc-profile"
          type="button"
          onClick={() => setShowIdentity(true)}
        >
          <span className="uc-avatar">
            {participant?.name?.slice(0, 1).toUpperCase() || "WD"}
          </span>
          <span className="uc-profile-copy">
            <small>{participant ? "Meu perfil" : "Acompanhar progresso"}</small>
            <strong>{participant?.name || "Identificar-se"}</strong>
          </span>
        </button>
      </header>

      <section className="uc-hero">
        <div className="uc-hero-copy">
          <span className="uc-kicker">Jornada do Conhecimento</span>
          <h1>
            Conhecimento que melhora a rotina.
            <span> Desenvolvimento que transforma pessoas.</span>
          </h1>
          <p>
            Um espaço único para aprender, praticar, acompanhar sua evolução e
            construir novos padrões de excelência em todas as áreas do Grupo WD.
          </p>

          <div className="uc-hero-actions">
            <Link className="uc-button uc-button-primary" href="/jornada-lideranca">
              Continuar aprendendo <span>→</span>
            </Link>
            <a className="uc-button uc-button-secondary" href="#trilhas">
              Explorar trilhas
            </a>
          </div>

          <div className="uc-stats">
            <div>
              <strong>2</strong>
              <span>módulos disponíveis</span>
            </div>
            <div>
              <strong>{completed}</strong>
              <span>etapas concluídas</span>
            </div>
            <div>
              <strong>1</strong>
              <span>jornada ativa</span>
            </div>
          </div>
        </div>

        <div className="uc-hero-visual">
          <div className="uc-photo-card">
            <img
              src={TRAINING_BASE + "/images/grupo-de-trabalho.webp"}
              alt="Profissionais do Grupo WD em uma atividade de desenvolvimento"
            />
            <div className="uc-photo-overlay">
              <span>Aprender · Aplicar · Evoluir</span>
              <strong>Todos fazem parte da Jornada do Conhecimento.</strong>
            </div>
          </div>
          <div className="uc-floating-hex uc-floating-a">Pessoas</div>
          <div className="uc-floating-hex uc-floating-b">Cliente</div>
          <div className="uc-floating-hex uc-floating-c">Excelência</div>
        </div>
      </section>

      <section className="uc-dashboard-strip" aria-label="Painel rápido">
        <div className="uc-greeting">
          <span>
            Olá{participant ? ", " + participant.name.split(" ")[0] : ""}
          </span>
          <strong>Onde você quer evoluir hoje?</strong>
        </div>
        <label className="uc-search">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar trilhas e cursos"
            aria-label="Buscar trilhas e cursos"
          />
        </label>
      </section>

      <section id="trilhas" className="uc-section">
        <div className="uc-section-heading">
          <div>
            <span className="uc-kicker">Mapa de aprendizagem</span>
            <h2>Trilhas em formato de colmeia</h2>
          </div>
          <p>
            Cada célula representa uma jornada de desenvolvimento. A Jornada de
            Liderança já está disponível; as demais trilhas ficam preparadas para
            os próximos conteúdos da Universidade.
          </p>
        </div>

        <div className="uc-honeycomb">
          {searchableTracks.map((track, index) => {
            const content = (
              <>
                <span className="uc-hex-number">{track.number}</span>
                <span className="uc-hex-status">
                  {track.active ? "Disponível" : "Em preparação"}
                </span>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <span className="uc-hex-link">
                  {track.active ? "Acessar jornada →" : "Em breve"}
                </span>
              </>
            );

            const className = [
              "uc-hex-card",
              track.active ? "is-active" : "is-muted",
              index % 2 ? "is-offset" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return track.active ? (
              <Link key={track.id} href="/jornada-lideranca" className={className}>
                {content}
              </Link>
            ) : (
              <div key={track.id} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="uc-section uc-continue">
        <div className="uc-section-heading">
          <div>
            <span className="uc-kicker">Continue aprendendo</span>
            <h2>Jornada de Liderança</h2>
          </div>
          <Link className="uc-inline-link" href="/jornada-lideranca">
            Ver jornada completa →
          </Link>
        </div>

        <div className="uc-course-grid">
          <article className="uc-course-card">
            <span className="uc-pill">Módulo 1</span>
            <h3>Se conhecendo para liderar</h3>
            <p>Autoconhecimento, DISC, decisões, estratégia e responsabilidade.</p>
            <div className="uc-progress">
              <span
                style={{
                  width:
                    progress["modulo-1"]?.status === "passed"
                      ? "100%"
                      : progress["modulo-1"]
                        ? "62%"
                        : "12%",
                }}
              />
            </div>
            <Link href="/jornada-lideranca/modulo-1">Acessar módulo</Link>
          </article>

          <article className="uc-course-card">
            <span className="uc-pill">Módulo 2</span>
            <h3>Comunicação e Excelência</h3>
            <p>
              Comunicação, influência, segurança psicológica e excelência operacional.
            </p>
            <div className="uc-progress">
              <span
                style={{
                  width:
                    progress["modulo-2"]?.status === "passed"
                      ? "100%"
                      : progress["modulo-2"]
                        ? "62%"
                        : "6%",
                }}
              />
            </div>
            <Link href="/jornada-lideranca/modulo-2">Acessar módulo</Link>
          </article>

          <article className="uc-course-card uc-course-card-dark">
            <span className="uc-pill">Certificação</span>
            <h3>Jornada de Liderança</h3>
            <p>
              Conclua os dois módulos e as avaliações para liberar seu certificado.
            </p>
            <Link href="/certificados">Ver certificados</Link>
          </article>
        </div>
      </section>

      <section className="uc-banner">
        <div>
          <span className="uc-kicker">Universidade Corporativa Grupo WD</span>
          <h2>Aprender para fazer melhor.</h2>
          <p>
            A Universidade nasce para transformar conhecimento em comportamento
            observável, padrão de execução e desenvolvimento contínuo.
          </p>
        </div>
        <div className="uc-banner-logos">
          <img src={TRAINING_BASE + "/grupo-wd.png"} alt="Grupo WD" />
          <span>×</span>
          <img src={TRAINING_BASE + "/ramos-consultoria.png"} alt="Ramos Consultoria" />
        </div>
      </section>

      <footer className="uc-footer">
        <div className="uc-footer-brand">
          <img src={TRAINING_BASE + "/grupo-wd.png"} alt="" />
          <span>Universidade Corporativa Grupo WD</span>
        </div>
        <p>Jornada do Conhecimento · Aprender · Aplicar · Evoluir</p>
      </footer>

      {showIdentity ? (
        <div
          className="uc-modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowIdentity(false)}
        >
          <form
            className="uc-modal"
            onSubmit={saveIdentity}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="uc-modal-close"
              type="button"
              onClick={() => setShowIdentity(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="uc-kicker">Sua Jornada do Conhecimento</span>
            <h2>Identifique-se para acompanhar sua evolução</h2>
            <p>
              Use nome completo e e-mail. Essas informações serão usadas no
              histórico de aprendizagem, nas avaliações e nos certificados.
            </p>
            <label>
              Nome completo
              <input
                name="name"
                required
                minLength={3}
                defaultValue={participant?.name || ""}
                autoComplete="name"
              />
            </label>
            <label>
              E-mail
              <input
                name="email"
                type="email"
                required
                defaultValue={participant?.email || ""}
                autoComplete="email"
              />
            </label>
            <button className="uc-button uc-button-primary" type="submit">
              Salvar identificação
            </button>
          </form>
        </div>
      ) : null}
    </main>
  );
}
