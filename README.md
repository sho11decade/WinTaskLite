# TaskLite

A lightweight, fast Windows system monitor built with Tauri v2 + Rust + Svelte. Inspired by Linux system monitors (GNOME/KDE System Monitor), TaskLite is designed to be lighter and faster than Windows Task Manager.

## Features

### Process Management
- **Real-time process listing** - View top N processes (default 20) sorted by CPU usage
- **Process details** - PID, name, CPU percentage, memory usage (MB)
- **Process termination** - Kill processes with confirmation (requires appropriate permissions)
- **Search & filter** - Quickly find processes by name or PID

### System Resources
- **CPU monitoring** - Real-time global CPU usage
- **Memory monitoring** - Memory usage with percentage and absolute values
- **Live graphs** - Lightweight SVG charts showing 30-second history for CPU and memory

### Customization
- **Configurable refresh interval** - Adjust between 1000-5000ms
- **Adjustable process count** - View between 5-100 top processes
- **Dark mode UI** - Clean, modern interface inspired by VS Code

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Memory footprint | < 25MB | ✅ Achieved |
| CPU usage (avg) | < 1% | ✅ Achieved |
| Startup time | < 1s | ✅ Achieved |
| Update latency | < 100ms | ✅ Achieved |

## Technology Stack

- **Backend**: Rust with sysinfo crate for system information
- **Frontend**: Svelte 5 with minimal dependencies
- **Framework**: Tauri v2 for native integration
- **Charts**: Custom SVG implementation (no heavy libraries)

## Development

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Windows 11

### Running in Development
```bash
npm install
npm run tauri dev
```

### Building for Production
```bash
npm run tauri build
```

## Architecture

```
UI Layer (WebView - Svelte)
  ↓ invoke commands
Rust Command Layer (Tauri)
  ↓ sysinfo crate
System Data Layer
  ↓ Windows API
Operating System
```

## Design Principles

- **Lightweight**: Minimal dependencies, optimized performance
- **Fast**: Differential updates only, no unnecessary re-renders
- **Secure**: No external network calls, explicit permission requirements
- **Clean**: Modern, distraction-free interface

## License

MIT

## Author

RiceZero - Windows軽量タスクマネージャー
Windows標準のタスクマネージャーはもっさりしていてむかつくので、Rustで作ってみる。
