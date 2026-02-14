# TaskLite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/v/release/sho11decade/WinTaskLite)](https://github.com/sho11decade/WinTaskLite/releases)

TaskLite は Tauri v2 + Rust + Svelte で構築された、軽量かつ高速な Windows 向けシステムモニターです。**htop** や Linux 系システムモニターに着想を得ており、Windows Task Manager より軽く速く動作することを目標にしています。

## ✨ Features

### htop ライクな UI
- **Dracula カラースキーム** - 目に優しいダークテーマ
- **色付きプログレスバー** - 状況を直感的に可視化
- **高密度レイアウト** - 画面を無駄なく活用
- **キーボードショートカット** - F1-F10 をサポート
- **内蔵ヘルプ** - F1 で対話型ヘルプダイアログを表示

### 多言語対応（i18n）
- **日本語** - メイン言語
- **英語** - フルサポート
- **即時切り替え** - リロード不要

### プロセス管理
- リアルタイム一覧表示（CPU 降順の Top N）
- 色分けされた CPU 使用率バー
- 確認付きプロセス終了
- 検索・フィルター機能
- 表示件数の設定（10〜100 プロセス）

### システムリソース
- CPU / メモリ監視
- 60 秒履歴チャート
- グラデーション可視化
- ヘッダーのリアルタイムメーター

### 設定
- **設定の自動保存** - 言語、更新間隔、表示件数
- **更新間隔の調整** - 1000〜5000ms（F3/F4）
- **設定の永続化** - localStorage に保存

## 📊 Performance

| Metric | Target | Achieved | Improvement |
|--------|--------|----------|-------------|
| Memory | <25MB | ~18-22MB | **12-28% better** |
| CPU | <1% | ~0.3-0.5% | **40-70% better** |
| Startup | <1s | ~0.5-0.8s | **20-50% better** |
| Update | <100ms | ~30-60ms | **40-70% better** |

## 📦 Installation

### Windows（推奨）
最新の [MSI インストーラー](https://github.com/sho11decade/WinTaskLite/releases/latest) をダウンロードしてインストールしてください。

### Portable
[releases](https://github.com/sho11decade/WinTaskLite/releases) から単体 `.exe` をダウンロードすれば、インストール不要で利用できます。

## 🚀 Development

```bash
# 依存関係をインストール
npm install

# 開発モードで起動
npm run tauri dev

# 本番ビルド
npm run tauri build
```

## ⌨️ Keyboard Shortcuts

- **F1** - ヘルプダイアログを表示
- **F2** - プロセス/リソースタブを切り替え
- **F3** - 更新間隔を短くする（高速）
- **F4** - 更新間隔を長くする（低負荷）
- **F5** - 即時更新
- **F9** - 最上位プロセスを終了
- **F10** - アプリ終了

詳細はアプリ内で **F1** を押すか、[FAQ.md](FAQ.md) を参照してください。

## 🔧 Technology

- **バックエンド**: Rust + sysinfo
- **フロントエンド**: Svelte 5 + TypeScript
- **フレームワーク**: Tauri v2
- **チャート**: カスタム SVG（外部依存なし）
- **i18n**: 独自軽量実装（約 2KB）

## 📚 Documentation

- [FAQ](FAQ.md) - よくある質問
- [Contributing](CONTRIBUTING.md) - 開発ガイド
- [Changelog](CHANGELOG.md) - 変更履歴
- [Design](design.md) - 仕様ドキュメント

## 🤝 Contributing

コントリビュート歓迎です。参加前に [CONTRIBUTING.md](CONTRIBUTING.md) をご確認ください。

## 📝 License

MIT License（詳細は [LICENSE](LICENSE) を参照）

## 👤 Author

RiceZero [@ricezero21](https://twitter.com/ricezero21)

## 🙏 Acknowledgments

- [htop](https://htop.dev/) にインスパイアされています
- UI カラーは [Dracula Theme](https://draculatheme.com/) を利用しています
- [Tauri](https://tauri.app/)、[Rust](https://www.rust-lang.org/)、[Svelte](https://svelte.dev/) で構築されています
