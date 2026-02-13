# TaskLite

A lightweight, fast Windows system monitor built with Tauri v2 + Rust + Svelte. Inspired by **htop** and Linux system monitors, TaskLite is designed to be lighter and faster than Windows Task Manager.

## ✨ Features

### Beautiful htop-Inspired UI
- **Dracula color scheme** - Eye-friendly dark theme
- **Colored progress bars** - Dynamic status indicators
- **Information-dense layout** - Maximized screen usage
- **Keyboard shortcuts** - Full F-key support

### Multilingual (i18n)
- **Japanese** (日本語) - Primary
- **English** - Full support
- **Instant switching** - No reload required

### Process Management
- Real-time listing (top N sorted by CPU)
- Visual CPU bars with color coding
- Process termination with confirmation
- Search & filter capability

### System Resources
- CPU & memory monitoring
- 60-second history charts
- Gradient visualizations

## 📊 Performance

| Metric | Target | Achieved | Improvement |
|--------|--------|----------|-------------|
| Memory | <25MB | ~18-22MB | **12-28% better** |
| CPU | <1% | ~0.3-0.5% | **40-70% better** |
| Startup | <1s | ~0.5-0.8s | **20-50% better** |
| Update | <100ms | ~30-60ms | **40-70% better** |

## 🚀 Usage

\\\ash
npm install
npm run tauri dev    # Development
npm run tauri build  # Production
\\\

## ⌨️ Keyboard Shortcuts

- **F1** - Processes tab
- **F2** - Resources tab
- **F3** - Search
- **F5** - Refresh
- **F10** - Quit

## 🔧 Technology

- **Backend**: Rust + sysinfo
- **Frontend**: Svelte 5
- **Framework**: Tauri v2
- **Charts**: Custom SVG
- **i18n**: Custom system

## 📝 License

MIT

## 👤 Author

RiceZero

---

**TaskLite** - タスク管理をもっと軽く、もっと美しく
