# BondedPath MCP Server 🚀

A lightweight [Model Context Protocol](https://modelcontextprotocol.io/) server for AI-powered peer support and wellness tool discovery. This server provides specialized tools for finding support communities and free therapy-alternative tools on the BondedPath platform.

## Features
- **$0 Infrastructure Cost**: Uses static, high-quality data defined in `index.ts`.
- **Privacy-First**: No external API calls or database connections required.
- **Fast & Reliable**: Instant tool responses for AI agents.

## Available Tools

- `find_peer_support`: Search for peer support groups by struggle (e.g., "burnout", "anxiety in London").
- `list_wellness_tools`: List free assessments, interactive exercises, and resources.
- `get_bondedpath_info`: Get a platform overview, key stats, and site philosophy.

## Local Installation

### 1. Build the server
```bash
cd mcp-server
npm install
npm run build
```

### 2. Configure for Claude Desktop
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bondedpath": {
      "command": "node",
      "args": ["c:/Projects/BandB/mcp-server/dist/index.js"]
    }
  }
}
```
*(Replace the path with your actual absolute path)*

## Public Deployment (Smithery)

This project is pre-configured for [Smithery](https://smithery.ai/). To make this server public for any AI agent:

1. Push this `mcp-server/` directory (or the whole repo) to GitHub.
2. Visit [smithery.ai](https://smithery.ai/) and click **"Import Repo"**.
3. It will automatically detect your `smithery.yaml` and provide an `npx` install command:
   ```bash
   npx -y bondedpath-mcp-server
   ```

## Development
- `npm run dev`: Run with hot-reloading using `tsx`.
- `npm run build`: Compile TypeScript to JavaScript.
