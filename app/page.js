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
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Discord Role Bot</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Your Discord bot is ready!</p>

      <div style={{ maxWidth: "28rem", marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Available Commands:</h2>
        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "monospace" }}>/role add @user @role</p>
          <p style={{ color: "#4b5563", marginBottom: "1rem" }}>Adds a role to a user</p>

          <p style={{ fontFamily: "monospace" }}>/role remove @user @role</p>
          <p style={{ color: "#4b5563" }}>Removes a role from a user</p>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p>To register commands, run:</p>
        <code
          style={{
            background: "#1a1a1a",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            display: "block",
            marginTop: "0.5rem",
          }}
        >
          npm run register
        </code>
      </div>
    </main>
  )
}

