"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Participant = { name: string; email: string };

const TRAINING_BASE = "https://treinamento-wd-1.vercel.app";

const rows = [
  { title: "Trilhas em destaque", count: 6, firstActive: true },
  { title: "Desenvolvimento Profissional", count: 6 },
  { title: "Saúde, Segurança e Qualidade", count: 6 },
  { title: "Cultura e Pessoas", count: 6 },
  { title: "Tecnologia e Inovação", count: 6 },
];

export default function HomeClient() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [showIdentity, setShowIdentity] = useState(false);

  useEffect(() => {
    try {
      const savedParticipant = localStorage.getItem("wd_uc_participant");
      if (savedParticipant) setParticipant(JSON.parse(savedParticipant));
    } catch {
      // Mantém a experiência disponível mesmo sem armazenamento local.
    }
  }, []);

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
    <main className="wduni-page">
      <div className="wduni-ambient wduni-ambient-left" aria-hidden="true" />
      <div className="wduni-ambient wduni-ambient-right" aria-hidden="true" />

      <header className="wduni-topbar">
        <Link href="/" className="wduni-brand">
          <img src={TRAINING_BASE + "/grupo-wd.png"} alt="Grupo WD" />
          <span>
            <strong>GRUPO WD</strong>
            <small>UNIVERSIDADE CORPORATIVA</small>
          </span>
        </Link>

        <nav className="wduni-nav" aria-label="Navegação principal">
          <Link className="is-active" href="/">⌂ <span>Início</span></Link>
          <a href="#trilhas">◇ <span>Trilhas</span></a>
          <Link href="/jornada-lideranca">▣ <span>Meus Cursos</span></Link>
          <Link href="/certificados">◎ <span>Certificados</span></Link>
          <a href="#trilhas">⌕ <span>Buscar</span></a>
        </nav>

        <button className="wduni-user" type="button" onClick={() => setShowIdentity(true)}>
          <span className="wduni-user-avatar">
            {participant?.name?.slice(0, 1).toUpperCase() || "WD"}
          </span>
          <span>
            <strong>{participant ? "Olá, " + participant.name.split(" ")[0] : "Olá"}</strong>
            <small>Juntos evoluímos</small>
          </span>
          <span className="wduni-chevron">⌄</span>
        </button>
      </header>

      <section className="wduni-hero">
        <div className="wduni-hero-copy">
          <span className="wduni-eyebrow">UNIVERSIDADE CORPORATIVA</span>
          <h1>Grupo WD</h1>
          <p>Conhecimento que protege. Desenvolvimento que transforma.</p>

          <div className="wduni-actions">
            <Link className="wduni-btn wduni-btn-dark" href="/jornada-lideranca">
              ▶ <span>Continuar</span>
            </Link>
            <a className="wduni-btn wduni-btn-light" href="#trilhas">
              ◌ <span>Ver trilha</span>
            </a>
          </div>

          <div className="wduni-mini-values">
            <span>PESSOAS</span>
            <span>PROCESSOS</span>
            <span>SEGURANÇA</span>
            <span>UM FUTURO MAIS FORTE</span>
          </div>
        </div>

        <div className="wduni-hero-image">
          <img
            src={TRAINING_BASE + "/images/grupo-de-trabalho.webp"}
            alt="Profissionais em atividade de desenvolvimento"
          />
          <div className="wduni-image-caption">
            <span>PESSOAS</span>
            <span>IDEIAS</span>
            <span>APRENDIZAGEM</span>
            <span>RESULTADOS</span>
          </div>
        </div>

        <aside className="wduni-feature">
          <span className="wduni-feature-tag">TREINAMENTO EM DESTAQUE</span>
          <h2>Jornada do <strong>Conhecimento</strong></h2>
          <p>
            Aprendizado para todos os colaboradores. Mais conhecimento, mais oportunidades
            e um futuro melhor para todos.
          </p>
          <Link className="wduni-feature-btn" href="/jornada-lideranca">
            Comece agora <span>→</span>
          </Link>
          <div className="wduni-feature-quote">
            <span>LÍDERES</span>
            <span>CONSTROEM</span>
            <span>PESSOAS</span>
            <span>QUE VÃO MAIS LONGE</span>
          </div>
        </aside>
      </section>

      <section id="trilhas" className="wduni-learning-area">
        {rows.map((row, rowIndex) => (
          <div className="wduni-course-section" key={row.title}>
            <div className="wduni-section-title">
              <h2>{row.title}</h2>
              <span>→</span>
            </div>

            <div className="wduni-hex-row">
              {Array.from({ length: row.count }).map((_, index) => {
                const active = rowIndex === 0 && index === 0;

                if (active) {
                  return (
                    <Link
                      key={"active-" + index}
                      href="/jornada-lideranca"
                      className="wduni-course-hex wduni-course-active"
                    >
                      <div className="wduni-course-image">
                        <img
                          src={TRAINING_BASE + "/images/grupo-de-trabalho.webp"}
                          alt=""
                        />
                      </div>
                      <div className="wduni-course-copy">
                        <strong>Jornada de Liderança</strong>
                        <div className="wduni-progress">
                          <span style={{ width: "18%" }} />
                        </div>
                        <small>Disponível</small>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div className="wduni-course-hex wduni-course-soon" key={row.title + "-" + index}>
                    <div className="wduni-lock">⌑</div>
                    <strong>Curso em breve</strong>
                    <small>Novos conteúdos serão liberados aqui</small>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <aside className="wduni-side-quote">
        <span className="wduni-quote-mark">“</span>
        <p>
          PESSOAS<br />
          QUE APRENDEM<br />
          HOJE,<br />
          CONSTROEM<br />
          UM AMANHÃ<br />
          EXTRAORDINÁRIO.
        </p>
        <div />
        <strong>GRUPO WD</strong>
        <small>JUNTOS EVOLUÍMOS SEMPRE</small>
      </aside>

      <footer className="wduni-footer">
        <div>
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
              Use nome completo e e-mail. Essas informações serão usadas no histórico
              de aprendizagem, nas avaliações e nos certificados.
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
