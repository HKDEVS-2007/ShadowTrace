import csv
import io

def process_csv_content(file_stream):
    """
    Processes a CSV file stream (bytes or string), validates columns,
    and returns a list of dictionaries along with stats (total, valid, invalid).
    """
    if hasattr(file_stream, 'read'):
        content = file_stream.read()
        if isinstance(content, bytes):
            content = content.decode('utf-8', errors='ignore')
    else:
        content = str(file_stream)

    f = io.StringIO(content)
    reader = csv.reader(f)
    
    try:
        header = next(reader)
    except StopIteration:
        raise ValueError("Uploaded CSV file is empty.")

    # Normalize header: lowercase, strip whitespace
    normalized_header = [col.strip().lower() for col in header]
    
    # Map required/optional columns (case-insensitive)
    # Expected: timestamp, source_ip, event_type, username, status
    col_map = {}
    for req in ['timestamp', 'source_ip', 'event_type', 'username', 'status']:
        if req in normalized_header:
            col_map[req] = normalized_header.index(req)
        else:
            col_map[req] = None

    # Validate that at least source_ip or event_type or timestamp is present
    if col_map['source_ip'] is None and col_map['event_type'] is None:
        raise ValueError("CSV missing required columns (must contain at least 'source_ip' and 'event_type').")

    valid_records = []
    invalid_count = 0
    total_count = 0

    for row in reader:
        total_count += 1
        if not row or all(not cell.strip() for cell in row):
            invalid_count += 1
            continue

        try:
            timestamp = row[col_map['timestamp']].strip() if col_map['timestamp'] is not None and len(row) > col_map['timestamp'] else '2026-10-14 00:00:00'
            source_ip = row[col_map['source_ip']].strip() if col_map['source_ip'] is not None and len(row) > col_map['source_ip'] else '127.0.0.1'
            event_type = row[col_map['event_type']].strip() if col_map['event_type'] is not None and len(row) > col_map['event_type'] else 'unknown_event'
            username = row[col_map['username']].strip() if col_map['username'] is not None and len(row) > col_map['username'] else 'anonymous'
            status = row[col_map['status']].strip() if col_map['status'] is not None and len(row) > col_map['status'] else 'unknown'

            if not source_ip or not event_type:
                invalid_count += 1
                continue

            valid_records.append({
                'timestamp': timestamp or '2026-10-14 00:00:00',
                'source_ip': source_ip,
                'event_type': event_type,
                'username': username,
                'status': status,
                'severity': 'Low',
                'detection_reason': 'Normal activity'
            })
        except Exception:
            invalid_count += 1

    return {
        'total': total_count,
        'valid_records': valid_records,
        'invalid_count': invalid_count
    }
