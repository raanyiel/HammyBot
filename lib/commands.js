// Define the slash commands for the bot
export const ROLE_COMMAND = {
  name: "role",
  description: "Manage roles for users",
  options: [
    {
      type: 1, // SUB_COMMAND
      name: "add",
      description: "Add a role to a user",
      options: [
        {
          type: 6, // USER
          name: "user",
          description: "The user to add the role to",
          required: true,
        },
        {
          type: 8, // ROLE
          name: "role",
          description: "The role to add",
          required: true,
        },
      ],
    },
    {
      type: 1, // SUB_COMMAND
      name: "remove",
      description: "Remove a role from a user",
      options: [
        {
          type: 6, // USER
          name: "user",
          description: "The user to remove the role from",
          required: true,
        },
        {
          type: 8, // ROLE
          name: "role",
          description: "The role to remove",
          required: true,
        },
      ],
    },
  ],
}

export const PURGE_COMMAND = {
  name: "purge",
  description: "Delete a number of messages from the channel",
  options: [
    {
      type: 4, // INTEGER
      name: "amount",
      description: "The number of messages to delete (1-100)",
      required: true,
      min_value: 1,
      max_value: 100,
    },
  ],
}

export const WARN_COMMAND = {
  name: "warn",
  description: "Warn a user",
  options: [
    {
      type: 6, // USER
      name: "user",
      description: "The user to warn",
      required: true,
    },
    {
      type: 3, // STRING
      name: "reason",
      description: "The reason for the warning",
      required: true,
    },
    {
      type: 5, // BOOLEAN
      name: "anonymous",
      description: "Send the warning anonymously (default: true)",
      required: false,
    },
  ],
}

export const KICK_COMMAND = {
  name: "kick",
  description: "Kick a user from the server",
  options: [
    {
      type: 6, // USER
      name: "user",
      description: "The user to kick",
      required: true,
    },
    {
      type: 3, // STRING
      name: "reason",
      description: "The reason for kicking the user",
      required: false,
    },
  ],
}

export const BAN_COMMAND = {
  name: "ban",
  description: "Ban a user from the server",
  options: [
    {
      type: 6, // USER
      name: "user",
      description: "The user to ban",
      required: true,
    },
    {
      type: 3, // STRING
      name: "reason",
      description: "The reason for banning the user",
      required: false,
    },
    {
      type: 4, // INTEGER
      name: "days",
      description: "Number of days of messages to delete (0-7)",
      required: false,
      min_value: 0,
      max_value: 7,
    },
  ],
}

export const LOGGING_COMMAND = {
  name: "logging",
  description: "Configure logging settings",
  options: [
    {
      type: 1, // SUB_COMMAND
      name: "set",
      description: "Set the logging channel",
      options: [
        {
          type: 7, // CHANNEL
          name: "channel",
          description: "The channel to send logs to",
          required: true,
          channel_types: [0], // Text channels only
        },
      ],
    },
    {
      type: 1, // SUB_COMMAND
      name: "disable",
      description: "Disable logging",
    },
    {
      type: 1, // SUB_COMMAND
      name: "status",
      description: "Check the current logging status",
    },
  ],
}

export const GITHUB_COMMAND = {
  name: "github",
  description: "Get the link to the bot's GitHub repository",
}

export const VERIFY_COMMAND = {
  name: "verify",
  description: "Create a verification embed with a button",
  options: [
    {
      type: 8, // ROLE
      name: "role",
      description: "The role to give when users verify",
      required: true,
    },
    {
      type: 3, // STRING
      name: "title",
      description: "The title of the verification embed",
      required: false,
    },
    {
      type: 3, // STRING
      name: "description",
      description: "The description of the verification embed",
      required: false,
    },
    {
      type: 3, // STRING
      name: "button_text",
      description: "The text to display on the verification button",
      required: false,
    },
    {
      type: 3, // STRING
      name: "color",
      description: "The color of the embed (hex code)",
      required: false,
    },
  ],
}

export const GITHUB_WEBHOOK_COMMAND = {
  name: "github-webhook",
  description: "Manage GitHub webhook notifications",
  options: [
    {
      type: 1, // SUB_COMMAND
      name: "setup",
      description: "Set up GitHub webhook notifications for a repository",
      options: [
        {
          type: 3, // STRING
          name: "repository",
          description: "The GitHub repository (format: owner/repo)",
          required: true,
        },
        {
          type: 7, // CHANNEL
          name: "channel",
          description: "The channel to send notifications to",
          required: true,
          channel_types: [0], // Text channels only
        },
        {
          type: 3, // STRING
          name: "events",
          description: "Events to notify (comma-separated: push,pr,issue,release,all)",
          required: false,
        },
      ],
    },
    {
      type: 1, // SUB_COMMAND
      name: "list",
      description: "List all GitHub webhook integrations for this server",
    },
    {
      type: 1, // SUB_COMMAND
      name: "remove",
      description: "Remove GitHub webhook integration for a repository",
      options: [
        {
          type: 3, // STRING
          name: "repository",
          description: "The GitHub repository to remove (format: owner/repo)",
          required: true,
        },
      ],
    },
  ],
}

export const WARNINGS_COMMAND = {
  name: "warnings",
  description: "View warnings for a user",
  options: [
    {
      type: 6, // USER
      name: "user",
      description: "The user to view warnings for",
      required: true,
    },
  ],
}

export const CLEARWARNINGS_COMMAND = {
  name: "clearwarnings",
  description: "Clear warnings for a user",
  options: [
    {
      type: 6, // USER
      name: "user",
      description: "The user to clear warnings for",
      required: true,
    },
    {
      type: 3, // STRING
      name: "warning_id",
      description: "Specific warning ID to clear (leave empty to clear all)",
      required: false,
    },
  ],
}

export const STARBOARD_COMMAND = {
  name: "starboard",
  description: "Configure the starboard",
  options: [
    {
      type: 1, // SUB_COMMAND
      name: "setup",
      description: "Set up the starboard",
      options: [
        {
          type: 7, // CHANNEL
          name: "channel",
          description: "The channel to use for the starboard",
          required: true,
          channel_types: [0], // Text channels only
        },
        {
          type: 4, // INTEGER
          name: "threshold",
          description: "Number of stars needed to appear on the starboard (default: 3)",
          required: false,
          min_value: 1,
          max_value: 100,
        },
        {
          type: 3, // STRING
          name: "emoji",
          description: "The emoji to use for stars (default: ⭐)",
          required: false,
        },
      ],
    },
    {
      type: 1, // SUB_COMMAND
      name: "disable",
      description: "Disable the starboard",
    },
    {
      type: 1, // SUB_COMMAND
      name: "status",
      description: "Check the current starboard status",
    },
  ],
}

// All commands the bot supports
export const ALL_COMMANDS = [
  ROLE_COMMAND,
  PURGE_COMMAND,
  WARN_COMMAND,
  KICK_COMMAND,
  BAN_COMMAND,
  LOGGING_COMMAND,
  GITHUB_COMMAND,
  VERIFY_COMMAND,
  GITHUB_WEBHOOK_COMMAND,
  WARNINGS_COMMAND,
  CLEARWARNINGS_COMMAND,
  STARBOARD_COMMAND,
]

