<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount, onDestroy } from "svelte";

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

  let activeTab = $state<"processes" | "resources">("processes");
  let processes = $state<ProcessInfo[]>([]);
  let systemStats = $state<SystemStats | null>(null);
  let searchFilter = $state("");
  let refreshInterval = $state(1000);
  let topN = $state(20);
  let intervalId: number | null = null;

  let cpuHistory = $state<number[]>([]);
  let memoryHistory = $state<number[]>([]);
  const MAX_HISTORY = 30;

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
    if (!confirm(`Are you sure you want to kill process "${name}" (PID: ${pid})?`)) {
      return;
    }
    
    try {
      await invoke("kill_process", { pid });
      await fetchProcesses();
    } catch (error) {
      alert(`Failed to kill process: ${error}`);
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
</script>

<main>
  <header>
    <h1>TaskLite</h1>
    <div class="controls">
      <label>
        Interval (ms):
        <input 
          type="number" 
          bind:value={refreshInterval} 
          min="1000" 
          max="5000" 
          step="500"
          onchange={() => startRefresh()}
        />
      </label>
      <label>
        Top N:
        <input 
          type="number" 
          bind:value={topN} 
          min="5" 
          max="100" 
          step="5"
        />
      </label>
    </div>
  </header>

  <div class="tabs">
    <button 
      class:active={activeTab === "processes"}
      onclick={() => activeTab = "processes"}
    >
      Processes
    </button>
    <button 
      class:active={activeTab === "resources"}
      onclick={() => activeTab = "resources"}
    >
      Resources
    </button>
  </div>

  {#if activeTab === "processes"}
    <div class="processes-view">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search processes..." 
          bind:value={searchFilter}
        />
      </div>
      
      <table>
        <thead>
          <tr>
            <th>PID</th>
            <th>Name</th>
            <th>CPU %</th>
            <th>Memory (MB)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredProcesses as process (process.pid)}
            <tr>
              <td>{process.pid}</td>
              <td class="process-name">{process.name}</td>
              <td>{process.cpu_usage.toFixed(1)}%</td>
              <td>{process.memory_mb.toFixed(1)}</td>
              <td>
                <button 
                  class="kill-btn"
                  onclick={() => killProcess(process.pid, process.name)}
                >
                  Kill
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="resources-view">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>CPU Usage</h3>
          <div class="stat-value">{systemStats?.cpu_usage.toFixed(1) ?? "0.0"}%</div>
        </div>
        <div class="stat-card">
          <h3>Memory Usage</h3>
          <div class="stat-value">{systemStats?.memory_usage_percent.toFixed(1) ?? "0.0"}%</div>
          <div class="stat-detail">
            {systemStats?.memory_used_mb.toFixed(0) ?? "0"} / 
            {systemStats?.memory_total_mb.toFixed(0) ?? "0"} MB
          </div>
        </div>
      </div>

      <div class="charts">
        <div class="chart-container">
          <h3>CPU History (30s)</h3>
          <svg viewBox="0 0 300 100" class="chart">
            <polyline
              points={cpuHistory.map((v, i) => `${i * (300 / MAX_HISTORY)},${100 - v}`).join(' ')}
              fill="none"
              stroke="#4a9eff"
              stroke-width="2"
            />
          </svg>
        </div>

        <div class="chart-container">
          <h3>Memory History (30s)</h3>
          <svg viewBox="0 0 300 100" class="chart">
            <polyline
              points={memoryHistory.map((v, i) => `${i * (300 / MAX_HISTORY)},${100 - v}`).join(' ')}
              fill="none"
              stroke="#ff6b6b"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background-color: #1e1e1e;
    color: #d4d4d4;
    overflow: hidden;
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: #252526;
    border-bottom: 1px solid #3e3e42;
  }

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .controls {
    display: flex;
    gap: 16px;
    font-size: 13px;
  }

  .controls label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .controls input {
    width: 70px;
    padding: 4px 8px;
    background-color: #3c3c3c;
    border: 1px solid #555;
    color: #d4d4d4;
    border-radius: 3px;
    font-size: 12px;
  }

  .tabs {
    display: flex;
    background-color: #2d2d30;
    border-bottom: 1px solid #3e3e42;
  }

  .tabs button {
    padding: 10px 24px;
    background: none;
    border: none;
    color: #969696;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 2px solid transparent;
    transition: none;
  }

  .tabs button.active {
    color: #d4d4d4;
    border-bottom-color: #4a9eff;
  }

  .tabs button:hover {
    background-color: #3e3e42;
  }

  .processes-view {
    flex: 1;
    overflow: auto;
    padding: 12px;
  }

  .search-bar {
    margin-bottom: 12px;
  }

  .search-bar input {
    width: 100%;
    padding: 8px 12px;
    background-color: #3c3c3c;
    border: 1px solid #555;
    color: #d4d4d4;
    border-radius: 3px;
    font-size: 13px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  thead {
    background-color: #2d2d30;
    position: sticky;
    top: 0;
  }

  th {
    text-align: left;
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid #3e3e42;
  }

  td {
    padding: 6px 12px;
    border-bottom: 1px solid #3e3e42;
  }

  tbody tr:hover {
    background-color: #2a2a2a;
  }

  .process-name {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kill-btn {
    padding: 3px 10px;
    background-color: #c72e2e;
    border: none;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
  }

  .kill-btn:hover {
    background-color: #a92626;
  }

  .resources-view {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background-color: #252526;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #3e3e42;
  }

  .stat-card h3 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #969696;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .stat-detail {
    font-size: 12px;
    color: #969696;
  }

  .charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }

  .chart-container {
    background-color: #252526;
    padding: 16px;
    border-radius: 6px;
    border: 1px solid #3e3e42;
  }

  .chart-container h3 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #969696;
  }

  .chart {
    width: 100%;
    height: 120px;
    background-color: #1e1e1e;
    border-radius: 3px;
  }
</style>
