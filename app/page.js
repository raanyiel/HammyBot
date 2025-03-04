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

      <div style={{ maxWidth: "36rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Available Commands:</h2>
        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Role Management</h3>
          <p style={{ fontFamily: "monospace" }}>/role add @user @role</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>Adds a role to a user</p>

          <p style={{ fontFamily: "monospace" }}>/role remove @user @role</p>
          <p style={{ color: "#4b5563" }}>Removes a role from a user</p>
        </div>

        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Moderation Commands</h3>

          <p style={{ fontFamily: "monospace" }}>/purge [amount]</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>Deletes a specified number of messages (1-100)</p>

          <p style={{ fontFamily: "monospace" }}>/warn @user [reason] [anonymous]</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
            Warns a user with a specified reason. Set anonymous to false to identify yourself.
          </p>

          <p style={{ fontFamily: "monospace" }}>/kick @user [reason]</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>Kicks a user from the server</p>

          <p style={{ fontFamily: "monospace" }}>/ban @user [reason] [days]</p>
          <p style={{ color: "#4b5563" }}>Bans a user and optionally deletes their messages (0-7 days)</p>
        </div>

        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Logging Commands</h3>

          <p style={{ fontFamily: "monospace" }}>/logging set #channel</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
            Sets the channel where moderation logs will be sent
          </p>

          <p style={{ fontFamily: "monospace" }}>/logging disable</p>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>Disables logging for the server</p>

          <p style={{ fontFamily: "monospace" }}>/logging status</p>
          <p style={{ color: "#4b5563" }}>Shows the current logging status and channel</p>
        </div>

        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Utility Commands</h3>

          <p style={{ fontFamily: "monospace" }}>/github</p>
          <p style={{ color: "#4b5563" }}>Get a link to the bot's GitHub repository</p>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center", maxWidth: "36rem" }}>
        <p style={{ marginBottom: "0.5rem" }}>
          ⚠️ <strong>Important:</strong> Make sure the bot has the following permissions:
        </p>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "2rem",
            textAlign: "left",
            marginBottom: "1rem",
          }}
        >
          <li>Manage Roles</li>
          <li>Kick Members</li>
          <li>Ban Members</li>
          <li>Manage Messages</li>
          <li>View Channels</li>
          <li>Send Messages</li>
        </ul>
        <p>The bot's role must be higher in the role hierarchy than any roles it needs to manage.</p>
      </div>
    </main>
  )
}

