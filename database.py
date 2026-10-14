import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'shadowtrace.db')

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Analysis runs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            total_records INTEGER DEFAULT 0,
            valid_records INTEGER DEFAULT 0,
            invalid_records INTEGER DEFAULT 0,
            suspicious_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Completed'
        )
    ''')
    
    # Log events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS log_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            timestamp TEXT,
            source_ip TEXT,
            event_type TEXT,
            username TEXT,
            status TEXT,
            severity TEXT DEFAULT 'Low',
            detection_reason TEXT,
            FOREIGN KEY (run_id) REFERENCES analysis_runs(id)
        )
    ''')
    
    # Detections / Threats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            timestamp TEXT,
            source_ip TEXT,
            rule_triggered TEXT,
            severity TEXT,
            evidence TEXT,
            status TEXT DEFAULT 'Active',
            FOREIGN KEY (run_id) REFERENCES analysis_runs(id)
        )
    ''')
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
