# TaskLite へのコントリビュート

TaskLite へのご関心ありがとうございます。このドキュメントでは、開発参加のためのガイドラインを説明します。

## 開発環境セットアップ

### 前提条件
- Node.js 20 以上
- Rust 1.70 以上
- Windows 10/11（主要ターゲット）

### はじめ方

1. リポジトリをクローンします。
```bash
git clone https://github.com/sho11decade/WinTaskLite.git
cd WinTaskLite
```

2. 依存関係をインストールします。
```bash
npm install
```

3. 開発モードで起動します。
```bash
npm run tauri dev
```

## プロジェクト構成

```
WinTaskLite/
├── src/                    # フロントエンド（Svelte）
│   ├── routes/             # SvelteKit ルート
│   │   └── +page.svelte    # メインアプリページ
│   └── lib/                # 共通ライブラリ
│       ├── i18n.ts         # 国際化
│       └── components/     # 再利用可能コンポーネント
├── src-tauri/              # バックエンド（Rust）
│   ├── src/
│   │   ├── lib.rs          # Tauri コマンド
│   │   └── main.rs         # エントリーポイント
│   └── Cargo.toml          # Rust 依存関係
├── static/                 # 静的アセット
└── .github/                # GitHub Actions ワークフロー
```

## コードスタイル

### TypeScript / Svelte
- 型安全のため TypeScript を利用する
- Svelte 5 の runes（`$state`, `$derived`, `$effect`）に従う
- インデントは 2 スペース
- 意味のある変数名を使う

### Rust
- Rust 標準フォーマット（`cargo fmt`）に従う
- `cargo clippy` で一般的なミスを検出する
- Rust らしい（idiomatic）実装を優先する
- 公開 API はドキュメント化する

## 開発ワークフロー

### 機能追加時

1. 機能ブランチを作成します。
```bash
git checkout -b feature/your-feature-name
```

2. 変更は明確で小さなコミット単位で行います。

3. 十分にテストします。
```bash
npm run tauri dev
cargo test --manifest-path src-tauri/Cargo.toml
```

4. 必要に応じてドキュメントを更新します。

5. Pull Request を作成します。

### Pull Request ガイドライン

- 変更内容を明確に説明する
- 関連 Issue があれば参照する
- CI チェックが通ることを確認する
- 1 つの機能/修正に焦点を絞る
- `CHANGELOG.md` に変更内容を追記する

## テスト

### 手動テスト
- Windows 10 と Windows 11 の両方で確認する
- すべてのキーボードショートカットが動作することを確認する
- 英語・日本語の両言語表示を確認する
- 表示プロセス件数を変えて確認する
- 性能目標を満たすことを確認する

### 性能目標
- メモリ使用量: 25MB 未満
- CPU 使用率: 平均 1% 未満
- 起動時間: 1 秒未満
- 更新レイテンシ: 100ms 未満

## 翻訳を追加するには

新しい言語を追加する場合は次の手順に従ってください。

1. `src/lib/i18n.ts` を編集する
2. `Language` 型に言語コードを追加する
3. 翻訳オブジェクトを一式追加する
4. UI の言語セレクターを更新する
5. すべての文字列が正しく表示されることを確認する

## リリース手順

リリースは GitHub Actions で自動化されています。

1. 以下のバージョンを更新します。
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. `CHANGELOG.md` を更新します。

3. バージョンタグを作成・push します。
```bash
git tag v0.2.0
git push origin v0.2.0
```

4. GitHub Actions がビルドを実行し、ドラフトリリースを作成します。

5. 内容を確認してリリース公開します。

## 行動規範

- 互いを尊重し、包摂的に振る舞う
- 建設的なフィードバックを行う
- 人ではなくコードに焦点を当てる
- 前向きなコミュニティづくりに協力する

## 質問・相談

- バグ報告や機能要望は Issue を作成してください
- 一般的な質問は Discussions を利用してください
- 新規作成前に既存 Issue を確認してください

## ライセンス

コントリビュートしたコードは MIT License の下で公開されることに同意したものとみなされます。
