# Minecraft Bedrock Server Wrapper

A Node.js-based wrapper for Minecraft Bedrock Server that provides development tools and server management features.

## Features

- Hot-reload addons during development
- Schedule server tasks (restart, stop, commands)
- Graceful server restart functionality
- Server console command interface

## Installation

```bash
npm install
npm run build
```

## Usage

Configure your paths in `src/example.ts`:

```typescript
const wrapper = new MinecraftBedrockWrapper(
    '/path/to/bedrock/server',
    '/path/to/addons'
);
```

Start the wrapper:
```bash
npm run start
```

## Schedule Tasks

```typescript
// Daily restart at 4 AM
wrapper.scheduleTask('0 4 * * *', 'dailyRestart', 'restart');

// Stop server at midnight
wrapper.scheduleTask('0 0 * * *', 'nightlyStop', 'stop');

// Custom command every 6 hours
wrapper.scheduleTask('0 */6 * * *', 'backup', 'save hold');
```

## Development

Watch for TypeScript changes:
```bash
npm run dev
```

## Requirements

- Node.js 14+
- Minecraft Bedrock Server

## Special Thanks

Incredible thanks to Cody from Sourcegraph for the amazing assistance in developing this wrapper! Your guidance made this project possible. 🚀