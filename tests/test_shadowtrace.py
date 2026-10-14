import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import init_db, get_db_connection
from csv_processor import process_csv_content
from detector import analyze_records

class TestShadowTrace(unittest.TestCase):
    def setUp(self):
        init_db()

    def test_csv_processor(self):
        sample_csv = "timestamp,source_ip,event_type,username,status\n2026-10-14 10:00:00,192.168.1.100,login_attempt,alice,success\n"
        result = process_csv_content(sample_csv)
        self.assertEqual(result['total'], 1)
        self.assertEqual(len(result['valid_records']), 1)
        self.assertEqual(result['valid_records'][0]['source_ip'], '192.168.1.100')

    def test_detector_rules(self):
        records = [
            {'timestamp': '2026-10-14 10:00:00', 'source_ip': '1.2.3.4', 'event_type': 'login_attempt', 'username': 'admin', 'status': 'failed', 'severity': 'Low', 'detection_reason': ''},
            {'timestamp': '2026-10-14 10:00:01', 'source_ip': '1.2.3.4', 'event_type': 'login_attempt', 'username': 'admin', 'status': 'failed', 'severity': 'Low', 'detection_reason': ''},
            {'timestamp': '2026-10-14 10:00:02', 'source_ip': '1.2.3.4', 'event_type': 'login_attempt', 'username': 'admin', 'status': 'failed', 'severity': 'Low', 'detection_reason': ''},
            {'timestamp': '2026-10-14 10:00:03', 'source_ip': '1.2.3.4', 'event_type': 'login_attempt', 'username': 'admin', 'status': 'failed', 'severity': 'Low', 'detection_reason': ''},
            {'timestamp': '2026-10-14 10:00:04', 'source_ip': '1.2.3.4', 'event_type': 'login_attempt', 'username': 'admin', 'status': 'failed', 'severity': 'Low', 'detection_reason': ''},
            {'timestamp': '2026-10-14 10:00:05', 'source_ip': '5.6.7.8', 'event_type': 'unauthorized_access', 'username': 'guest', 'status': 'forbidden', 'severity': 'Low', 'detection_reason': ''}
        ]
        res = analyze_records(records)
        self.assertTrue(res['suspicious_count'] > 0)
        self.assertTrue(any('Rule 1' in d['rule_triggered'] for d in res['detections']))
        self.assertTrue(any('Rule 2' in d['rule_triggered'] for d in res['detections']))

if __name__ == '__main__':
    unittest.main()
