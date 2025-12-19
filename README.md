# Valkey Admin

## What is Valkey Admin?

Valkey Admin is a web-based administration tool for Valkey clusters. It provides an intuitive interface to monitor, manage, and interact with your Valkey instances, offering features like real-time metrics, key management, and cluster administration.

Built with React and TypeScript, Valkey Admin runs as a desktop application (via Electron) or web application, making it easy to manage your Valkey infrastructure from anywhere.

## Platform Support

Valkey Admin works on:
- **macOS** (native support)
- **Linux** (native support)
- **Windows** (via WSL - Windows Subsystem for Linux)

## Quick Start

```bash
./quickstart.sh
```

This will install dependencies, start the Valkey cluster, and launch the development servers with automatic connection.

## Manual Setup

If you prefer to run things step by step:

1. **Install dependencies:** `npm install`
2. **Start Valkey cluster:** `./tools/valkey-cluster/scripts/build_run_cluster.sh`
3. **Start development servers:** `npm run dev`
4. **Open http://localhost:5173** and manually add a connection to `localhost:7001`

### Windows/WSL Users

Fix line endings before running scripts:
```bash
sed -i 's/\r$//' tools/valkey-cluster/scripts/build_run_cluster.sh
sed -i 's/\r$//' tools/valkey-cluster/scripts/cluster_init.sh
chmod +x tools/valkey-cluster/scripts/*.sh
```

### Shutting Down

```bash
cd tools/valkey-cluster
docker compose down -v
```

## IDE Setup

### VSCode

The repository includes settings for the ESLint extension. Please install it.

**Note:** If you have a formatter i.e. Prettier, it could interfere with the ESLint extension. Please disable it from the workspace.

This requires ESLint v9.0.0 and above.

## Create DMG

You are able to build notarized or non-notarized Applications.

### Unnotarized Application

#### Overview
    - Much faster build process.
    - While you won't encounter any issues running this on the system that built it, distributing the DMG will lead to a `"Valkey Admin" is damaged and can't be opened` error when running the application. To bypass this, run `xattr -c <path/to/app>` in terminal to disable the quarantine flag.

#### Process
In the root directory, create a DMG by running `npm run package:mac:nosign`.

### Notarized Application

#### Overview
    - Much slower build process (could be hours the first time, and up to 10 minutes consequently).
    - Has additional requirements listed in `mac_build`.

#### Process
In the root directory, create a DMG by running `npm run package:mac`.
