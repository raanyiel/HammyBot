// Define the slash commands for the bot
export const ROLE_COMMAND = {
    name: "role",
    description: "Manage roles for users",
    options: [
      {
        type: 1, // SUB_COMMAND
        name: "assign",
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
        name: "unassign",
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
  
  // All commands the bot supports
  export const ALL_COMMANDS = [ROLE_COMMAND]
  
  