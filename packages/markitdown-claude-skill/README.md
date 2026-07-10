# markitdown-skill

Install [MarkItDown](https://github.com/microsoft/markitdown) as a Claude Code MCP skill with a single command.

## Quick Start

```bash
npx markitdown-skill
```

This adds the MarkItDown MCP server to your Claude Code project settings, giving Claude a `convert_to_markdown` tool that can convert files to Markdown.

## What You Get

Once installed, Claude Code gains a **convert_to_markdown** tool that converts:

- PDF documents
- Word (.docx) files
- Excel (.xlsx, .xls) spreadsheets
- PowerPoint (.pptx) presentations
- HTML pages
- Images (EXIF metadata, OCR)
- Audio files (metadata, transcription)
- CSV, JSON, XML
- ZIP archives
- YouTube URLs
- EPubs
- And more

## Usage

### Install for current project

```bash
npx markitdown-skill
```

Adds configuration to `.claude/settings.json` in your project.

### Install for all projects (user-level)

```bash
npx markitdown-skill --user
```

Adds configuration to `~/.claude/settings.json`.

### Uninstall

```bash
npx markitdown-skill --uninstall
npx markitdown-skill --uninstall --user
```

## Prerequisites

- **Python 3.10+** installed
- **uvx** available on PATH — install with `pip install uv`

The MCP server (`markitdown-mcp`) is fetched and run automatically by `uvx` on first use. No separate Python package installation is needed.

## How It Works

This package adds an MCP server entry to your Claude Code settings:

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "uvx",
      "args": ["markitdown-mcp"]
    }
  }
}
```

When Claude Code starts, it launches the MarkItDown MCP server via `uvx`, which handles downloading and caching the Python package automatically.

## License

MIT
