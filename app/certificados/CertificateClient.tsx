"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { TRAINING_BASE_URL } from "@/lib/course-data";

type Participant = { name: string; email: string };
type ProgressMap = Record<
  string,
  { status: string; score?: number; updated_at?: string }
>;

function certificateCode() {
  const base =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(16).slice(2, 10);
  return "WD-LID-" + new Date().getFullYear() + "-" + base.toUpperCase();
}

function safeFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CertificateClient() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [code, setCode] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      const savedParticipant = localStorage.getItem("wd_uc_participant");
      const savedProgress = localStorage.getItem("wd_uc_progress");
      const savedCode = localStorage.getItem("wd_uc_certificate_lideranca");
      if (savedParticipant) setParticipant(JSON.parse(savedParticipant));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      if (savedCode) setCode(savedCode);
    } catch {
      // A página continua exibindo o status.
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
          remote[item.module_id] = item;
        }
        setProgress((current) => {
          const next = { ...current, ...remote };
          localStorage.setItem("wd_uc_progress", JSON.stringify(next));
          return next;
        });

        const remoteCode = data.certificates?.[0]?.certificate_code;
        if (remoteCode && !code) {
          setCode(remoteCode);
          localStorage.setItem("wd_uc_certificate_lideranca", remoteCode);
        }
      })
      .catch(() => undefined);
  }, [participant, code]);

  const eligible = useMemo(
    () =>
      progress["modulo-1"]?.status === "passed" &&
      progress["modulo-2"]?.status === "passed",
    [progress],
  );

  async function createPdf() {
    if (!participant || !eligible) return;
    setGenerating(true);

    try {
      const finalCode = code || certificateCode();
      if (!code) {
        setCode(finalCode);
        localStorage.setItem("wd_uc_certificate_lideranca", finalCode);
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const w = 297;
      const h = 210;

      doc.setFillColor(28, 32, 35);
      doc.rect(0, 0, w, h, "F");

      doc.setFillColor(38, 43, 47);
      doc.circle(264, 18, 68, "F");
      doc.setFillColor(23, 27, 30);
      doc.circle(31, 196, 48, "F");

      doc.setDrawColor(194, 161, 84);
      doc.setLineWidth(0.75);
      doc.roundedRect(10, 10, w - 20, h - 20, 4, 4, "S");
      doc.setDrawColor(108, 94, 62);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, 14, w - 28, h - 28, 3, 3, "S");

      doc.setTextColor(219, 189, 116);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("GRUPO WD / RAMOS CONSULTORIA", w / 2, 29, {
        align: "center",
      });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("CERTIFICADO", w / 2, 51, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("DE CONCLUSÃO", w / 2, 60, { align: "center" });

      doc.setTextColor(195, 200, 202);
      doc.setFontSize(10);
      doc.text("Certificamos que", w / 2, 74, { align: "center" });

      doc.setTextColor(227, 199, 127);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.text(participant.name, w / 2, 88, { align: "center" });

      doc.setTextColor(230, 233, 234);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.text(
        "concluiu a Jornada de aprimoramento e qualificação da liderança do Grupo WD.",
        w / 2,
        101,
        { align: "center" },
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Jornada de Liderança · Módulos 1 e 2", w / 2, 110, {
        align: "center",
      });

      doc.setTextColor(219, 189, 116);
      doc.setFontSize(8);
      doc.text("CONTEÚDO PROGRAMÁTICO", w / 2, 123, {
        align: "center",
      });

      doc.setTextColor(206, 211, 213);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      doc.text(
        "Autoconhecimento • Estilos de Liderança • DISC • Decisões • Leitura de Cenário • Comunicação e Influência",
        w / 2,
        131,
        { align: "center" },
      );
      doc.text(
        "Liderança Situacional • Segurança Psicológica • Leitura de Sentimentos • Qualidade na Origem • Excelência Operacional",
        w / 2,
        137,
        { align: "center" },
      );

      doc.setDrawColor(142, 148, 151);
      doc.line(45, 162, 111, 162);
      doc.line(186, 162, 252, 162);

      doc.setTextColor(236, 238, 239);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Grupo WD · Ramos Consultoria", 78, 169, {
        align: "center",
      });
      doc.text("Psi Robson Ramos · Instrutor", 219, 169, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(178, 184, 187);
      doc.setFontSize(7.3);
      const date = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date());

      doc.text("Emitido em " + date, 22, 186);
      doc.text("Código de validação: " + finalCode, w - 22, 186, {
        align: "right",
      });

      doc.save(
        "Certificado-Jornada-Lideranca-" +
          safeFilename(participant.name) +
          ".pdf",
      );

      fetch("/api/universidade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "certificate",
          participant,
          journey: "lideranca",
          certificate_code: finalCode,
          module_1_score: progress["modulo-1"]?.score || 0,
          module_2_score: progress["modulo-2"]?.score || 0,
        }),
      }).catch(() => undefined);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="uc-page" style={{ minHeight: "100vh", paddingTop: 1 }}>
      <div className="uc-certificate-layout">
        <section className="uc-certificate-preview">
          <div className="uc-cert-logos">
            <img src={TRAINING_BASE_URL + "/grupo-wd.png"} alt="Grupo WD" />
            <img
              src={TRAINING_BASE_URL + "/ramos-consultoria.png"}
              alt="Ramos Consultoria"
            />
          </div>

          <span className="uc-kicker" style={{ marginTop: 34 }}>
            Certificado de conclusão
          </span>
          <h2>Jornada de Liderança</h2>
          <p>Certificamos que</p>
          <p className="uc-cert-name">
            {participant?.name || "Nome do participante"}
          </p>
          <p>
            concluiu a Jornada de aprimoramento e qualificação da liderança do
            Grupo WD.
          </p>
          <p>
            <strong>Módulo 1:</strong> Se conhecendo para liderar
            <br />
            <strong>Módulo 2:</strong> Comunicação e Excelência
          </p>
          {code ? (
            <p>
              Código de validação: <strong>{code}</strong>
            </p>
          ) : null}
        </section>

        <aside className="uc-certificate-panel">
          <Link className="uc-back" href="/jornada-lideranca">
            ← Jornada de Liderança
          </Link>
          <span className="uc-kicker">Certificação</span>
          <h1>Seu certificado</h1>
          <p>
            O certificado segue a linguagem do modelo final criado para o Grupo
            WD: identificação do participante, jornada, conteúdo programático,
            realização, instrutor e código individual de validação.
          </p>

          {!participant ? (
            <div className="uc-alert">
              Identifique-se na página inicial da Universidade antes de emitir o
              certificado.
            </div>
          ) : !eligible ? (
            <div className="uc-alert">
              Certificado bloqueado. É necessário atingir pelo menos 70% nas
              avaliações dos Módulos 1 e 2.
            </div>
          ) : (
            <div className="uc-result">
              <span className="uc-kicker">Requisitos atendidos</span>
              <strong>2/2</strong>
              <p>
                Os dois módulos foram aprovados. O certificado A4 paisagem está
                liberado para emissão.
              </p>
            </div>
          )}

          <div className="uc-score-summary">
            <div>
              <span>Módulo 1</span>
              <strong>
                {progress["modulo-1"]?.score != null
                  ? String(progress["modulo-1"].score) + "%"
                  : "Pendente"}
              </strong>
            </div>
            <div>
              <span>Módulo 2</span>
              <strong>
                {progress["modulo-2"]?.score != null
                  ? String(progress["modulo-2"].score) + "%"
                  : "Pendente"}
              </strong>
            </div>
          </div>

          <button
            className="uc-button uc-button-primary"
            type="button"
            disabled={!eligible || !participant || generating}
            onClick={createPdf}
            style={{
              width: "100%",
              marginTop: 20,
              opacity: !eligible || !participant ? 0.45 : 1,
            }}
          >
            {generating ? "Gerando certificado..." : "Emitir certificado em PDF"}
          </button>
        </aside>
      </div>
    </main>
  );
}
