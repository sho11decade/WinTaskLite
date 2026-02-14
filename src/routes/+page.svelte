<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { t, type Language } from '$lib/i18n';
  import HelpDialog from '$lib/components/HelpDialog.svelte';
  import AboutDialog from '$lib/components/AboutDialog.svelte';

  interface Process {
    pid: number;
    name: string;
    cpu_usage: number;
    memory_mb: number;
  }

  interface SystemStats {
    cpu_usage: number;
    memory_total_mb: number;
    memory_used_mb: number;
    memory_usage_percent: number;
  }

  interface Config {
    lang: Language;
    refreshInterval: number;
    topN: number;
  }

  let lang = $state<Language>('en');
  let activeTab = $state<'processes' | 'resources'>('processes');
  let processes = $state<Process[]>([]);
  let systemStats = $state<SystemStats>({
    cpu_usage: 0,
    memory_total_mb: 0,
    memory_used_mb: 0,
    memory_usage_percent: 0
  });
  let searchFilter = $state('');
  let refreshInterval = $state(1000);
  let topN = $state(10);
  let loading = $state(false);
  let error = $state('');
  let cpuHistory = $state<number[]>([]);
  let memoryHistory = $state<number[]>([]);
  let intervalId: number | null = null;
  let maxHistoryLength = 60;
  let showHelp = $state(false);
  let showAbout = $state(false);
  let lastUpdatedAt = $state<Date | null>(null);

  function loadConfig() {
    try {
      const saved = localStorage.getItem('tasklite-config');
      if (saved) {
        const config: Config = JSON.parse(saved);
        lang = config.lang || 'en';
        refreshInterval = config.refreshInterval || 1000;
        topN = config.topN || 10;
      }
    } catch (e) {
      console.error('Failed to load config:', e);
    }
  }

  function saveConfig() {
    try {
      const config: Config = { lang, refreshInterval, topN };
      localStorage.setItem('tasklite-config', JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }

  async function fetchProcesses() {
    try {
      loading = true;
      error = '';
      processes = await invoke<Process[]>('get_processes', { topN });
    } catch (e) {
      error = String(e);
      console.error('Failed to fetch processes:', e);
    } finally {
      loading = false;
    }
  }

  async function fetchSystemStats() {
    try {
      systemStats = await invoke<SystemStats>('get_system_stats');
      cpuHistory = [...cpuHistory, systemStats.cpu_usage].slice(-maxHistoryLength);
      memoryHistory = [...memoryHistory, systemStats.memory_usage_percent].slice(-maxHistoryLength);
      lastUpdatedAt = new Date();
    } catch (e) {
      console.error('Failed to fetch system stats:', e);
    }
  }

  async function killProcess(pid: number, name: string) {
    if (!confirm(t(lang, 'dialogs.killConfirm', { name, pid }))) {
      return;
    }

    try {
      await invoke('kill_process', { pid });
      alert(t(lang, 'dialogs.killSuccess'));
      await fetchProcesses();
    } catch (e) {
      alert(t(lang, 'dialogs.killFailed', { error: String(e) }));
    }
  }

  function startRefresh() {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    
    // インターバル設定のみ（初回データは既に取得済み）
    intervalId = window.setInterval(() => {
      fetchProcesses();
      fetchSystemStats();
    }, refreshInterval);
  }

  function handleKeyboard(e: KeyboardEvent) {
    if (e.key === 'F1') {
      e.preventDefault();
      showHelp = !showHelp;
    } else if (e.key === 'F2') {
      e.preventDefault();
      activeTab = activeTab === 'processes' ? 'resources' : 'processes';
    } else if (e.key === 'F3') {
      e.preventDefault();
      if (refreshInterval > 1000) {
        refreshInterval -= 500;
        saveConfig();
        startRefresh();
      }
    } else if (e.key === 'F4') {
      e.preventDefault();
      if (refreshInterval < 5000) {
        refreshInterval += 500;
        saveConfig();
        startRefresh();
      }
    } else if (e.key === 'F5') {
      e.preventDefault();
      fetchProcesses();
      fetchSystemStats();
    } else if (e.key === 'F9') {
      e.preventDefault();
      if (filteredProcesses.length > 0) {
        killProcess(filteredProcesses[0].pid, filteredProcesses[0].name);
      }
    } else if (e.key === 'F10') {
      e.preventDefault();
      if (confirm(t(lang, 'dialogs.quitConfirm'))) {
        window.close();
      }
    }
  }

  function getBarColor(value: number): string {
    if (value < 50) return '#50fa7b';
    if (value < 75) return '#f1fa8c';
    if (value < 90) return '#ffb86c';
    return '#ff5555';
  }

  function formatBar(value: number, width: number = 20): string {
    // Clamp value between 0 and 100 to prevent negative or excessive values
    const clampedValue = Math.max(0, Math.min(100, value));
    const filled = Math.round((clampedValue / 100) * width);
    const empty = Math.max(0, width - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  function formatMemory(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  function formatUpdatedAt(value: Date | null): string {
    if (!value) return '--:--:--';
    return value.toLocaleTimeString([], { hour12: false });
  }

  function getSparklinePoints(values: number[], width: number = 240, height: number = 72): string {
    if (values.length === 0) return '';
    const maxIndex = Math.max(values.length - 1, 1);
    return values
      .map((value, index) => {
        const x = (index / maxIndex) * width;
        const clamped = Math.max(0, Math.min(100, value));
        const y = height - (clamped / 100) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  function getSparklineArea(values: number[], width: number = 240, height: number = 72): string {
    const points = getSparklinePoints(values, width, height);
    if (!points) return '';
    return `M0,${height} L${points.replace(/ /g, ' L')} L${width},${height} Z`;
  }

  function summarize(values: number[]) {
    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return { min, max, avg };
  }

  function getSeverityClass(value: number): string {
    if (value >= 90) return 'critical';
    if (value >= 70) return 'warning';
    return '';
  }

  let filteredProcesses = $derived(
    processes.filter(p => 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.pid.toString().includes(searchFilter)
    )
  );
  let topProcess = $derived(filteredProcesses[0] ?? null);
  let cpuSummary = $derived(summarize(cpuHistory));
  let memorySummary = $derived(summarize(memoryHistory));
  let cpuSparkline = $derived(getSparklinePoints(cpuHistory));
  let memorySparkline = $derived(getSparklinePoints(memoryHistory));
  let cpuSparklineArea = $derived(getSparklineArea(cpuHistory));
  let memorySparklineArea = $derived(getSparklineArea(memoryHistory));

  // Config保存用のeffect
  $effect(() => {
    // マウント後のみ保存
    if (typeof window !== 'undefined') {
      lang;
      refreshInterval;
      topN;
      saveConfig();
    }
  });

  // topN変更時にデータ再取得
  $effect(() => {
    if (isInitialized) {
      topN;
      fetchProcesses();
    }
  });

  // インターバル変更時の処理
  let isInitialized = false;
  $effect(() => {
    if (isInitialized && refreshInterval) {
      startRefresh();
    }
  });

  onMount(async () => {
    loadConfig();
    try {
      await Promise.all([fetchProcesses(), fetchSystemStats()]);
    } catch (e) {
      console.error('Failed to initialize:', e);
    }
    startRefresh();
    isInitialized = true;
  });

  onDestroy(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  });
</script>

<svelte:window on:keydown={handleKeyboard} />

<div class="container">
  <header>
    <h1>{t(lang, 'title')}</h1>
    <div class="header-controls">
      <button class="icon-btn" onclick={() => showAbout = !showAbout} title="About" aria-label="About">
        ℹ️
      </button>
      <select bind:value={lang} class="lang-select" title={t(lang, 'tooltips.language')}>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
      <div class="system-overview">
        <div class="meter">
          <span class="meter-label">{t(lang, 'resources.cpu')}</span>
          <div class="meter-bar">
            <div 
              class="meter-fill" 
              style="width: {systemStats.cpu_usage}%; background-color: {getBarColor(systemStats.cpu_usage)}"
            ></div>
          </div>
          <span class="meter-value">{systemStats.cpu_usage.toFixed(1)}%</span>
        </div>
        <div class="meter">
          <span class="meter-label">{t(lang, 'resources.memory')}</span>
          <div class="meter-bar">
            <div 
              class="meter-fill" 
              style="width: {systemStats.memory_usage_percent}%; background-color: {getBarColor(systemStats.memory_usage_percent)}"
            ></div>
          </div>
          <span class="meter-value">{systemStats.memory_usage_percent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  </header>

  <nav class="tabs">
    <button 
      class:active={activeTab === 'processes'} 
      onclick={() => activeTab = 'processes'}
    >
      {t(lang, 'tabs.processes')}
    </button>
    <button 
      class:active={activeTab === 'resources'} 
      onclick={() => activeTab = 'resources'}
    >
      {t(lang, 'tabs.resources')}
    </button>
  </nav>

  <div class="status-strip">
    <span>{t(lang, 'status.processes')}: {filteredProcesses.length}/{processes.length}</span>
    <span>{t(lang, 'status.top')}: {topProcess ? `${topProcess.name} (${topProcess.cpu_usage.toFixed(1)}%)` : t(lang, 'status.none')}</span>
    <span>{t(lang, 'status.refresh')}: {refreshInterval}{t(lang, 'settings.ms')}</span>
    <span>{t(lang, 'status.updated')}: {formatUpdatedAt(lastUpdatedAt)}</span>
  </div>

  <div class="controls">
    {#if activeTab === 'processes'}
      <input 
        id="search-input"
        type="text" 
        bind:value={searchFilter} 
        placeholder={t(lang, 'processTable.search')}
        class="search-input"
      />
    {/if}
    <div class="settings">
      <label>
        {t(lang, 'settings.interval')}:
        <input type="number" bind:value={refreshInterval} min="100" step="100" class="number-input" />
        {t(lang, 'settings.ms')}
      </label>
      <label>
        {t(lang, 'settings.topN')}:
        <input type="number" bind:value={topN} min="5" max="100" class="number-input" />
      </label>
    </div>
  </div>

  <main>
    {#if loading && processes.length === 0}
      <div class="message">{t(lang, 'messages.loading')}</div>
    {:else if error}
      <div class="message error">
        <p>{t(lang, 'messages.error')}: {error}</p>
        <button onclick={fetchProcesses}>{t(lang, 'messages.retry')}</button>
      </div>
    {:else if activeTab === 'processes'}
      {#if filteredProcesses.length === 0}
        <div class="message">{t(lang, 'messages.noProcesses')}</div>
      {:else}
        <div class="top-process-card">
          <span class="top-process-label">{t(lang, 'status.top')}</span>
          <span class="top-process-name">{topProcess ? topProcess.name : t(lang, 'status.none')}</span>
          <span class="top-process-value">{topProcess ? `${topProcess.cpu_usage.toFixed(1)}%` : '--'}</span>
        </div>
        <table class="process-table">
          <thead>
            <tr>
              <th>{t(lang, 'processTable.rank')}</th>
              <th>{t(lang, 'processTable.pid')}</th>
              <th>{t(lang, 'processTable.name')}</th>
              <th>{t(lang, 'processTable.cpu')}</th>
              <th>{t(lang, 'processTable.memory')}</th>
              <th>{t(lang, 'processTable.action')}</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredProcesses as process, index (process.pid)}
              <tr class={getSeverityClass(process.cpu_usage)}>
                <td class="rank">{index + 1}</td>
                <td>{process.pid}</td>
                <td class="process-name">{process.name}</td>
                <td>
                  <span class="bar" style="color: {getBarColor(process.cpu_usage)}">
                    {formatBar(process.cpu_usage, 15)}
                  </span>
                  <span class="value">{process.cpu_usage.toFixed(1)}%</span>
                </td>
                <td>
                  <span class="bar" style="color: {getBarColor((process.memory_mb / systemStats.memory_total_mb) * 100)}">
                    {formatBar((process.memory_mb / systemStats.memory_total_mb) * 100, 15)}
                  </span>
                  <span class="value">{formatMemory(process.memory_mb)}</span>
                </td>
                <td>
                  <button 
                    class="kill-btn" 
                    onclick={() => killProcess(process.pid, process.name)}
                  >
                    {t(lang, 'processTable.kill')}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {:else if activeTab === 'resources'}
      <div class="resources">
        <div class="resource-card">
          <h3>{t(lang, 'resources.cpu')}</h3>
          <div class="big-meter">
            <div class="big-meter-bar">
              <div 
                class="big-meter-fill" 
                style="width: {systemStats.cpu_usage}%; background-color: {getBarColor(systemStats.cpu_usage)}"
              ></div>
            </div>
            <div class="big-meter-value">{systemStats.cpu_usage.toFixed(2)}%</div>
          </div>
          <div class="chart">
            <div class="chart-title">{t(lang, 'resources.history')}</div>
            <svg class="sparkline" viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
              {#if cpuSparklineArea}
                <path class="sparkline-area cpu" d={cpuSparklineArea}></path>
              {/if}
              {#if cpuSparkline}
                <polyline class="sparkline-line cpu" points={cpuSparkline}></polyline>
              {/if}
            </svg>
            <div class="history-summary">
              <span>{t(lang, 'resources.min')}: {cpuSummary.min.toFixed(1)}%</span>
              <span>{t(lang, 'resources.avg')}: {cpuSummary.avg.toFixed(1)}%</span>
              <span>{t(lang, 'resources.max')}: {cpuSummary.max.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="resource-card">
          <h3>{t(lang, 'resources.memory')}</h3>
          <div class="big-meter">
            <div class="big-meter-bar">
              <div 
                class="big-meter-fill" 
                style="width: {systemStats.memory_usage_percent}%; background-color: {getBarColor(systemStats.memory_usage_percent)}"
              ></div>
            </div>
            <div class="big-meter-value">{systemStats.memory_usage_percent.toFixed(2)}%</div>
          </div>
          <div class="stats">
            <div>{t(lang, 'resources.used')}: {formatMemory(systemStats.memory_used_mb)}</div>
            <div>{t(lang, 'resources.total')}: {formatMemory(systemStats.memory_total_mb)}</div>
          </div>
          <div class="chart">
            <div class="chart-title">{t(lang, 'resources.history')}</div>
            <svg class="sparkline" viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
              {#if memorySparklineArea}
                <path class="sparkline-area memory" d={memorySparklineArea}></path>
              {/if}
              {#if memorySparkline}
                <polyline class="sparkline-line memory" points={memorySparkline}></polyline>
              {/if}
            </svg>
            <div class="history-summary">
              <span>{t(lang, 'resources.min')}: {memorySummary.min.toFixed(1)}%</span>
              <span>{t(lang, 'resources.avg')}: {memorySummary.avg.toFixed(1)}%</span>
              <span>{t(lang, 'resources.max')}: {memorySummary.max.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>

  <footer>
    <span>F1: {t(lang, 'footer.f1')}</span>
    <span>F2: {t(lang, 'footer.f2')}</span>
    <span>F3: {t(lang, 'footer.f3')}</span>
    <span>F5: {t(lang, 'footer.f5')}</span>
    <span>F9: {t(lang, 'footer.f9')}</span>
    <span>F10: {t(lang, 'footer.f10')}</span>
  </footer>
</div>

<HelpDialog {lang} show={showHelp} onClose={() => showHelp = false} />
<AboutDialog {lang} show={showAbout} onClose={() => showAbout = false} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    background-color: #282a36;
    color: #f8f8f2;
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #44475a;
    border-bottom: 2px solid #6272a4;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #bd93f9;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon-btn {
    background: #44475a;
    border: 1px solid #6272a4;
    color: #f8f8f2;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .icon-btn:hover {
    background: #6272a4;
    transform: scale(1.05);
  }

  .lang-select {
    padding: 0.4rem 0.6rem;
    background-color: #282a36;
    color: #f8f8f2;
    border: 1px solid #6272a4;
    border-radius: 4px;
    font-family: inherit;
    cursor: pointer;
  }

  .lang-select:hover {
    border-color: #bd93f9;
  }

  .system-overview {
    display: flex;
    gap: 1rem;
  }

  .meter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .meter-label {
    color: #8be9fd;
    min-width: 80px;
  }

  .meter-bar {
    width: 100px;
    height: 16px;
    background-color: #282a36;
    border: 1px solid #6272a4;
    border-radius: 2px;
    overflow: hidden;
  }

  .meter-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .meter-value {
    min-width: 45px;
    text-align: right;
    color: #f1fa8c;
  }

  .tabs {
    display: flex;
    background-color: #44475a;
    border-bottom: 1px solid #6272a4;
  }

  .tabs button {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    color: #f8f8f2;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .tabs button:hover {
    background-color: #282a36;
    color: #bd93f9;
  }

  .tabs button.active {
    border-bottom-color: #bd93f9;
    color: #bd93f9;
  }

  .status-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    padding: 0.45rem 1rem;
    background-color: #282a36;
    border-bottom: 1px solid #44475a;
    color: #8be9fd;
    font-size: 0.8rem;
  }

  .status-strip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #44475a;
    border-bottom: 1px solid #6272a4;
    gap: 1rem;
  }

  .search-input {
    flex: 1;
    max-width: 400px;
    padding: 0.5rem;
    background-color: #282a36;
    border: 1px solid #6272a4;
    border-radius: 4px;
    color: #f8f8f2;
    font-family: inherit;
  }

  .search-input:focus {
    outline: none;
    border-color: #bd93f9;
  }

  .settings {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .settings label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #8be9fd;
  }

  .number-input {
    width: 70px;
    padding: 0.4rem;
    background-color: #282a36;
    border: 1px solid #6272a4;
    border-radius: 4px;
    color: #f8f8f2;
    font-family: inherit;
  }

  .number-input:focus {
    outline: none;
    border-color: #bd93f9;
  }

  main {
    flex: 1;
    overflow: auto;
    padding: 1rem;
  }

  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1.2rem;
    color: #8be9fd;
  }

  .message.error {
    color: #ff5555;
  }

  .message button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #bd93f9;
    border: none;
    border-radius: 4px;
    color: #282a36;
    font-family: inherit;
    cursor: pointer;
  }

  .message button:hover {
    background-color: #ff79c6;
  }

  .process-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .top-process-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.6rem;
    background: #282a36;
    border: 1px solid #6272a4;
    border-radius: 6px;
  }

  .top-process-label {
    color: #8be9fd;
    font-size: 0.8rem;
  }

  .top-process-name {
    color: #50fa7b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .top-process-value {
    color: #f1fa8c;
    font-weight: 700;
  }

  .process-table th {
    text-align: left;
    padding: 0.55rem 0.65rem;
    background-color: #44475a;
    color: #bd93f9;
    border-bottom: 2px solid #6272a4;
    position: sticky;
    top: 0;
  }

  .process-table td {
    padding: 0.45rem 0.65rem;
    border-bottom: 1px solid #44475a;
  }

  .process-table tbody tr:hover {
    background-color: #44475a;
  }

  .process-table tbody tr.warning {
    background-color: rgba(255, 184, 108, 0.08);
  }

  .process-table tbody tr.critical {
    background-color: rgba(255, 85, 85, 0.12);
  }

  .rank {
    color: #6272a4;
    width: 40px;
  }

  .process-name {
    color: #8be9fd;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar {
    font-family: monospace;
    margin-right: 0.5rem;
    letter-spacing: -1px;
  }

  .value {
    color: #f1fa8c;
  }

  .kill-btn {
    padding: 0.3rem 0.8rem;
    background-color: #ff5555;
    border: none;
    border-radius: 4px;
    color: #282a36;
    font-family: inherit;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .kill-btn:hover {
    background-color: #ff6e6e;
  }

  .resources {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .resource-card {
    background-color: #44475a;
    border: 1px solid #6272a4;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .resource-card h3 {
    margin: 0 0 1rem 0;
    color: #bd93f9;
    font-size: 1.2rem;
  }

  .big-meter {
    margin-bottom: 1.5rem;
  }

  .big-meter-bar {
    width: 100%;
    height: 30px;
    background-color: #282a36;
    border: 2px solid #6272a4;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .big-meter-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .big-meter-value {
    font-size: 1.5rem;
    color: #f1fa8c;
    text-align: center;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    color: #8be9fd;
  }

  .chart {
    margin-top: 1rem;
  }

  .chart-title {
    font-size: 0.9rem;
    color: #8be9fd;
    margin-bottom: 0.5rem;
  }

  .sparkline {
    width: 100%;
    height: 92px;
    background-color: #282a36;
    border: 1px solid #6272a4;
    border-radius: 4px;
    display: block;
  }

  .sparkline-line {
    fill: none;
    stroke-width: 2;
  }

  .sparkline-line.cpu {
    stroke: #50fa7b;
  }

  .sparkline-line.memory {
    stroke: #8be9fd;
  }

  .sparkline-area {
    opacity: 0.2;
  }

  .sparkline-area.cpu {
    fill: #50fa7b;
  }

  .sparkline-area.memory {
    fill: #8be9fd;
  }

  .history-summary {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: #f1fa8c;
  }

  footer {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    background-color: #44475a;
    border-top: 2px solid #6272a4;
    font-size: 0.85rem;
  }

  footer span {
    color: #8be9fd;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #282a36;
  }

  ::-webkit-scrollbar-thumb {
    background: #44475a;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6272a4;
  }
</style>
