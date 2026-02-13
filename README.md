# TaskLite

A lightweight, fast Windows system monitor built with Tauri v2 + Rust + Svelte. Inspired by **htop** and Linux system monitors (GNOME/KDE System Monitor), TaskLite is designed to be lighter and faster than Windows Task Manager.

## ✨ Features

### Beautiful htop-Inspired UI
- **Dracula color scheme** - Eye-friendly dark theme with vibrant accents
- **Colored progress bars** - Dynamic color-coded CPU and memory meters
- **Information-dense layout** - Compact design maximizing screen real estate
- **Monospace font** - Console-style interface for clarity
- **Function key shortcuts** - htop-style footer with F-key commands

### Multilingual Support (i18n)
- **Japanese** (日本語) - Primary language
- **English** - Full support
- **Easy language switching** - Toggle between languages instantly

### Process Management
- **Real-time process listing** - View top N processes (default 20) sorted by CPU usage
- **Process details** - PID, name, CPU percentage, memory usage
- **Visual CPU bars** - Color-coded usage indicators (█ characters)
- **Process termination** - Kill processes with confirmation (requires permissions)
- **Search & filter** - Quickly find processes by name or PID

### System Resources
- **CPU monitoring** - Real-time global CPU usage with gradient progress bar
- **Memory monitoring** - Memory usage with percentage and absolute values
- **Live graphs** - Beautiful SVG charts with gradients showing 60-second history
- **Grid overlays** - Professional visualization with reference lines

### Customization
- **Configurable refresh interval** - Adjust between 1000-5000ms
- **Adjustable process count** - View between 5-100 top processes
- **Persistent settings** - Your preferences are remembered

## 🎨 Color Scheme (Dracula-inspired)

- **Background**: Deep purple-gray (#282a36)
- **Foreground**: Soft white (#f8f8f2)
- **Accent colors**:
  - Cyan (#8be9fd) - Titles and highlights
  - Green (#50fa7b) - Low/good values
  - Yellow (#f1fa8c) - Medium values
  - Orange (#ffb86c) - High values
  - Red (#ff5555) - Critical values
  - Purple (#bd93f9) - Memory indicators

## 📊 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Memory footprint | < 25MB | ✅ Achieved |
| CPU usage (avg) | < 1% | ✅ Achieved |
| Startup time | < 1s | ✅ Achieved |
| Update latency | < 100ms | ✅ Achieved |

## 🛠️ Technology Stack

- **Backend**: Rust with sysinfo crate for system information
- **Frontend**: Svelte 5 with minimal dependencies
- **Framework**: Tauri v2 for native integration
- **Charts**: Custom SVG implementation (no heavy libraries)
- **i18n**: Custom lightweight translation system

## 🚀 Development

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

The built executable will be in `src-tauri/target/release/`

## 📁 Architecture

```
UI Layer (WebView - Svelte)
  ↓ invoke commands
Rust Command Layer (Tauri)
  ├─ get_processes(top_n)
  ├─ get_system_stats()
  └─ kill_process(pid)
  ↓ sysinfo crate
System Data Layer
  ↓ Windows API
Operating System
```

## 🎯 Design Principles

- **Lightweight**: Minimal dependencies, optimized performance
- **Fast**: Differential updates only, no unnecessary re-renders
- **Secure**: No external network calls, explicit permission requirements
- **Beautiful**: htop-inspired terminal aesthetics in a GUI
- **Accessible**: Multilingual support with easy switching

## 🌐 Supported Languages

- 🇯🇵 Japanese (日本語) - Primary
- 🇬🇧 English

Adding new languages is simple - just add translations to `src/lib/i18n.ts`

## ⌨️ Keyboard Shortcuts

- **F1** - Help / Processes tab
- **F2** - Setup / Resources tab
- **F3** - Search
- **F9** - Kill process
- **F10** - Quit application

## 🎨 UI Features

- **Dynamic color-coded bars**: Green → Yellow → Orange → Red based on usage
- **Gradient charts**: Beautiful SVG visualizations with smooth transitions
- **Hover effects**: Subtle glows and highlights
- **Responsive layout**: Adapts to window size
- **Custom scrollbars**: Themed to match the overall design

## 📝 License

MIT

## 👤 Author

RiceZero

---

**TaskLite** - タスク管理をもっと軽く、もっと美しく- Windows軽量タスクマネージャー
Windows標準のタスクマネージャーはもっさりしていてむかつくので、Rustで作ってみる。
