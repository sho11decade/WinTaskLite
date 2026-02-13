use serde::Serialize;
use sysinfo::{ProcessRefreshKind, System};
use std::sync::Mutex;

#[derive(Debug, Serialize, Clone)]
struct ProcessInfo {
    pid: u32,
    name: String,
    cpu_usage: f32,
    memory_mb: f64,
}

#[derive(Debug, Serialize)]
struct SystemStats {
    cpu_usage: f32,
    memory_used_mb: f64,
    memory_total_mb: f64,
    memory_usage_percent: f32,
}

struct AppState {
    system: Mutex<System>,
}

#[tauri::command]
#[allow(non_snake_case)]
fn get_processes(state: tauri::State<AppState>, topN: usize) -> Result<Vec<ProcessInfo>, String> {
    let mut sys = state.system.lock().map_err(|e| format!("Lock error: {}", e))?;
    
    // Refresh only what we need
    sys.refresh_processes_specifics(
        sysinfo::ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::new()
            .with_cpu()
            .with_memory(),
    );
    
    // Pre-allocate with estimated capacity
    let mut processes: Vec<ProcessInfo> = Vec::with_capacity(topN.min(100));
    
    for (pid, process) in sys.processes() {
        processes.push(ProcessInfo {
            pid: pid.as_u32(),
            name: process.name().to_string_lossy().into_owned(),
            cpu_usage: process.cpu_usage(),
            memory_mb: process.memory() as f64 / 1_048_576.0,
        });
    }
    
    // Use unstable sort for better performance (order of equal elements doesn't matter)
    processes.sort_unstable_by(|a, b| 
        b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap_or(std::cmp::Ordering::Equal)
    );
    
    processes.truncate(topN);
    processes.shrink_to_fit(); // Free excess capacity
    
    Ok(processes)
}

#[tauri::command]
fn get_system_stats(state: tauri::State<AppState>) -> Result<SystemStats, String> {
    let mut sys = state.system.lock().map_err(|e| format!("Lock error: {}", e))?;
    
    // Refresh only CPU and memory
    sys.refresh_cpu_usage();
    sys.refresh_memory();
    
    let memory_total = sys.total_memory() as f64 / 1_048_576.0;
    let memory_used = sys.used_memory() as f64 / 1_048_576.0;
    let memory_percent = if memory_total > 0.0 {
        ((memory_used / memory_total) * 100.0) as f32
    } else {
        0.0
    };
    
    Ok(SystemStats {
        cpu_usage: sys.global_cpu_usage(),
        memory_used_mb: memory_used,
        memory_total_mb: memory_total,
        memory_usage_percent: memory_percent,
    })
}

#[tauri::command]
fn kill_process(state: tauri::State<AppState>, pid: u32) -> Result<bool, String> {
    let sys = state.system.lock().map_err(|e| format!("Lock error: {}", e))?;
    
    let sysinfo_pid = sysinfo::Pid::from_u32(pid);
    
    if let Some(process) = sys.process(sysinfo_pid) {
        if process.kill() {
            Ok(true)
        } else {
            Err("Failed to kill process (insufficient permissions or system process)".to_string())
        }
    } else {
        Err("Process not found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize with minimal refresh
    let mut sys = System::new();
    sys.refresh_cpu_usage();
    sys.refresh_memory();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            system: Mutex::new(sys),
        })
        .invoke_handler(tauri::generate_handler![
            get_processes,
            get_system_stats,
            kill_process
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
