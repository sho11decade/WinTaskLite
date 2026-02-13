export const translations = {
  ja: {
    title: "TaskLite",
    tabs: {
      processes: "プロセス",
      resources: "リソース"
    },
    processTable: {
      pid: "PID",
      name: "プロセス名",
      cpu: "CPU%",
      memory: "メモリ",
      action: "操作",
      kill: "終了",
      search: "プロセスを検索..."
    },
    resources: {
      cpu: "CPU使用率",
      memory: "メモリ使用率",
      used: "使用中",
      total: "合計",
      history: "履歴"
    },
    settings: {
      interval: "更新間隔",
      topN: "表示数",
      language: "言語",
      ms: "ミリ秒"
    },
    dialogs: {
      killConfirm: "プロセス「{name}」(PID: {pid})を終了しますか？",
      killSuccess: "プロセスを終了しました",
      killFailed: "プロセスの終了に失敗しました: {error}",
      quitConfirm: "TaskLiteを終了しますか？"
    },
    messages: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
      retry: "再試行",
      noProcesses: "プロセスが見つかりません"
    },
    footer: {
      f1: "ヘルプ",
      f2: "タブ",
      f3: "速く",
      f4: "遅く",
      f5: "更新",
      f9: "終了",
      f10: "終了"
    },
    help: {
      title: "ヘルプ - キーボードショートカット",
      close: "閉じる",
      shortcuts: {
        title: "キーボードショートカット",
        f1: "ヘルプを表示",
        f2: "プロセス/リソースタブを切り替え",
        f3: "更新間隔を短縮",
        f4: "更新間隔を延長",
        f5: "即座に更新",
        f9: "プロセスを終了（未実装）",
        f10: "アプリケーションを終了",
        search: "検索フィールドにフォーカス"
      },
      features: {
        title: "機能",
        processes: "プロセス管理 - CPU使用率の高いプロセスを表示・終了",
        resources: "リソース監視 - CPUとメモリの使用状況をリアルタイムで表示",
        charts: "履歴グラフ - 過去60秒のCPUとメモリの使用状況",
        config: "設定の保存 - 言語、更新間隔、表示数を自動保存"
      },
      tips: {
        title: "ヒント",
        tip1: "検索ボックスでプロセス名をフィルタリング",
        tip2: "更新間隔を調整してCPU使用率を最適化",
        tip3: "リソースタブでシステム全体の状況を確認",
        tip4: "管理者権限が必要なプロセスもあります"
      }
    },
    about: {
      title: "TaskLiteについて",
      version: "バージョン",
      description: "軽量かつ高速なWindowsシステムモニター",
      features: "htopインスパイアのUI、多言語対応、最適化されたパフォーマンス",
      github: "GitHub",
      license: "MITライセンス",
      close: "閉じる"
    },
    tooltips: {
      language: "表示言語を切り替え",
      interval: "プロセス情報の更新頻度",
      topN: "表示するプロセスの最大数",
      search: "プロセス名で検索",
      kill: "このプロセスを終了",
      refresh: "今すぐ更新"
    }
  },
  en: {
    title: "TaskLite",
    tabs: {
      processes: "Processes",
      resources: "Resources"
    },
    processTable: {
      pid: "PID",
      name: "Process Name",
      cpu: "CPU%",
      memory: "Memory",
      action: "Action",
      kill: "Kill",
      search: "Search processes..."
    },
    resources: {
      cpu: "CPU Usage",
      memory: "Memory Usage",
      used: "Used",
      total: "Total",
      history: "History"
    },
    settings: {
      interval: "Interval",
      topN: "Top N",
      language: "Language",
      ms: "ms"
    },
    dialogs: {
      killConfirm: "Kill process \"{name}\" (PID: {pid})?",
      killSuccess: "Process terminated successfully",
      killFailed: "Failed to kill process: {error}",
      quitConfirm: "Quit TaskLite?"
    },
    messages: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      noProcesses: "No processes found"
    },
    footer: {
      f1: "Help",
      f2: "Tab",
      f3: "Faster",
      f4: "Slower",
      f5: "Refresh",
      f9: "Kill",
      f10: "Quit"
    },
    help: {
      title: "Help - Keyboard Shortcuts",
      close: "Close",
      shortcuts: {
        title: "Keyboard Shortcuts",
        f1: "Show this help",
        f2: "Toggle Processes/Resources tab",
        f3: "Decrease refresh interval (faster)",
        f4: "Increase refresh interval (slower)",
        f5: "Refresh immediately",
        f9: "Kill process (not implemented)",
        f10: "Quit application",
        search: "Focus search field"
      },
      features: {
        title: "Features",
        processes: "Process Management - View and kill high CPU processes",
        resources: "Resource Monitoring - Real-time CPU and memory usage",
        charts: "History Charts - 60 seconds of CPU and memory history",
        config: "Persistent Settings - Language, interval, and display count auto-saved"
      },
      tips: {
        title: "Tips",
        tip1: "Use search box to filter processes by name",
        tip2: "Adjust refresh interval to optimize CPU usage",
        tip3: "Check Resources tab for overall system status",
        tip4: "Some processes require administrator privileges"
      }
    },
    about: {
      title: "About TaskLite",
      version: "Version",
      description: "Lightweight and fast Windows system monitor",
      features: "htop-inspired UI, multilingual support, optimized performance",
      github: "GitHub",
      license: "MIT License",
      close: "Close"
    },
    tooltips: {
      language: "Switch display language",
      interval: "How often to update process information",
      topN: "Maximum number of processes to display",
      search: "Search by process name",
      kill: "Terminate this process",
      refresh: "Update now"
    }
  }
};

export type Language = "ja" | "en";

export function t(lang: Language, key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== "string") {
    return key;
  }
  
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
  }
  
  return value;
}
