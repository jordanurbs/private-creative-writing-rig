#!/usr/bin/env python3
"""Generate images using Venice AI. Used by the /project:image command."""

import argparse
import json
import os
import sys
import urllib.request
import base64
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Generate images via Venice AI')
    parser.add_argument('--prompt', required=True, help='Image description')
    parser.add_argument('--model', default='nano-banana-pro', help='Venice image model')
    parser.add_argument('--out-dir', default='.', help='Output directory')
    parser.add_argument('--width', type=int, default=1024)
    parser.add_argument('--height', type=int, default=1024)
    args = parser.parse_args()

    api_key = os.environ.get('VENICE_API_KEY', '')
    if not api_key:
        env_path = Path(__file__).parent.parent / '.env'
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith('VENICE_API_KEY='):
                    api_key = line.split('=', 1)[1].strip().strip('"').strip("'")

    if not api_key:
        print('ERROR: VENICE_API_KEY not set. Add it to .env or set as environment variable.')
        sys.exit(1)

    os.makedirs(args.out_dir, exist_ok=True)

    body = json.dumps({
        'model': args.model,
        'prompt': args.prompt,
        'width': args.width,
        'height': args.height,
        'safe_mode': False,
    }).encode()

    req = urllib.request.Request(
        'https://api.venice.ai/api/v1/image/generate',
        data=body,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
    )

    print(f'Generating: {args.prompt[:60]}...')
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f'ERROR: {e}')
        sys.exit(1)

    image_data = None
    if 'data' in data and data['data']:
        image_data = data['data'][0].get('b64_json')
    elif 'images' in data and data['images']:
        image_data = data['images'][0]

    if not image_data:
        print('ERROR: No image data in response')
        sys.exit(1)

    import time
    slug = args.prompt[:40].lower()
    for ch in ' /\\:*?"<>|':
        slug = slug.replace(ch, '-')
    slug = '-'.join(filter(None, slug.split('-')))
    filename = f'{slug}-{int(time.time())}.png'
    filepath = os.path.join(args.out_dir, filename)

    with open(filepath, 'wb') as f:
        f.write(base64.b64decode(image_data))

    print(f'MEDIA: {filepath}')
    print(f'Saved to: {filepath}')

if __name__ == '__main__':
    main()
