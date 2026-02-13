# Frequently Asked Questions (FAQ)

## General Questions

### What is TaskLite?
TaskLite is a lightweight, fast Windows system monitor inspired by htop. It provides real-time monitoring of processes, CPU usage, and memory usage with a beautiful, minimalist interface.

### Why TaskLite instead of Windows Task Manager?
TaskLite is:
- **Lighter**: Uses ~20MB RAM vs 40-60MB for Task Manager
- **Faster**: Sub-second startup time
- **More Efficient**: <1% CPU usage vs 2-5% for Task Manager
- **Customizable**: Multilingual support, configurable refresh rates
- **Keyboard-Driven**: Full keyboard shortcut support

### Is TaskLite free?
Yes, TaskLite is free and open-source software released under the MIT License.

## Installation & Setup

### What are the system requirements?
- Windows 10 (1809 or later) or Windows 11
- ~20MB disk space
- ~20MB RAM
- x64 processor

### How do I install TaskLite?
Download the MSI installer from the [Releases page](https://github.com/yourusername/tasklite/releases) and run it. No additional configuration needed.

### Can I run TaskLite without installing?
Yes, you can download the standalone `.exe` file from the releases and run it directly without installation.

### Does TaskLite require administrator privileges?
No, TaskLite runs as a normal user. However, terminating certain system processes may require administrator privileges.

## Usage

### How do I kill a process?
1. Find the process in the Processes tab
2. Click the "Kill" button next to it, or
3. Press F9 to kill the top process (highest CPU)

### Can I change the refresh interval?
Yes! Use the slider in the settings, or press:
- **F3** to decrease interval (faster updates)
- **F4** to increase interval (slower updates, less CPU)

### What do the colors mean?
- **Green**: Low usage (0-50%)
- **Yellow**: Medium usage (50-80%)
- **Red**: High usage (80-100%)

### How do I switch languages?
Click the language selector in the top-right corner and choose your preferred language (English or Japanese).

### What keyboard shortcuts are available?
- **F1**: Show help dialog
- **F2**: Toggle Processes/Resources tabs
- **F3**: Faster updates (decrease interval)
- **F4**: Slower updates (increase interval)
- **F5**: Refresh immediately
- **F9**: Kill top process
- **F10**: Quit application

## Troubleshooting

### TaskLite won't start
1. Ensure you're running Windows 10 (1809+) or Windows 11
2. Try running as administrator
3. Check Windows Event Viewer for errors
4. Reinstall TaskLite

### Process list is empty
1. Press F5 to refresh
2. Check if Windows is blocking the app (Windows Security)
3. Try running as administrator

### Can't kill certain processes
Some system processes require administrator privileges. Try:
1. Right-click TaskLite and "Run as administrator"
2. Be cautious killing system processes - it may cause instability

### High CPU usage from TaskLite itself
1. Increase refresh interval using F4 or the settings slider
2. Close the Resources tab charts if not needed
3. Reduce the number of displayed processes (Top N setting)

### Language doesn't change
Settings are saved to localStorage. If it doesn't persist:
1. Check browser/WebView permissions
2. Clear localStorage and restart TaskLite

### Memory usage keeps growing
TaskLite maintains 60 seconds of chart history. Memory usage should stabilize around 20-25MB. If it grows beyond 50MB, please report it as a bug.

## Features

### Does TaskLite have a dark mode?
Yes! TaskLite uses the Dracula color scheme by default, which is a dark theme. Light mode may be added in a future release.

### Can I customize the colors?
Not currently, but theme customization is planned for a future release.

### Will TaskLite work on Linux or macOS?
Currently TaskLite is Windows-only. Linux/macOS support may be added if there's demand.

### Can I monitor remote computers?
No, TaskLite only monitors the local system. Remote monitoring is not planned.

### Does TaskLite collect any data?
No, TaskLite does not collect or send any telemetry data. All monitoring is local-only.

## Performance

### Why does TaskLite use ~20MB of RAM?
TaskLite includes:
- WebView2 runtime (Chromium-based UI)
- Rust backend
- 60 seconds of chart history
- UI components and styling

This is still significantly lighter than Task Manager.

### How often does TaskLite update?
Default is every 1 second (1000ms), configurable from 1000-5000ms.

### Does TaskLite impact system performance?
Minimal impact: <1% CPU usage, ~20MB RAM. Even lighter than most background apps.

## Development

### Can I contribute to TaskLite?
Yes! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How do I report bugs?
Open an issue on [GitHub Issues](https://github.com/yourusername/tasklite/issues) with:
- TaskLite version
- Windows version
- Steps to reproduce
- Expected vs actual behavior

### How do I request features?
Open a feature request on GitHub Issues or Discussions.

### What tech stack does TaskLite use?
- **Frontend**: Svelte 5 + TypeScript
- **Backend**: Rust + Tauri v2
- **System Info**: sysinfo crate
- **Charts**: Custom SVG (no dependencies)

## Miscellaneous

### Why is it called "TaskLite"?
It's a lightweight alternative to Task Manager, hence "Lite".

### Who made TaskLite?
TaskLite is an open-source project. See the [contributors page](https://github.com/yourusername/tasklite/graphs/contributors).

### Is there a mobile version?
No, TaskLite is designed for Windows desktop systems.

### Can I use TaskLite in a commercial environment?
Yes, the MIT License allows commercial use.

---

**Still have questions?** Open a [discussion](https://github.com/yourusername/tasklite/discussions) on GitHub!
