# TaskLite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/v/release/sho11decade/tasklite)](https://github.com/sho11decade/tasklite/releases)

A lightweight, fast Windows system monitor built with Tauri v2 + Rust + Svelte. Inspired by **htop** and Linux system monitors, TaskLite is designed to be lighter and faster than Windows Task Manager.

## ✨ Features

### Beautiful htop-Inspired UI
- **Dracula color scheme** - Eye-friendly dark theme
- **Colored progress bars** - Dynamic status indicators
- **Information-dense layout** - Maximized screen usage
- **Keyboard shortcuts** - Full F-key support (F1-F10)
- **Built-in help** - Press F1 for interactive help dialog

### Multilingual (i18n)
- **Japanese** (日本語) - Primary
- **English** - Full support
- **Instant switching** - No reload required

### Process Management
- Real-time listing (top N sorted by CPU)
- Visual CPU bars with color coding
- Process termination with confirmation
- Search & filter capability
- Configurable display count (10-100 processes)

### System Resources
- CPU & memory monitoring
- 60-second history charts
- Gradient visualizations
- Real-time meters in header

### Configuration
- **Auto-save settings** - Language, interval, display count
- **Adjustable refresh** - 1000-5000ms (F3/F4 shortcuts)
- **Persistent preferences** - Saved to localStorage

## 📊 Performance

| Metric | Target | Achieved | Improvement |
|--------|--------|----------|-------------|
| Memory | <25MB | ~18-22MB | **12-28% better** |
| CPU | <1% | ~0.3-0.5% | **40-70% better** |
| Startup | <1s | ~0.5-0.8s | **20-50% better** |
| Update | <100ms | ~30-60ms | **40-70% better** |

## 📦 Installation

### Windows (Recommended)
Download the latest [MSI installer](https://github.com/sho11decade/tasklite/releases/latest) and install.

### Portable
Download the standalone `.exe` from [releases](https://github.com/sho11decade/tasklite/releases) - no installation required.

## 🚀 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## ⌨️ Keyboard Shortcuts

- **F1** - Show help dialog
- **F2** - Toggle Processes/Resources tabs
- **F3** - Decrease refresh interval (faster)
- **F4** - Increase refresh interval (slower)
- **F5** - Refresh immediately
- **F9** - Kill top process
- **F10** - Quit application

For more details, press **F1** in the app or see [FAQ.md](FAQ.md).

## 🔧 Technology

- **Backend**: Rust + sysinfo
- **Frontend**: Svelte 5 + TypeScript
- **Framework**: Tauri v2
- **Charts**: Custom SVG (no dependencies)
- **i18n**: Custom lightweight system (~2KB)

## 📚 Documentation

- [FAQ](FAQ.md) - Frequently Asked Questions
- [Contributing](CONTRIBUTING.md) - Development guidelines
- [Changelog](CHANGELOG.md) - Version history
- [Design](design.md) - Original specification (Japanese)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 👤 Author

RiceZero [@ricezero21](https://twitter.com/ricezero21)

## 🙏 Acknowledgments

- Inspired by [htop](https://htop.dev/)
- UI colors from [Dracula Theme](https://draculatheme.com/)
- Built with [Tauri](https://tauri.app/), [Rust](https://www.rust-lang.org/), and [Svelte](https://svelte.dev/)
