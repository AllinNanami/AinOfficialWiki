#!/usr/bin/env python3
"""
Replace local image references in markdown files with imagebed URLs.
Only replaces references that resolve to files in docs/ai/assets/.
"""

import re
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path("/home/excnies/AinOfficialWiki")
DOCS_DIR = PROJECT_ROOT / "docs"
AI_DIR = DOCS_DIR / "ai"
ASSETS_DIR = AI_DIR / "assets"
BASE_URL = "https://gastigado.cnies.org/d/public"

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'}


def build_target_name_map():
    """
    Build a mapping from source file path to target filename in public/.
    Handles the conflict case where image1.jpg -> image1_1.jpg.
    """
    target_dir = Path("/mnt/c/Users/excnies/OneDrive/gastigado/public")
    existing = set()
    if target_dir.exists():
        for f in target_dir.iterdir():
            if f.is_file():
                existing.add(f.name)

    # Map: source_file_absolute_path -> target_filename
    source_to_target = {}
    used_names = set()

    # Find all images in docs/ai/assets/
    for img in sorted(ASSETS_DIR.rglob("*")):
        if not img.is_file() or img.suffix.lower() not in IMAGE_EXTS:
            continue

        orig_name = img.name

        # If file with exact name exists in target, use it
        if orig_name in existing:
            source_to_target[str(img)] = orig_name
            used_names.add(orig_name)
            continue

        # If name was already used (conflict), add suffix
        target_name = orig_name
        if orig_name in used_names:
            stem = Path(orig_name).stem
            ext = Path(orig_name).suffix
            counter = 1
            while True:
                candidate = f"{stem}_{counter}{ext}"
                if candidate not in used_names and candidate not in existing:
                    target_name = candidate
                    break
                counter += 1

        source_to_target[str(img)] = target_name
        used_names.add(target_name)

    return source_to_target


def resolve_ref(ref_str, md_file):
    """Resolve a relative image reference to an absolute file path."""
    md_dir = md_file.parent
    clean = ref_str
    if clean.startswith('./'):
        clean = clean[2:]

    # Try relative to markdown file's directory
    candidate = (md_dir / clean).resolve()
    if candidate.exists() and candidate.is_file():
        return candidate

    # Try relative to docs/ai/
    candidate = (AI_DIR / clean).resolve()
    if candidate.exists() and candidate.is_file():
        return candidate

    # Try relative to docs/
    candidate = (DOCS_DIR / clean).resolve()
    if candidate.exists() and candidate.is_file():
        return candidate

    return None


def replace_refs_in_file(md_file, source_to_target):
    """
    Replace all local image references in a markdown file with imagebed URLs.
    Returns (modified, replace_count, skip_count).
    """
    content = md_file.read_text(encoding='utf-8', errors='ignore')
    original = content
    replace_count = 0
    skip_count = 0

    def replace_markdown_img(m):
        nonlocal replace_count, skip_count
        alt = m.group(1)
        path = m.group(2).strip()
        path_clean = re.sub(r'[?#].*$', '', path)

        if path_clean.startswith(('http://', 'https://', '//')):
            return m.group(0)  # external URL, skip

        resolved = resolve_ref(path_clean, md_file)
        if resolved and str(resolved) in source_to_target:
            target_name = source_to_target[str(resolved)]
            new_url = f"{BASE_URL}/{target_name}"
            replace_count += 1
            return f'![{alt}]({new_url})'
        else:
            skip_count += 1
            return m.group(0)

    def replace_html_img(m):
        nonlocal replace_count, skip_count
        full = m.group(0)
        path = m.group(1).strip()
        path_clean = re.sub(r'[?#].*$', '', path)

        if path_clean.startswith(('http://', 'https://', '//')):
            return full  # external URL, skip

        resolved = resolve_ref(path_clean, md_file)
        if resolved and str(resolved) in source_to_target:
            target_name = source_to_target[str(resolved)]
            new_url = f"{BASE_URL}/{target_name}"
            replace_count += 1
            return re.sub(r'src=["\'][^"\']+["\']', f'src="{new_url}"', full)
        else:
            skip_count += 1
            return full

    # Replace markdown images: ![alt](path)
    content = re.sub(
        r'!\[([^\]]*)\]\(([^)]+)\)',
        replace_markdown_img,
        content
    )

    # Replace HTML images: <img src="path" ...>
    content = re.sub(
        r'<img[^>]+src=["\']([^"\']+)["\']',
        replace_html_img,
        content
    )

    if content != original:
        md_file.write_text(content, encoding='utf-8')
        return True, replace_count, skip_count

    return False, replace_count, skip_count


def main():
    print("=" * 60)
    print("Markdown 图片引用替换")
    print("=" * 60)

    # Build target name map
    print("\n[1/2] 构建文件名映射...")
    source_to_target = build_target_name_map()
    print(f"  映射了 {len(source_to_target)} 个文件")

    # Process all markdown files
    print("\n[2/2] 替换 markdown 引用...")
    md_files = list(AI_DIR.rglob("*.md"))
    total_modified = 0
    total_replaced = 0
    total_skipped = 0
    modified_files = []

    for md_file in md_files:
        modified, replaced, skipped = replace_refs_in_file(md_file, source_to_target)
        if modified:
            total_modified += 1
            total_replaced += replaced
            total_skipped += skipped
            modified_files.append((str(md_file.relative_to(PROJECT_ROOT)), replaced))
            print(f"  {md_file.relative_to(PROJECT_ROOT)}: {replaced} 处替换")
        elif skipped > 0:
            total_skipped += skipped

    print(f"\n修改了 {total_modified} 个文件，共 {total_replaced} 处替换")
    print(f"跳过 {total_skipped} 处（无法解析或为外部 URL）")

    # Summary
    print("\n修改的文件列表:")
    for path, count in sorted(modified_files):
        print(f"  {path}: {count} 处")


if __name__ == "__main__":
    main()
