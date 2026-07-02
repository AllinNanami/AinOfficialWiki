#!/usr/bin/env python3
"""
Complete imagebed migration script:
1. Scan docs/ai/assets/ for images referenced by markdown
2. Copy referenced images to OneDrive public/ (flat, conflict-safe)
3. Replace markdown relative paths with imagebed URLs
4. Validate URLs
5. Generate report
"""

import os
import re
import shutil
import hashlib
import urllib.request
from pathlib import Path
from collections import defaultdict
from datetime import datetime

PROJECT_ROOT = Path("/home/excnies/AinOfficialWiki")
DOCS_DIR = PROJECT_ROOT / "docs"
AI_DIR = DOCS_DIR / "ai"
ASSETS_DIR = AI_DIR / "assets"
TARGET_DIR = Path("/mnt/c/Users/excnies/OneDrive/gastigado/public")
BASE_URL = "https://gastigado.cnies.org/d/public"

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'}


def find_all_markdown_files():
    """Find all markdown files under docs/ai/"""
    return list(AI_DIR.rglob("*.md"))


def extract_image_refs_from_md(md_file):
    """
    Extract all local image references from a markdown file.
    Returns list of (original_ref, line_number, full_match) tuples.
    """
    refs = []
    content = md_file.read_text(encoding='utf-8', errors='ignore')
    lines = content.split('\n')

    for line_num, line in enumerate(lines, 1):
        # Markdown: ![alt](path)
        for m in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', line):
            path = m.group(2).strip()
            path = re.sub(r'[?#].*$', '', path)  # remove query/anchor
            if not path.startswith(('http://', 'https://', '//')):
                refs.append((path, line_num, m.group(0)))

        # HTML: <img src="path" ...>
        for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', line):
            path = m.group(1).strip()
            path = re.sub(r'[?#].*$', '', path)
            if not path.startswith(('http://', 'https://', '//')):
                refs.append((path, line_num, m.group(0)))

    return refs


def resolve_ref_to_file(ref, md_file):
    """
    Resolve a relative image reference to an absolute file path.
    The ref is relative to the markdown file's directory.
    """
    md_dir = md_file.parent

    # Remove leading ./
    clean = ref
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


def get_unique_filename(target_dir, filename, used_names):
    """
    Get a unique filename. If conflict, add _1, _2, etc.
    Uses both filesystem and in-memory tracking.
    """
    if filename not in used_names and not (target_dir / filename).exists():
        used_names.add(filename)
        return filename

    stem = Path(filename).stem
    ext = Path(filename).suffix
    counter = 1
    while True:
        new_name = f"{stem}_{counter}{ext}"
        if new_name not in used_names and not (target_dir / new_name).exists():
            used_names.add(new_name)
            return new_name
        counter += 1


