# ShadowTrace — Security Log Analyzer & Threat Detection Prototype

ShadowTrace is a lightweight security log analysis and suspicious activity detection tool built as a university semester-1 BS Cyber Security project prototype. It helps users analyze CSV log files, identify potentially suspicious events using predefined detection rules, and view the results through a professional SOC (Security Operations Center) dashboard.

---

## Features

1. **Professional SOC Dashboard**:
   - Summary cards for Total Log Events, Suspicious Events, Critical Alerts, and Analysis Status.
   - Interactive Chart.js charts (Normal vs. Suspicious Events, Events by Severity, Event Activity Over Time).
   - Recent Activity table with responsive empty states and quick actions.

2. **Log Analyzer Module**:
   - Robust CSV log file uploader (supports case-insensitive columns: `timestamp`, `source_ip`, `event_type`, `username`, `status`).
   - Built-in sample dataset loader and downloadable CSV template.
   - Search bar and severity filters with pagination and row counts.

3. **Threat Detection Module**:
   - **Rule 1**: Repeated Failed Logins (flags IPs with 5+ failed login attempts).
   - **Rule 2**: Suspicious Access Attempts (detects unauthorized, access denied, or forbidden access).
   - **Rule 3**: Unusual Login Activity (flags successful logins following multiple failed logins).
   - Interactive Threat Finding inspection modal with evidence and explanations.

4. **SQLite Persistence**:
   - Automatically initializes a local SQLite database (`instance/shadowtrace.db`) on first run.

---

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Chart.js, FontAwesome Icons
- **Backend**: Python with Flask
- **Database**: SQLite
- **CSV Processing**: Python's built-in `csv` module

---

## Setup Instructions (Windows 11)

### Prerequisites
- Python 3.8 or higher installed on Windows.

### Installation Steps

1. Open PowerShell or Command Prompt in the project root directory (`ShadowTrace/`).

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   venv\Scripts\Activate
   ```

4. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:
   ```bash
   python app.py
   ```

6. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

---

## Demonstration Workflow

1. Launch ShadowTrace (`python app.py`) and open `http://127.0.0.1:5000`.
2. View the dashboard in its initial empty state.
3. Click **Load Sample Dataset** (or go to Log Analyzer and click Load Built-in Sample Dataset).
4. Open **Log Analyzer** to inspect processed security log records with severity badges and status indicators.
5. Open **Threat Detection** to inspect rule triggers (Repeated Failed Logins, Suspicious Access, Unusual Login Activity) and click **Inspect** to review detailed evidence.
6. Return to the **Dashboard** to view updated statistics and interactive charts.
7. Restart the application (`Ctrl+C` then `python app.py`) to verify that all analyzed results persist via SQLite.
