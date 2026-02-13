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
      killFailed: "プロセスの終了に失敗しました: {error}"
    },
    footer: {
      f1: "ヘルプ",
      f2: "設定",
      f3: "検索",
      f9: "終了",
      f10: "終了"
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
      killFailed: "Failed to kill process: {error}"
    },
    footer: {
      f1: "Help",
      f2: "Setup",
      f3: "Search",
      f9: "Kill",
      f10: "Quit"
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
