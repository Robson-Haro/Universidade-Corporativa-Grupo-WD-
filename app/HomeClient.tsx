"use client";

import Link from "next/link";
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { type AccessRole, canContinueAccess, createParticipantSession } from "@/lib/access";

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
  const [accessRole, setAccessRole] = useState<AccessRole>("collaborator");
  const accessTriggerRef = useRef<HTMLButtonElement>(null);
  const accessModalRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedParticipant = localStorage.getItem("wd_uc_participant");
        if (savedParticipant) setParticipant(JSON.parse(savedParticipant));

        const savedRole = localStorage.getItem("wd_uc_access_role");
        if (savedRole === "collaborator" || savedRole === "administrator") {
          setAccessRole(savedRole);
        }
      } catch {
        // Mantém a experiência disponível mesmo sem armazenamento local.
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!showIdentity) return;

    const frame = window.requestAnimationFrame(() => {
      accessModalRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [showIdentity]);

  function closeIdentity() {
    setShowIdentity(false);
    window.requestAnimationFrame(() => accessTriggerRef.current?.focus());
  }

  function keepFocusInsideDialog(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeIdentity();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      accessModalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([type="hidden"]):not([disabled])',
      ) ?? [],
    ).filter((element) => element.offsetParent !== null);

    const first = focusable[0];
    const last = focusable.at(-1);

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function saveIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "");
    const name = String(data.get("name") || "");

    if (!canContinueAccess({ role: accessRole, name, email })) {
      return;
    }

    const session = createParticipantSession({ role: accessRole, name, email });
    const next = session.participant;

    localStorage.setItem("wd_uc_participant", JSON.stringify(next));
    localStorage.setItem("wd_uc_access_role", session.role);
    setParticipant(next);
    setShowIdentity(false);

    fetch("/api/universidade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "participant", participant: next, role: session.role }),
    }).catch(() => undefined);
  }

  return (
    <main className="wduni-page">
      <div className="wduni-honeycomb-field" aria-hidden="true" />
      <div className="wduni-frosted-pane wduni-frosted-pane-one" aria-hidden="true" />
      <div className="wduni-frosted-pane wduni-frosted-pane-two" aria-hidden="true" />
      <div className="wduni-frosted-pane wduni-frosted-pane-three" aria-hidden="true" />
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

        <button
          ref={accessTriggerRef}
          className="wduni-user"
          type="button"
          onClick={() => setShowIdentity(true)}
        >
          <span className="wduni-user-avatar">
            {participant?.name?.slice(0, 1).toUpperCase() || "WD"}
          </span>
          <span>
            <strong>{participant ? "Olá, " + participant.name.split(" ")[0] : "Acessar"}</strong>
            <small>{participant ? "Juntos evoluímos" : "Administradores e colaboradores"}</small>
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
            src="/images/hero-facilities-final.jpg"
            alt="Equipe de facilities, vigilância, portaria e limpeza do Grupo WD"
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
          onMouseDown={closeIdentity}
        >
          <form
            ref={accessModalRef}
            className="uc-modal wduni-access-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wduni-access-title"
            aria-describedby="wduni-access-description"
            onSubmit={saveIdentity}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={keepFocusInsideDialog}
          >
            <button
              className="uc-modal-close"
              type="button"
              onClick={closeIdentity}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="uc-kicker">Área de entrada</span>
            <h2 id="wduni-access-title">Escolha como entrar</h2>
            <p id="wduni-access-description">
              Selecione seu perfil e informe os dados para continuar. A validação corporativa
              será integrada nesta área.
            </p>

            <div className="wduni-access-roles" role="group" aria-label="Perfil de acesso">
              <button
                type="button"
                className={accessRole === "collaborator" ? "is-selected" : ""}
                aria-pressed={accessRole === "collaborator"}
                onClick={() => setAccessRole("collaborator")}
              >
                <strong>Colaborador</strong>
                <small>Continuar minha jornada</small>
              </button>
              <button
                type="button"
                className={accessRole === "administrator" ? "is-selected" : ""}
                aria-pressed={accessRole === "administrator"}
                onClick={() => setAccessRole("administrator")}
              >
                <strong>Administrador</strong>
                <small>Perfil de gestão</small>
              </button>
            </div>

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
              E-mail corporativo
              <input
                name="email"
                type="email"
                required
                defaultValue={participant?.email || ""}
                autoComplete="email"
              />
            </label>
            <button className="uc-button uc-button-primary" type="submit">
              Continuar como {accessRole === "collaborator" ? "colaborador" : "administrador"}
            </button>
          </form>
        </div>
      ) : null}
    </main>
  );
}
