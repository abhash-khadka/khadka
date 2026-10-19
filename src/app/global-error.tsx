"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must define its own html and body tags — it replaces the root layout
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          textAlign: "center",
          background: "#050505",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0, color: "#c9a84c" }}>Something went wrong</h1>
        <p style={{ maxWidth: "28rem", color: "#9ca3af", fontSize: "0.95rem" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            background: "#c9a84c",
            color: "#000000",
            fontWeight: 700,
            padding: "0.75rem 2rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "0.85rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
