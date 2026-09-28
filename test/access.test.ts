import assert from "node:assert/strict";
import test from "node:test";

import { canContinueAccess, createParticipantSession } from "../lib/access.ts";

test("creates a collaborator session with normalized identity data", () => {
  const session = createParticipantSession({
    role: "collaborator",
    name: "  Ana Silva  ",
    email: " ANA.SILVA@EXAMPLE.COM ",
  });

  assert.deepEqual(session, {
    role: "collaborator",
    participant: {
      name: "Ana Silva",
      email: "ana.silva@example.com",
    },
  });
});

test("derives an administrator greeting from the corporate email when no name is supplied", () => {
  const session = createParticipantSession({
    role: "administrator",
    name: "",
    email: "gestao.treinamento@example.com",
  });

  assert.deepEqual(session, {
    role: "administrator",
    participant: {
      name: "Gestao Treinamento",
      email: "gestao.treinamento@example.com",
    },
  });
});

test("allows either selected profile to continue with identity data and no password", () => {
  assert.equal(
    canContinueAccess({
      role: "collaborator",
      name: "Ana Silva",
      email: "ana.silva@example.com",
    }),
    true,
  );

  assert.equal(
    canContinueAccess({
      role: "administrator",
      name: "Paulo Souza",
      email: "paulo.souza@example.com",
    }),
    true,
  );
});
