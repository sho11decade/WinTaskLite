# Changelog

All notable changes to TaskLite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Help dialog with keyboard shortcuts reference (F1)
- About dialog with version and license information
- Tooltips for all interactive elements
- GitHub Actions CI/CD for automated releases
- Automated Windows MSI installer builds
- Security auditing in CI pipeline
- Enhanced error handling with user-friendly messages
- Improved keyboard shortcuts (F3/F4 for interval adjustment)

### Changed
- F2 now toggles between Processes/Resources tabs
- F3/F4 adjust refresh interval instead of search focus
- Improved accessibility with ARIA labels
- Enhanced Dracula theme styling for dialogs

### Fixed
- Parameter naming issue with Tauri commands (topN)
- Field name mismatches between frontend and backend
- Import path for Tauri v2 API

## [0.1.0] - 2026-02-13

### Added
- Initial release
- Process monitoring with CPU and memory usage
- System resource monitoring (CPU & Memory)
- Real-time charts with 60-second history
- Multilingual support (Japanese & English)
- htop-inspired UI with Dracula color scheme
- Keyboard shortcuts (F1, F2, F5, F9, F10)
- Process termination capability
- Configuration persistence (localStorage)
- Configurable refresh interval (1000-5000ms)
- Configurable top N processes (10-100)
- Search/filter processes by name
- SVG-based charts (no external dependencies)
- Optimized performance (<25MB RAM, <1% CPU, <1s startup)

### Technical
- Built with Tauri v2 + Rust + Svelte 5
- Custom lightweight i18n system (~2KB)
- Optimized Rust backend with sysinfo crate
- Release build optimizations (LTO, strip, size optimization)
- Block character progress bars (█░)
- Monospace fonts for data clarity