def validate_urls(urls, timeout=15):
    """Validate URLs by sending HEAD requests. Returns list of result dicts."""
    results = []
    for url in urls:
        try:
            req = urllib.request.Request(url, method='HEAD',
                                         headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                ct = resp.headers.get('Content-Type', '')
                results.append({
                    'url': url,
                    'status': resp.status,
                    'content_type': ct,
                    'valid': 200 <= resp.status < 400,
                    'is_image': 'image' in ct,
                })
        except Exception as e:
            results.append({
                'url': url,
                'status': 'error',
                'content_type': '',
                'valid': False,
                'is_image': False,
                'error': str(e),
            })
    return results


def main():
    print("=" * 60)
    print("图床迁移脚本 v2")
    print("=" * 60)

    # ── Step 1: Scan markdown references ──────────────────────
    print("\n[1/5] 扫描 markdown 中的本地图片引用...")
    md_files = find_all_markdown_files()
    print(f"  找到 {len(md_files)} 个 markdown 文件")

    # Build: ref_string -> [(md_file, line_num)]
    ref_to_md = defaultdict(list)
    # Build: (md_file, line_num, original_match) -> resolved_file
    all_refs = []  # (md_file, ref_str, line_num, full_match, resolved_path)

    for md_file in md_files:
        refs = extract_image_refs_from_md(md_file)
        for ref_str, line_num, full_match in refs:
            resolved = resolve_ref_to_file(ref_str, md_file)
            all_refs.append((md_file, ref_str, line_num, full_match, resolved))

    # Separate resolved vs unresolved
    resolved_refs = [(md, ref, ln, fm, rp) for md, ref, ln, fm, rp in all_refs if rp]
    unresolved_refs = [(md, ref, ln, fm) for md, ref, ln, fm, rp in all_refs if not rp]

    # Unique resolved source files
    unique_source_files = sorted(set(rp for _, _, _, _, rp in resolved_refs))
    print(f"  总引用数: {len(all_refs)}")
    print(f"  成功解析: {len(resolved_refs)} 条引用 → {len(unique_source_files)} 个唯一文件")
    print(f"  未解析:   {len(unresolved_refs)} 条引用")

    # ── Step 2: Copy files with conflict handling ─────────────
    print(f"\n[2/5] 复制图片到 {TARGET_DIR}...")
    TARGET_DIR.mkdir(parents=True, exist_ok=True)

    # Map: source_path -> target_filename
    source_to_target = {}
    copy_results = []
    used_names = set()  # track filenames we've assigned in this run

    # Pre-load existing filenames in target
    existing_files = set()
    if TARGET_DIR.exists():
        for f in TARGET_DIR.iterdir():
            if f.is_file():
                existing_files.add(f.name)

    for src in unique_source_files:
        orig_name = src.name

        # If file with same name already exists in target, reuse it
        if orig_name in existing_files:
            source_to_target[src] = orig_name
            copy_results.append({
                'source': str(src.relative_to(PROJECT_ROOT)),
                'orig_name': orig_name,
                'target_name': orig_name,
                'url': f"{BASE_URL}/{orig_name}",
                'status': 'success (exists)',
            })
            used_names.add(orig_name)
            continue

        # Check for name conflicts with other source files being processed
        target_name = orig_name
        if orig_name in used_names:
            # Conflict: find unique name with _N suffix
            stem = Path(orig_name).stem
            ext = Path(orig_name).suffix
            counter = 1
            while True:
                candidate = f"{stem}_{counter}{ext}"
                if candidate not in used_names and candidate not in existing_files:
                    target_name = candidate
                    break
                counter += 1

        target_path = TARGET_DIR / target_name

        try:
            shutil.copy2(src, target_path)
            source_to_target[src] = target_name
            used_names.add(target_name)
            copy_results.append({
                'source': str(src.relative_to(PROJECT_ROOT)),
                'orig_name': orig_name,
                'target_name': target_name,
                'url': f"{BASE_URL}/{target_name}",
                'status': 'success',
            })
        except Exception as e:
            copy_results.append({
                'source': str(src.relative_to(PROJECT_ROOT)),
                'orig_name': orig_name,
                'target_name': orig_name,
                'url': f"{BASE_URL}/{orig_name}",
                'status': f'error: {e}',
            })

    success_copies = [r for r in copy_results if r['status'] == 'success']
    error_copies = [r for r in copy_results if r['status'] != 'success']
    print(f"  成功: {len(success_copies)} 个文件")
    if error_copies:
        print(f"  失败: {len(error_copies)} 个文件")

    # ── Step 3: Replace markdown references ───────────────────
    print("\n[3/5] 替换 markdown 中的图片引用为图床 URL...")

    # Build replacement map per md_file: { line_num: { old_text: new_text } }
    # Group by md_file for efficient file rewriting
    md_replacements = defaultdict(list)  # md_file -> [(old_match, new_url)]

    replace_count = 0
    skip_count = 0

    for md_file, ref_str, line_num, full_match, resolved_path in resolved_refs:
        if resolved_path in source_to_target:
            target_name = source_to_target[resolved_path]
            new_url = f"{BASE_URL}/{target_name}"

            if full_match.startswith('!['):
                # Markdown syntax: ![alt](path) -> ![alt](url)
                alt = re.match(r'!\[([^\]]*)\]', full_match).group(1)
                new_match = f'![{alt}]({new_url})'
            elif full_match.startswith('<img'):
                # HTML syntax: <img src="path" ...> -> <img src="url" ...>
                new_match = re.sub(
                    r'src=["\'][^"\']+["\']',
                    f'src="{new_url}"',
                    full_match
                )
            else:
                continue

            md_replacements[md_file].append((full_match, new_match))
            replace_count += 1
        else:
            skip_count += 1

    # Apply replacements per file
    files_modified = 0
    for md_file, replacements in md_replacements.items():
        content = md_file.read_text(encoding='utf-8', errors='ignore')
        original_content = content

        for old_text, new_text in replacements:
            content = content.replace(old_text, new_text, 1)

        if content != original_content:
            md_file.write_text(content, encoding='utf-8')
            files_modified += 1

    print(f"  修改了 {files_modified} 个 markdown 文件")
    print(f"  替换了 {replace_count} 处引用")
    if skip_count:
        print(f"  跳过了 {skip_count} 处（源文件复制失败）")

    # ── Step 4: Validate URLs ─────────────────────────────────
    print("\n[4/5] 验证 URL 有效性...")
    urls_to_check = [r['url'] for r in copy_results if r['status'] == 'success']

    print(f"  共 {len(urls_to_check)} 个 URL 待验证...")
    validation_results = validate_urls(urls_to_check)

    valid_count = sum(1 for r in validation_results if r['valid'])
    invalid_count = sum(1 for r in validation_results if not r['valid'])
    print(f"  有效: {valid_count} / {len(validation_results)}")
    if invalid_count:
        print(f"  无效: {invalid_count}")

    # ── Step 5: Generate report ───────────────────────────────
    print("\n[5/5] 生成图床上传报告...")
    report_path = PROJECT_ROOT / "scripts" / "imagebed_migration_report_v2.md"

    # Build filename conflict summary
    renamed = [r for r in copy_results if r['status'] == 'success' and r['orig_name'] != r['target_name']]

    # Build per-article grouping
    by_article = defaultdict(list)
    for r in copy_results:
        if r['status'] == 'success':
            parts = Path(r['source']).parts
            # Find the subfolder under assets/
            article = 'root'
            for i, p in enumerate(parts):
                if p == 'assets' and i + 1 < len(parts):
                    next_part = parts[i + 1]
                    if '.' not in next_part:  # it's a folder, not a file
                        article = next_part
                    break
            by_article[article].append(r)

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# 图床迁移报告\n\n")
        f.write(f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

        # Summary table
        f.write("## 总体统计\n\n")
        f.write("| 指标 | 数量 |\n")
        f.write("|------|------|\n")
        f.write(f"| 扫描 markdown 文件 | {len(md_files)} |\n")
        f.write(f"| 发现本地图片引用 | {len(all_refs)} |\n")
        f.write(f"| 成功解析引用 | {len(resolved_refs)} |\n")
        f.write(f"| 未解析引用 | {len(unresolved_refs)} |\n")
        f.write(f"| 唯一源图片文件 | {len(unique_source_files)} |\n")
        f.write(f"| 成功复制到图床 | {len(success_copies)} |\n")
        f.write(f"| 复制失败 | {len(error_copies)} |\n")
        f.write(f"| 文件名冲突（已加后缀） | {len(renamed)} |\n")
        f.write(f"| 修改 markdown 文件数 | {files_modified} |\n")
        f.write(f"| 替换引用数 | {replace_count} |\n")
        f.write(f"| URL 验证有效 | {valid_count} / {len(validation_results)} |\n\n")

        # Per-article detail
        f.write("## 已上传图片（按文章分组）\n\n")
        for article in sorted(by_article.keys()):
            files = by_article[article]
            f.write(f"### {article}\n\n")
            for r in sorted(files, key=lambda x: x['orig_name']):
                renamed_note = f" → `{r['target_name']}`" if r['orig_name'] != r['target_name'] else ""
                f.write(f"- `{r['orig_name']}`{renamed_note}\n")
                f.write(f"  - URL: `{r['url']}`\n")
            f.write("\n")

        # Renamed files detail
        if renamed:
            f.write("## 文件名冲突处理\n\n")
            f.write("| 原始文件名 | 新文件名 |\n")
            f.write("|-----------|----------|\n")
            for r in renamed:
                f.write(f"| `{r['orig_name']}` | `{r['target_name']}` |\n")
            f.write("\n")

        # URL validation detail
        f.write("## URL 验证结果\n\n")
        invalid_list = [r for r in validation_results if not r['valid']]
        if invalid_list:
            f.write(f"共 {len(invalid_list)} 个无效 URL：\n\n")
            for r in invalid_list:
                err = r.get('error', f"HTTP {r['status']}")
                f.write(f"- `{r['url']}` — {err}\n")
            f.write("\n")
        else:
            f.write("所有 URL 验证通过！\n\n")

        # Unresolved references
        if unresolved_refs:
            f.write("## 未解析引用（未处理）\n\n")
            f.write("以下引用在 markdown 中存在但无法解析到 `docs/ai/assets/` 下的文件：\n\n")
            by_md = defaultdict(list)
            for md, ref, ln, fm in unresolved_refs:
                by_md[str(md.relative_to(PROJECT_ROOT))].append((ref, ln))
            for md_path in sorted(by_md.keys()):
                f.write(f"**{md_path}**\n\n")
                for ref, ln in by_md[md_path]:
                    f.write(f"- 行 {ln}: `{ref}`\n")
                f.write("\n")

    print(f"  报告已保存: {report_path}")

    # ── Final summary ─────────────────────────────────────────
    print("\n" + "=" * 60)
    print("迁移完成！")
    print(f"  复制: {len(success_copies)} 个图片文件")
    print(f"  替换: {replace_count} 处 markdown 引用 ({files_modified} 个文件)")
    print(f"  验证: {valid_count}/{len(validation_results)} URL 有效")
    if renamed:
        print(f"  冲突: {len(renamed)} 个文件名已添加后缀")
    if unresolved_refs:
        print(f"  未解析: {len(unresolved_refs)} 处引用（见报告）")
    print("=" * 60)


if __name__ == "__main__":
    main()
