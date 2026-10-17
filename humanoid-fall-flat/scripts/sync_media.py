#!/usr/bin/env python3
"""Add local media to works.json without changing any existing artwork metadata."""
import argparse
import json
import os
from pathlib import Path
import tempfile
from urllib.parse import quote, unquote, urlsplit
from uuid import NAMESPACE_URL, uuid5

TYPES = {
    **dict.fromkeys(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'), 'Image'),
    **dict.fromkeys(('.mp4', '.webm', '.mov', '.m4v', '.ogv'), 'Video'),
    **dict.fromkeys(('.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'), 'Sound'),
}
CATEGORIES = {'robotic-failures': 'Robotic Failures', 'failure-inspired-art': 'Artistic Responses'}
TAGS = {'failure-in-life': 'Failure in Life', 'failure-in-olympics': 'Failure in Olympics',
        'failure-on-stage': 'Failure on Stage'}
ASSET_FOLDERS = {'covers', 'thumbnails', 'previews'}


def local_path(value):
    if not isinstance(value, str):
        return None
    url = urlsplit(value)
    if url.scheme or url.netloc or url.path.startswith('/'):
        return None
    path = Path(unquote(url.path)).as_posix()
    return path if path.startswith('media/') and '..' not in Path(path).parts else None


def generate(gallery):
    gallery = Path(gallery).resolve()
    media = gallery / 'media'
    target = gallery / 'works.json'
    if not media.is_dir():
        raise ValueError(f'Media folder not found: {media}')
    original = target.read_text(encoding='utf-8-sig') if target.exists() else None
    records = json.loads(original) if original is not None else []
    if not isinstance(records, list) or any(not isinstance(a, dict) for a in records):
        raise ValueError('works.json must be an array of artwork objects. No changes were made.')
    ids = [a.get('id') for a in records if a.get('id')]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate work IDs in works.json. No changes were made.')
    known = {local_path(a.get('src')) for a in records}
    covers = {local_path(a.get('cover')) for a in records}
    added = []
    for file in sorted(media.rglob('*'), key=lambda p: p.relative_to(media).as_posix()):
        relative = file.relative_to(gallery).as_posix()
        parts = file.relative_to(media).parts
        if not file.is_file() or file.suffix.lower() not in TYPES:
            continue
        if any(p.startswith('.') for p in parts) or any(p.lower() in ASSET_FOLDERS for p in parts[:-1]):
            continue
        if not file.resolve().is_relative_to(media.resolve()):
            continue
        if relative in known or relative in covers:
            continue
        category = 'Robotic Failures'
        tag_parts = list(parts[:-1])
        if tag_parts and tag_parts[0].lower() in CATEGORIES:
            category = CATEGORIES[tag_parts.pop(0).lower()]
        tags = [TAGS.get(t.lower(), t.replace('-', ' ').replace('_', ' ')) for t in tag_parts]
        work_id = 'media-' + uuid5(NAMESPACE_URL, 'uaad-hff/' + relative).hex
        if work_id in ids:
            raise ValueError(f'Generated ID conflicts with an existing entry: {relative}')
        work = dict(id=work_id, title=file.stem, artist='', category=category,
                    type=TYPES[file.suffix.lower()], src=quote(relative, safe='/'), cover='',
                    artistUrl='', sourceUrl='', sourceCredit='', tags=', '.join(dict.fromkeys(tags)),
                    description='', fileName=file.name, hidden=False)
        records.append(work)
        ids.append(work_id)
        known.add(relative)
        added.append(relative)
    # Keep bytes unchanged on no-op runs, including manual formatting.
    if added or original is None:
        content = json.dumps(records, ensure_ascii=False, indent=2) + '\n'
        fd, temporary = tempfile.mkstemp(prefix='.works-', suffix='.json', dir=gallery)
        try:
            with os.fdopen(fd, 'w', encoding='utf-8') as stream:
                stream.write(content)
            os.replace(temporary, target)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)
    return added, len(records)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--gallery-dir', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        added, total = generate(args.gallery_dir)
    except (ValueError, OSError) as error:
        parser.exit(1, f'Cannot sync media: {error}\n')
    print(f'Added {len(added)} work(s). Archive has {total} entries.')
    for path in added:
        print(f'  + {path}')


if __name__ == '__main__':
    main()
