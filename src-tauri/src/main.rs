// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use sysinfo::{System, SystemExt, ProcessExt};
use serde::Serialize;

fn main() {
    tasklite_lib::run()
}
