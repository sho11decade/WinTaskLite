<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount, onDestroy } from "svelte";
  import { t, type Language } from "$lib/i18n";

  interface ProcessInfo {
    pid: number;
    name: string;
    cpu_usage: number;
    memory_mb: number;
  }

  interface SystemStats {
    cpu_usage: number;
    memory_used_mb: number;
    memory_total_mb: number;
    memory_usage_percent: number;
  }

  let lang = $state<Language>("ja");
  let activeTab = $state<"processes" | "resources">("processes");
  let processes = $state<ProcessInfo[]>([]);
  let systemStats = $state<SystemStats | null>(null);
  let searchFilter = $state("");
  let refreshInterval = $state(1000);
  let topN = $state(20);
  let intervalId: number | null = null;

  let cpuHistory = $state<number[]>([]);
  let memoryHistory = $state<number[]>([]);
  const MAX_HISTORY = 60;

  async function fetchProcesses() {
    try {
      processes = await invoke<ProcessInfo[]>("get_processes", { topN });
    } catch (error) {
      console.error("Failed to fetch processes:", error);
    }
  }

  async function fetchSystemStats() {
    try {
      const stats = await invoke<SystemStats>("get_system_stats");
      systemStats = stats;
      
      cpuHistory = [...cpuHistory, stats.cpu_usage].slice(-MAX_HISTORY);
      memoryHistory = [...memoryHistory, stats.memory_usage_percent].slice(-MAX_HISTORY);
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
    }
  }

  async function killProcess(pid: number, name: string) {
    if (!confirm(t(lang, "dialogs.killConfirm", { name, pid }))) {
      return;
    }
    
    try {
      await invoke("kill_process", { pid });
      await fetchProcesses();
    } catch (error) {
      alert(t(lang, "dialogs.killFailed", { error: String(error) }));
    }
  }

  function startRefresh() {
    if (intervalId) clearInterval(intervalId);
    
    fetchProcesses();
    fetchSystemStats();
    
    intervalId = window.setInterval(() => {
      if (activeTab === "processes") {
        fetchProcesses();
      }
      fetchSystemStats();
    }, refreshInterval);
  }

  $effect(() => {
    startRefresh();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });

  let filteredProcesses = $derived(
    processes.filter(p => 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.pid.toString().includes(searchFilter)
    )
  );

  function getBarColor(percent: number, type: "cpu" | "memory"): string {
    if (type === "cpu") {
      if (percent < 30) return "#50fa7b";
      if (percent < 60) return "#f1fa8c";
      if (percent < 80) return "#ffb86c";
      return "#ff5555";
    } else {
      if (percent < 50) return "#50fa7b";
      if (percent < 70) return "#f1fa8c";
      if (percent < 90) return "#ffb86c";
      return "#ff5555";
    }
  }

  function formatBar(percent: number, width: number = 20): string {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  }

  function formatMemory(mb: number): string {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb.toFixed(0)}MB`;
  }
</script>

<main>
  <header>
    <div class="header-left">
      <h1>{t(lang, "title")}</h1>
      <div class="lang-switch">
        <button 
          class:active={lang === "ja"}
          onclick={() => lang = "ja"}
        >日本語</button>
        <button 
          class:active={lang === "en"}
          onclick={() => lang = "en"}
        >English</button>
      </div>
    </div>
    
    <div class="system-overview">
      <div class="meter-group">
        <div class="meter-label">{t(lang, "resources.cpu")}</div>
        <div class="meter-bar">
          <div 
            class="meter-fill" 
            style="width: {systemStats?.cpu_usage ?? 0}%; background-color: {getBarColor(systemStats?.cpu_usage ?? 0, 'cpu')}"
          ></div>
        </div>
        <div class="meter-value">{(systemStats?.cpu_usage ?? 0).toFixed(1)}%</div>
      </div>
      
      <div class="meter-group">
        <div class="meter-label">{t(lang, "resources.memory")}</div>
        <div class="meter-bar">
          <div 
            class="meter-fill" 
            style="width: {systemStats?.memory_usage_percent ?? 0}%; background-color: {getBarColor(systemStats?.memory_usage_percent ?? 0, 'memory')}"
          ></div>
        </div>
        <div class="meter-value">
          {formatMemory(systemStats?.memory_used_mb ?? 0)} / {formatMemory(systemStats?.memory_total_mb ?? 0)}
        </div>
      </div>
    </div>
  </header>

  <div class="tabs">
    <button 
      class:active={activeTab === "processes"}
      onclick={() => activeTab = "processes"}
    >
      F1 {t(lang, "tabs.processes")}
    </button>
    <button 
      class:active={activeTab === "resources"}
      onclick={() => activeTab = "resources"}
    >
      F2 {t(lang, "tabs.resources")}
    </button>
    
    <div class="tab-controls">
      <label>
        {t(lang, "settings.interval")}:
        <input 
          type="number" 
          bind:value={refreshInterval} 
          min="1000" 
          max="5000" 
          step="500"
          onchange={() => startRefresh()}
        />
        {t(lang, "settings.ms")}
      </label>
      <label>
        {t(lang, "settings.topN")}:
        <input 
          type="number" 
          bind:value={topN} 
          min="5" 
          max="100" 
          step="5"
        />
      </label>
    </div>
  </div>

  {#if activeTab === "processes"}
    <div class="content">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder={t(lang, "processTable.search")}
          bind:value={searchFilter}
        />
      </div>
      
      <div class="process-table">
        <div class="table-header">
          <div class="col-pid">{t(lang, "processTable.pid")}</div>
          <div class="col-name">{t(lang, "processTable.name")}</div>
          <div class="col-cpu">{t(lang, "processTable.cpu")}</div>
          <div class="col-memory">{t(lang, "processTable.memory")}</div>
          <div class="col-action">{t(lang, "processTable.action")}</div>
        </div>
        
        <div class="table-body">
          {#each filteredProcesses as process (process.pid)}
            <div class="table-row">
              <div class="col-pid">{process.pid}</div>
              <div class="col-name" title={process.name}>{process.name}</div>
              <div class="col-cpu">
                <span class="cpu-bar" style="color: {getBarColor(process.cpu_usage, 'cpu')}">
                  {formatBar(process.cpu_usage, 10)}
                </span>
                <span class="cpu-value">{process.cpu_usage.toFixed(1)}%</span>
              </div>
              <div class="col-memory">{formatMemory(process.memory_mb)}</div>
              <div class="col-action">
                <button 
                  class="kill-btn"
                  onclick={() => killProcess(process.pid, process.name)}
                >
                  {t(lang, "processTable.kill")}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="content resources-content">
      <div class="chart-grid">
        <div class="chart-panel">
          <div class="chart-header">
            <h3>{t(lang, "resources.cpu")} - {t(lang, "resources.history")} (60s)</h3>
            <span class="chart-value" style="color: {getBarColor(systemStats?.cpu_usage ?? 0, 'cpu')}">
              {(systemStats?.cpu_usage ?? 0).toFixed(1)}%
            </span>
          </div>
          <svg viewBox="0 0 600 100" class="chart">
            <defs>
              <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#50fa7b;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#50fa7b;stop-opacity:0.05" />
              </linearGradient>
            </defs>
            
            {#if cpuHistory.length > 0}
              <polyline
                points={cpuHistory.map((v, i) => `${i * (600 / MAX_HISTORY)},${100 - v}`).join(' ')}
                fill="url(#cpuGradient)"
                stroke="#50fa7b"
                stroke-width="2"
              />
            {/if}
            
            <!-- Grid lines -->
            <line x1="0" y1="25" x2="600" y2="25" stroke="#44475a" stroke-width="1" opacity="0.3" />
            <line x1="0" y1="50" x2="600" y2="50" stroke="#44475a" stroke-width="1" opacity="0.3" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="#44475a" stroke-width="1" opacity="0.3" />
          </svg>
        </div>

        <div class="chart-panel">
          <div class="chart-header">
            <h3>{t(lang, "resources.memory")} - {t(lang, "resources.history")} (60s)</h3>
            <span class="chart-value" style="color: {getBarColor(systemStats?.memory_usage_percent ?? 0, 'memory')}">
              {(systemStats?.memory_usage_percent ?? 0).toFixed(1)}%
            </span>
          </div>
          <svg viewBox="0 0 600 100" class="chart">
            <defs>
              <linearGradient id="memGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#bd93f9;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#bd93f9;stop-opacity:0.05" />
              </linearGradient>
            </defs>
            
            {#if memoryHistory.length > 0}
              <polyline
                points={memoryHistory.map((v, i) => `${i * (600 / MAX_HISTORY)},${100 - v}`).join(' ')}
                fill="url(#memGradient)"
                stroke="#bd93f9"
                stroke-width="2"
              />
            {/if}
            
            <!-- Grid lines -->
            <line x1="0" y1="25" x2="600" y2="25" stroke="#44475a" stroke-width="1" opacity="0.3" />
            <line x1="0" y1="50" x2="600" y2="50" stroke="#44475a" stroke-width="1" opacity="0.3" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="#44475a" stroke-width="1" opacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  {/if}

  <footer>
    <div class="footer-key"><span>F1</span> {t(lang, "footer.f1")}</div>
    <div class="footer-key"><span>F2</span> {t(lang, "footer.f2")}</div>
    <div class="footer-key"><span>F3</span> {t(lang, "footer.f3")}</div>
    <div class="footer-key"><span>F9</span> {t(lang, "footer.f9")}</div>
    <div class="footer-key"><span>F10</span> {t(lang, "footer.f10")}</div>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    background-color: #282a36;
    color: #f8f8f2;
    overflow: hidden;
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Header */
  header {
    background: linear-gradient(180deg, #44475a 0%, #383a47 100%);
    padding: 12px 16px;
    border-bottom: 2px solid #6272a4;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #8be9fd;
    text-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
  }

  .lang-switch {
    display: flex;
    gap: 4px;
    background: #282a36;
    border-radius: 4px;
    padding: 2px;
  }

  .lang-switch button {
    background: transparent;
    border: none;
    color: #6272a4;
    padding: 4px 10px;
    font-size: 11px;
    cursor: pointer;
    border-radius: 3px;
    font-family: inherit;
  }

  .lang-switch button.active {
    background: #6272a4;
    color: #f8f8f2;
  }

  .system-overview {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 400px;
  }

  .meter-group {
    display: grid;
    grid-template-columns: 80px 1fr 120px;
    gap: 12px;
    align-items: center;
  }

  .meter-label {
    font-size: 12px;
    font-weight: 600;
    color: #f1fa8c;
    text-align: right;
  }

  .meter-bar {
    height: 16px;
    background: #21222c;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid #44475a;
  }

  .meter-fill {
    height: 100%;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px currentColor;
  }

  .meter-value {
    font-size: 12px;
    font-weight: 600;
    color: #f8f8f2;
    text-align: left;
  }

  /* Tabs */
  .tabs {
    display: flex;
    background: #21222c;
    border-bottom: 1px solid #44475a;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
  }

  .tabs button {
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: #6272a4;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    border-bottom: 3px solid transparent;
  }

  .tabs button.active {
    color: #50fa7b;
    border-bottom-color: #50fa7b;
  }

  .tab-controls {
    display: flex;
    gap: 20px;
    font-size: 11px;
  }

  .tab-controls label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f8f8f2;
  }

  .tab-controls input {
    width: 60px;
    padding: 4px 6px;
    background: #282a36;
    border: 1px solid #44475a;
    color: #f8f8f2;
    border-radius: 3px;
    font-size: 11px;
    font-family: inherit;
  }

  /* Content */
  .content {
    flex: 1;
    overflow: auto;
    padding: 16px;
    background: #282a36;
  }

  .search-bar {
    margin-bottom: 12px;
  }

  .search-bar input {
    width: 100%;
    padding: 8px 12px;
    background: #21222c;
    border: 1px solid #44475a;
    color: #f8f8f2;
    border-radius: 4px;
    font-size: 13px;
    font-family: inherit;
  }

  .search-bar input:focus {
    outline: none;
    border-color: #8be9fd;
    box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
  }

  /* Process Table */
  .process-table {
    background: #21222c;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #44475a;
  }

  .table-header {
    display: grid;
    grid-template-columns: 80px 1fr 180px 120px 100px;
    gap: 12px;
    padding: 10px 16px;
    background: #383a47;
    font-weight: 700;
    font-size: 12px;
    color: #f1fa8c;
    border-bottom: 2px solid #6272a4;
  }

  .table-body {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
  }

  .table-row {
    display: grid;
    grid-template-columns: 80px 1fr 180px 120px 100px;
    gap: 12px;
    padding: 8px 16px;
    font-size: 12px;
    border-bottom: 1px solid #44475a;
  }

  .table-row:hover {
    background: #383a47;
  }

  .col-pid {
    color: #8be9fd;
    font-weight: 600;
  }

  .col-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #f8f8f2;
  }

  .col-cpu {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cpu-bar {
    font-size: 10px;
    letter-spacing: -1px;
    font-weight: 700;
  }

  .cpu-value {
    color: #f8f8f2;
    font-weight: 600;
  }

  .col-memory {
    color: #bd93f9;
    font-weight: 600;
  }

  .kill-btn {
    padding: 4px 12px;
    background: #ff5555;
    border: none;
    color: #f8f8f2;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    font-family: inherit;
  }

  .kill-btn:hover {
    background: #ff6e6e;
    box-shadow: 0 0 8px rgba(255, 85, 85, 0.5);
  }

  /* Resources */
  .resources-content {
    padding: 20px;
  }

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .chart-panel {
    background: #21222c;
    border: 1px solid #44475a;
    border-radius: 6px;
    padding: 16px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .chart-header h3 {
    margin: 0;
    font-size: 13px;
    color: #f1fa8c;
    font-weight: 600;
  }

  .chart-value {
    font-size: 18px;
    font-weight: 700;
    text-shadow: 0 0 10px currentColor;
  }

  .chart {
    width: 100%;
    height: 150px;
    background: #282a36;
    border-radius: 4px;
    border: 1px solid #44475a;
  }

  /* Footer */
  footer {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    background: #21222c;
    border-top: 1px solid #44475a;
    font-size: 11px;
  }

  .footer-key {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f8f8f2;
  }

  .footer-key span {
    background: #44475a;
    color: #f1fa8c;
    padding: 2px 8px;
    border-radius: 3px;
    font-weight: 700;
  }

  /* Scrollbar */
  :global(::-webkit-scrollbar) {
    width: 10px;
    height: 10px;
  }

  :global(::-webkit-scrollbar-track) {
    background: #21222c;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: #44475a;
    border-radius: 5px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: #6272a4;
  }
</style>
