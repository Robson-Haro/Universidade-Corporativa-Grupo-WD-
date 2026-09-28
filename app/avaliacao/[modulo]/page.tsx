import { notFound } from "next/navigation";
import AssessmentClient from "../AssessmentClient";

export default async function AvaliacaoPage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  if (modulo !== "1" && modulo !== "2") notFound();

  return <AssessmentClient moduleId={modulo} />;
}
