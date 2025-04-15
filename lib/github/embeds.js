export function createGithubEventEmbed(event, payload) {
  const embed = {
    title: "",
    description: "",
    url: "",
    color: 0x2b3137, // GitHub dark color
    author: {
      name: "",
      url: "",
      icon_url: "",
    },
    footer: {
      text: "GitHub",
    },
    timestamp: new Date().toISOString(),
    fields: [],
  }

  // Common author setup
  if (payload.sender) {
    embed.author.name = payload.sender.login
    embed.author.url = payload.sender.html_url
    embed.author.icon_url = payload.sender.avatar_url
  }

  // Set up embed based on event type
  switch (event) {
    case "push":
      const branch = payload.ref.replace("refs/heads/", "")
      const commits = payload.commits.slice(0, 5) // Limit to 5 commits

      embed.title = `[${payload.repository.name}] ${commits.length} new commit${commits.length === 1 ? "" : "s"} to ${branch}`
      embed.url = payload.compare
      embed.description = commits
        .map((commit) => {
          const message = commit.message.split("\n")[0].substring(0, 50) + (commit.message.length > 50 ? "..." : "")
          return `[\`${commit.id.substring(0, 7)}\`](${commit.url}) ${message} - ${commit.author.username}`
        })
        .join("\n")

      if (payload.commits.length > 5) {
        embed.description += `\n... and ${payload.commits.length - 5} more commits`
      }

      embed.color = 0x24292e // GitHub dark
      break

    case "pull_request":
      const action = payload.action
      const pr = payload.pull_request

      embed.title = `[${payload.repository.name}] Pull request ${action}: ${pr.title}`
      embed.url = pr.html_url
      embed.description = pr.body ? pr.body.substring(0, 200) + (pr.body.length > 200 ? "..." : "") : ""

      embed.fields.push(
        { name: "Status", value: pr.state, inline: true },
        { name: "Merged", value: pr.merged ? "Yes" : "No", inline: true },
      )

      if (action === "opened" || action === "reopened") {
        embed.color = 0x2cbe4e // Green
      } else if (action === "closed" && pr.merged) {
        embed.color = 0x6f42c1 // Purple for merged
      } else if (action === "closed") {
        embed.color = 0xcb2431 // Red for closed without merge
      }
      break

    case "issues":
      const issue = payload.issue

      embed.title = `[${payload.repository.name}] Issue ${payload.action}: ${issue.title}`
      embed.url = issue.html_url
      embed.description = issue.body ? issue.body.substring(0, 200) + (issue.body.length > 200 ? "..." : "") : ""

      embed.fields.push({ name: "Status", value: issue.state, inline: true })

      if (payload.action === "opened" || payload.action === "reopened") {
        embed.color = 0x2cbe4e // Green
      } else if (payload.action === "closed") {
        embed.color = 0xcb2431 // Red
      }
      break

    case "release":
      const release = payload.release

      embed.title = `[${payload.repository.name}] Release ${payload.action}: ${release.name || release.tag_name}`
      embed.url = release.html_url
      embed.description = release.body ? release.body.substring(0, 200) + (release.body.length > 200 ? "..." : "") : ""

      embed.color = 0xf1e05a // Yellow
      break

    default:
      embed.title = `[${payload.repository.name}] ${event} event received`
      embed.url = payload.repository.html_url
      embed.color = 0x2b3137 // GitHub dark color
  }

  return embed
}
