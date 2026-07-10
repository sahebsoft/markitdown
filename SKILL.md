---
name: markitdown
description: Convert files (PDF, Word, Excel, PowerPoint, HTML, images, audio, and more) to Markdown using the markitdown CLI or Python library. Use when you need to extract text content from documents for analysis, summarization, or processing.
---

# MarkItDown

Convert various file formats to Markdown for text analysis and LLM processing.

## Supported Formats

- PDF (.pdf)
- Word (.docx)
- Excel (.xlsx, .xls)
- PowerPoint (.pptx)
- HTML (.html, .htm)
- Images (.jpg, .png — EXIF metadata, OCR)
- Audio (.mp3, .wav — metadata, transcription)
- CSV, JSON, XML
- ZIP archives (iterates contents)
- YouTube URLs
- EPubs (.epub)
- Outlook messages (.msg)
- Jupyter notebooks (.ipynb)

## Setup

Ensure Python 3.10+ is available, then install:

```bash
pip install 'markitdown[all]'
```

Or install only the format extras you need:

```bash
pip install 'markitdown[pdf,docx,pptx,xlsx]'
```

## CLI Usage

Convert a file to Markdown:

```bash
markitdown path/to/file.pdf
```

Save to a file:

```bash
markitdown document.docx -o output.md
```

Pipe content:

```bash
cat file.pdf | markitdown
```

Specify file type hint when piping:

```bash
cat data | markitdown -x .csv
```

## Python Usage

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert a local file
result = md.convert("report.pdf")
print(result.markdown)

# Convert from a URL
result = md.convert_url("https://example.com/doc.pdf")
print(result.markdown)

# Convert from a stream
with open("file.xlsx", "rb") as f:
    result = md.convert_stream(f)
    print(result.markdown)

# Convert a URI (http:, https:, file:, or data:)
result = md.convert_uri("file:///path/to/doc.docx")
print(result.markdown)
```

## MCP Server

For tool-based access, run the MCP server:

```bash
# STDIO mode (for Claude Code MCP integration)
uvx markitdown-mcp

# HTTP mode
uvx markitdown-mcp --http --port 3001
```

Add to Claude Code settings (`.claude/settings.json`):

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

This exposes a `convert_to_markdown` tool that accepts a URI (http:, https:, file:, or data:) and returns the Markdown content.

## Guidelines

- Use the CLI for quick one-off conversions from the terminal.
- Use the Python API when you need to process files programmatically or chain conversions.
- Use the MCP server when you want Claude to have persistent tool access for file conversion.
- Output is optimized for LLM consumption — structure (headings, tables, lists) is preserved but fidelity is not pixel-perfect.
- For images: OCR requires optional dependencies. EXIF metadata is always extracted.
- For audio: speech transcription requires optional dependencies (`pydub`, `SpeechRecognition`).
