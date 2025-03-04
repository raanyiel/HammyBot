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

// All commands the bot supports
export const ALL_COMMANDS = [ROLE_COMMAND, PURGE_COMMAND, WARN_COMMAND, KICK_COMMAND, BAN_COMMAND, LOGGING_COMMAND]

