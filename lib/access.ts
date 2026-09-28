export type AccessRole = "collaborator" | "administrator";

export type ParticipantSession = {
  role: AccessRole;
  participant: {
    name: string;
    email: string;
  };
};

type ParticipantSessionInput = {
  role: AccessRole;
  name: string;
  email: string;
};

function nameFromEmail(email: string) {
  const localPart = email.split("@", 1)[0] ?? "";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createParticipantSession({
  role,
  name,
  email,
}: ParticipantSessionInput): ParticipantSession {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim() || nameFromEmail(normalizedEmail);

  return {
    role,
    participant: {
      name: normalizedName,
      email: normalizedEmail,
    },
  };
}

export function canContinueAccess({ role, name, email }: ParticipantSessionInput) {
  const normalizedEmail = email.trim();
  const [localPart, domain, ...extraParts] = normalizedEmail.split("@");

  return (
    (role === "collaborator" || role === "administrator") &&
    name.trim().length >= 3 &&
    Boolean(localPart && domain && extraParts.length === 0)
  );
}
