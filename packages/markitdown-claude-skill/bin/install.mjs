#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

const SETTINGS_FILE = ".claude/settings.json";
const MCP_SERVER_NAME = "markitdown";

const MCP_SERVER_CONFIG = {
  command: "uvx",
  args: ["markitdown-mcp"],
};

function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== "/") {
    if (
      existsSync(join(dir, ".git")) ||
      existsSync(join(dir, "package.json"))
    ) {
      return dir;
    }
    dir = resolve(dir, "..");
  }
  return process.cwd();
}

function getUserSettingsDir() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return home ? join(home, ".claude") : null;
}

function readJsonFile(path) {
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

function writeJsonFile(path, data) {
  const dir = resolve(path, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function checkUvxAvailable() {
  try {
    execSync("uvx --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function install(scope) {
  let settingsPath;

  if (scope === "user") {
    const userDir = getUserSettingsDir();
    if (!userDir) {
      console.error("Could not determine home directory.");
      process.exit(1);
    }
    settingsPath = join(userDir, "settings.json");
  } else {
    const root = findProjectRoot();
    settingsPath = join(root, SETTINGS_FILE);
  }

  const settings = readJsonFile(settingsPath);

  if (!settings.mcpServers) {
    settings.mcpServers = {};
  }

  if (settings.mcpServers[MCP_SERVER_NAME]) {
    console.log(`\n  MarkItDown MCP server is already configured in ${settingsPath}\n`);
    return;
  }

  settings.mcpServers[MCP_SERVER_NAME] = MCP_SERVER_CONFIG;
  writeJsonFile(settingsPath, settings);

  console.log(`\n  MarkItDown MCP server added to ${settingsPath}`);
  console.log(`  Claude Code now has a "convert_to_markdown" tool.\n`);
}

function uninstall(scope) {
  let settingsPath;

  if (scope === "user") {
    const userDir = getUserSettingsDir();
    if (!userDir) {
      console.error("Could not determine home directory.");
      process.exit(1);
    }
    settingsPath = join(userDir, "settings.json");
  } else {
    const root = findProjectRoot();
    settingsPath = join(root, SETTINGS_FILE);
  }

  const settings = readJsonFile(settingsPath);

  if (!settings.mcpServers || !settings.mcpServers[MCP_SERVER_NAME]) {
    console.log(`\n  MarkItDown MCP server is not configured in ${settingsPath}\n`);
    return;
  }

  delete settings.mcpServers[MCP_SERVER_NAME];
  if (Object.keys(settings.mcpServers).length === 0) {
    delete settings.mcpServers;
  }
  writeJsonFile(settingsPath, settings);

  console.log(`\n  MarkItDown MCP server removed from ${settingsPath}\n`);
}

function printHelp() {
  console.log(`
  markitdown-skill — Install MarkItDown as a Claude Code MCP skill

  Usage:
    npx markitdown-skill [options]

  Options:
    --user        Install to user-level settings (~/.claude/settings.json)
                  Default: installs to project-level (.claude/settings.json)
    --uninstall   Remove the MarkItDown MCP server configuration
    --help        Show this help message

  Examples:
    npx markitdown-skill                  Install for current project
    npx markitdown-skill --user           Install for all projects
    npx markitdown-skill --uninstall      Remove from current project

  Prerequisites:
    - Python 3.10+ with uvx (or pipx) available on PATH
    - Install uvx: pip install uv

  What this does:
    Adds the MarkItDown MCP server to your Claude Code settings.
    This gives Claude a "convert_to_markdown" tool that can convert:
      PDF, Word, Excel, PowerPoint, HTML, Images, Audio, CSV, JSON,
      XML, ZIP, YouTube URLs, EPubs, and more — all to Markdown.
`);
}

const args = process.argv.slice(2);
const isUser = args.includes("--user");
const isUninstall = args.includes("--uninstall");
const isHelp = args.includes("--help") || args.includes("-h");

if (isHelp) {
  printHelp();
  process.exit(0);
}

console.log("\n  markitdown-skill — MarkItDown for Claude Code\n");

if (!checkUvxAvailable()) {
  console.log("  Warning: 'uvx' was not found on PATH.");
  console.log("  The MCP server requires uvx to run. Install it with: pip install uv\n");
}

if (isUninstall) {
  uninstall(isUser ? "user" : "project");
} else {
  install(isUser ? "user" : "project");
}
