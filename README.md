# Hammy Bot - Discord Moderation Bot

A powerful Discord moderation bot built with Next.js and deployed on Vercel. Hammy Bot helps server administrators manage roles and moderate their communities with easy-to-use slash commands.

![Discord Bot](https://img.shields.io/badge/Discord-Bot-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Features

- **Role Management**: Add and remove roles from users
- **Moderation Commands**: Warn, kick, ban users and purge messages
- **Logging System**: Log all moderation actions to a designated channel
- **Anonymous Warnings**: Option to send warnings anonymously or with moderator identification
- **Automatic Command Registration**: Commands are registered automatically on deployment

## Setup Guide

### Prerequisites

- A Discord account
- A Discord server where you have administrator permissions
- A [Vercel](https://vercel.com/) account
- Node.js and npm installed (for local development)

### Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under the "Privileged Gateway Intents" section, enable all intents
5. Save changes

### Step 2: Get Your Bot Tokens

1. In the "Bot" tab, click "Reset Token" and copy your bot token
2. Go to the "General Information" tab and copy your Application ID (Client ID)
3. Go to the "OAuth2" tab, then "URL Generator"
4. Select the following scopes:
   - `bot`
   - `applications.commands`
5. Select the following bot permissions:
   - `Administrator` (or select the specific permissions below)
   - `Manage Roles`
   - `Kick Members`
   - `Ban Members`
   - `Manage Messages`
   - `Send Messages`
   - `View Channels`
6. Copy the generated URL and open it in your browser to invite the bot to your server

### Step 3: Deploy to Vercel

1. Fork or clone this repository
2. Deploy to Vercel using the Vercel CLI or the Vercel GitHub integration
3. Add the following environment variables in your Vercel project settings:
   - `DISCORD_BOT_TOKEN`: Your bot token
   - `DISCORD_CLIENT_ID`: Your application ID
   - `DISCORD_PUBLIC_KEY`: Your public key (found in the "General Information" tab)
4. Deploy the project

### Step 4: Set Up Interactions Endpoint URL

1. Go back to the Discord Developer Portal
2. In your application, go to the "General Information" tab
3. Scroll down to "Interactions Endpoint URL"
4. Enter your Vercel deployment URL followed by `/api/discord/interactions`
   - Example: `https://your-project.vercel.app/api/discord/interactions`
5. Save changes

## Commands

### Role Management

- `/role add @user @role` - Adds a role to a user
- `/role remove @user @role` - Removes a role from a user

### Moderation

- `/purge [amount]` - Deletes a specified number of messages (1-100)
- `/warn @user [reason] [anonymous]` - Warns a user with a specified reason
  - Set `anonymous` to `false` to identify yourself as the moderator
- `/kick @user [reason]` - Kicks a user from the server
- `/ban @user [reason] [days]` - Bans a user and optionally deletes their messages (0-7 days)

### Logging

- `/logging set #channel` - Sets the channel where moderation logs will be sent
- `/logging disable` - Disables logging for the server
- `/logging status` - Shows the current logging status and channel

## Bot Permissions

The bot requires the following permissions to function properly:

- `Manage Roles` - For adding and removing roles
- `Kick Members` - For kicking users
- `Ban Members` - For banning users
- `Manage Messages` - For purging messages
- `View Channels` - For accessing channels
- `Send Messages` - For sending messages and logs

**Important**: The bot's role must be higher in the role hierarchy than any roles it needs to manage.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
3. Create a `.env.local` file with the following variables:

```plaintext
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_PUBLIC_KEY=your_public_key
```


4. Run the development server:

```shellscript
npm run dev
```




## Troubleshooting

### Commands Not Showing Up

- Make sure the bot has the `applications.commands` scope
- Check that the commands were registered by visiting `/api/discord/register`
- Commands can take up to an hour to propagate globally


### Permission Errors

- Ensure the bot has all the required permissions
- Check that the bot's role is higher in the hierarchy than the roles it's trying to manage
- For role management, the bot cannot modify roles that are higher than its own role


### Logging Not Working

- Make sure you've set up logging with `/logging set #channel`
- Verify the bot has permission to send messages in the logging channel
- Check the Vercel logs for any errors


## Technical Details

- Built with Next.js App Router
- Uses Discord Interactions API
- Deployed on Vercel
- In-memory storage for logging settings (resets on deployment)


## Future Improvements

- Database integration for persistent storage
- Custom prefix commands
- Auto-moderation features
- Reaction roles
- Temporary mutes and bans
- Web dashboard


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you need help with the bot, please open an issue on GitHub or contact the maintainer.

---

Made with ❤️ using Next.js and Discord Interactions API

```plaintext

This README provides comprehensive documentation for your Discord moderation bot. It includes setup instructions, command details, troubleshooting tips, and information about the bot's features. Feel free to customize it further to match your specific needs or branding!
```