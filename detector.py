def analyze_records(records):
    """
    Applies the 3 detection rules to the list of log records:
    Rule 1: Repeated Failed Logins (5+ failed logins from same IP)
    Rule 2: Suspicious Access Attempts (unauthorized access, access denied, forbidden)
    Rule 3: Unusual Login Activity (successful login after multiple failed logins from same IP)
    """
    detections = []
    
    # Track failed login attempts per IP
    ip_failed_counts = {}
    ip_events = {}

    for idx, rec in enumerate(records):
        ip = rec['source_ip']
        if ip not in ip_events:
            ip_events[ip] = []
        ip_events[ip].append(rec)

        evt_lower = rec['event_type'].lower()
        status_lower = rec['status'].lower()

        # Count failed logins
        if 'login' in evt_lower and status_lower in ['failed', 'failure', 'error', 'blocked']:
            if ip not in ip_failed_counts:
                ip_failed_counts[ip] = 0
            ip_failed_counts[ip] += 1

    # Check Rule 1: Repeated Failed Logins (5+ failed login attempts)
    flagged_ips_rule1 = set()
    for ip, count in ip_failed_counts.items():
        if count >= 5:
            flagged_ips_rule1.add(ip)
            detections.append({
                'timestamp': '2026-10-14 00:00:00', # Will use latest timestamp for this IP
                'source_ip': ip,
                'rule_triggered': 'Rule 1: Repeated Failed Logins',
                'severity': 'Critical',
                'evidence': f'Detected {count} failed login attempts from source IP {ip}.',
                'status': 'Active'
            })

    # Check Rule 2: Suspicious Access Attempts (unauthorized, access denied, forbidden)
    for rec in records:
        evt_lower = rec['event_type'].lower()
        status_lower = rec['status'].lower()
        
        suspicious_keywords = ['unauthorized', 'access_denied', 'forbidden', 'privilege_escalation', 'port_scan', 'breach']
        if any(kw in evt_lower or kw in status_lower for kw in suspicious_keywords):
            rec['severity'] = 'High'
            rec['detection_reason'] = f'Suspicious access indicator matched ({rec["event_type"]} / {rec["status"]})'
            detections.append({
                'timestamp': rec['timestamp'],
                'source_ip': rec['source_ip'],
                'rule_triggered': 'Rule 2: Suspicious Access Attempts',
                'severity': 'High',
                'evidence': f'Unauthorized or forbidden access attempt ({rec["event_type"]}) by user {rec["username"]} from {rec["source_ip"]}.',
                'status': 'Active'
            })

    # Check Rule 3: Unusual Login Activity (Successful login after multiple failed logins)
    for ip, events in ip_events.items():
        failed_before_success = 0
        has_flagged_unusual = False
        for rec in events:
            evt_lower = rec['event_type'].lower()
            status_lower = rec['status'].lower()
            if 'login' in evt_lower:
                if status_lower in ['failed', 'failure', 'error']:
                    failed_before_success += 1
                elif status_lower in ['success', 'successful'] and failed_before_success >= 2:
                    has_flagged_unusual = True
                    rec['severity'] = 'Medium'
                    rec['detection_reason'] = f'Unusual login: successful login after {failed_before_success} failed attempts.'
                    detections.append({
                        'timestamp': rec['timestamp'],
                        'source_ip': ip,
                        'rule_triggered': 'Rule 3: Unusual Login Activity',
                        'severity': 'Medium',
                        'evidence': f'Successful login by {rec["username"]} from {ip} following {failed_before_success} failed login attempts.',
                        'status': 'Active'
                    })

    # Update individual record severity for Rule 1
    for rec in records:
        ip = rec['source_ip']
        if ip in flagged_ips_rule1 and rec['severity'] == 'Low':
            rec['severity'] = 'Critical'
            rec['detection_reason'] = f'IP {ip} flagged under Rule 1 (Repeated Failed Logins, {ip_failed_counts[ip]} failures).'

    # Set remaining Low severity for normal events
    for rec in records:
        if rec['severity'] == 'Low':
            rec['detection_reason'] = 'Normal expected activity'

    suspicious_count = sum(1 for r in records if r['severity'] in ['Critical', 'High', 'Medium'])

    return {
        'records': records,
        'detections': detections,
        'suspicious_count': suspicious_count
    }
