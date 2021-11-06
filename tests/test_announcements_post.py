import requests
from argparse import ArgumentParser
import json
import time

if __name__ == '__main__':
    parser = ArgumentParser(description='Tests announcements')
    parser.add_argument('--key', help='API key')
    parser.add_argument('--file', help='Path to message file')

    args = parser.parse_args()

    with open(args.file, 'r') as f:
        resp = requests.post('http://localhost:8081/api/components/announcements/message', data=json.dumps({
            'api_key': args.key,
            'body': json.loads(f.read())
        }))
        print(resp.status_code, resp.json())

        time.sleep(1)
        resp = requests.get('http://localhost:8081/api/components/announcements/message')
        print(resp.status_code, resp.json())
