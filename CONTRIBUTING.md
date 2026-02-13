# Contributing to TaskLite

Thank you for your interest in contributing to TaskLite! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js 20 or later
- Rust 1.70 or later
- Windows 10/11 (primary target platform)

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tasklite.git
cd tasklite
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run tauri dev
```

## Project Structure

```
tasklite/
├── src/                    # Frontend (Svelte)
│   ├── routes/            # SvelteKit routes
│   │   └── +page.svelte  # Main application page
│   └── lib/              # Shared libraries
│       ├── i18n.ts       # Internationalization
│       └── components/   # Reusable components
├── src-tauri/            # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs       # Tauri commands
│   │   └── main.rs      # Entry point
│   └── Cargo.toml       # Rust dependencies
├── static/              # Static assets
└── .github/             # GitHub Actions workflows
```

## Code Style

### TypeScript/Svelte
- Use TypeScript for type safety
- Follow Svelte 5 runes ($state, $derived, $effect)
- Use 2-space indentation
- Use meaningful variable names

### Rust
- Follow Rust standard formatting (`cargo fmt`)
- Use `cargo clippy` to catch common mistakes
- Prefer idiomatic Rust patterns
- Document public APIs

## Development Workflow

### Adding Features

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes with clear, atomic commits

3. Test thoroughly:
```bash
npm run tauri dev
cargo test --manifest-path src-tauri/Cargo.toml
```

4. Update documentation if needed

5. Submit a pull request

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure CI checks pass
- Keep PRs focused on a single feature/fix
- Update CHANGELOG.md with your changes

## Testing

### Manual Testing
- Test on Windows 10 and Windows 11
- Verify all keyboard shortcuts work
- Check both English and Japanese languages
- Test with varying process counts
- Verify performance targets are met

### Performance Targets
- Memory usage: <25MB
- CPU usage: <1% average
- Startup time: <1 second
- Update latency: <100ms

## Adding Translations

To add a new language:

1. Edit `src/lib/i18n.ts`
2. Add language code to `Language` type
3. Add complete translations object
4. Update language selector in UI
5. Test all strings display correctly

## Release Process

Releases are automated via GitHub Actions:

1. Update version in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. Update `CHANGELOG.md`

3. Create and push a version tag:
```bash
git tag v0.2.0
git push origin v0.2.0
```

4. GitHub Actions will build and create a draft release

5. Review and publish the release

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help maintain a positive community

## Questions?

- Open an issue for bugs or feature requests
- Use discussions for general questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
