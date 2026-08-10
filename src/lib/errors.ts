export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const maybe = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
      issues?: Array<{ message?: string }>;
    };

    // Postgres unique_violation — common when reusing a slug
    if (maybe.code === "23505") {
      const detail = typeof maybe.details === "string" ? maybe.details : "";
      if (detail.includes("slug") || (typeof maybe.message === "string" && maybe.message.includes("slug"))) {
        return "A record with this slug already exists. Choose a different slug.";
      }
      return "A record with this value already exists.";
    }

    if (typeof maybe.message === "string" && maybe.message.trim()) {
      return maybe.message;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (Array.isArray(maybe.issues) && maybe.issues[0]?.message) {
      return maybe.issues[0].message;
    }

    const parts = [maybe.details, maybe.hint, maybe.code]
      .filter((part) => typeof part === "string" && part.trim())
      .map(String);

    if (parts.length) return parts.join(" — ");
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
