export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Discord Moderation Bot</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Your Discord bot is ready!</p>
      <p style={{ marginBottom: "0.5rem" }}>Commands are registered automatically on deployment.</p>
      <p style={{ marginBottom: "2rem" }}>To manually register commands, visit:</p>
      <code
        style={{
          background: "#1a1a1a",
          color: "white",
          padding: "0.5rem",
          borderRadius: "0.25rem",
          marginBottom: "2rem",
        }}
      >
        /api/discord/register
      </code>
    </main>
  )
}

