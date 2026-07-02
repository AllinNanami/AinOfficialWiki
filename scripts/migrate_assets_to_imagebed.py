#!/usr/bin/env python3
"""
Migrate locally-referenced images from docs/assets to imagebed (OneDrive public folder).
- Only copies images that are actually referenced in markdown files
- Handles filename conflicts with _1 suffix
- Generates a migration report
"""

import os
import re
import shutil
import hashlib
import urllib.request
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path("/home/excnies/AinOfficialWiki")
DOCS_DIR = PROJECT_ROOT / "docs"
AI_DIR = DOCS_DIR / "ai"
TARGET_DIR = Path("/mnt/c/Users/excnies/OneDrive/gastigado/public")
BASE_URL = "https://gastigado.cnies.org/d/public"

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'}

def find_source_images():
    """Find all image files in docs/ai/assets/"""
    images = {}
    assets_dir = AI_DIR / "assets"
    if not assets_dir.exists():
        return images
    for f in assets_dir.rglob("*"):
        if f.is_file() and f.suffix.lower() in IMAGE_EXTS:
            images[f.name] = f
    return images

def find_markdown_references():
    """Find all image references in markdown files under docs/ai/"""
    refs = set()
    for md_file in AI_DIR.rglob("*.md"):
        content = md_file.read_text(encoding='utf-8', errors='ignore')
        # Match markdown image syntax: ![alt](path)
        # Also match HTML img tags
        patterns = [
            r'!\[[^\]]*\]\(([^)]+)\)',  # ![alt](path)
            r'<img[^>]+src=["\']([^"\']+)["\']',  # <img src="path">
        ]
        for pattern in patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                # Normalize path
                match = match.strip()
                # Remove query strings and anchors
                match = re.sub(r'[?#].*$', '', match)
                # Only keep local references (not http/https URLs)
                if not match.startswith(('http://', 'https://', '//')):
                    refs.add(match)
    return refs

def resolve_reference_to_file(ref, md_dir):
    """Resolve a relative reference to an actual file path"""
    # Remove leading ./
    if ref.startswith('./'):
        ref = ref[2:]
    
    # Try relative to the markdown file's directory
    candidate = md_dir / ref
    if candidate.exists() and candidate.is_file():
        return candidate
    
    # Try relative to docs/ai/
    candidate = AI_DIR / ref
    if candidate.exists() and candidate.is_file():
        return candidate
    
    # Try relative to docs/
    candidate = DOCS_DIR / ref
    if candidate.exists() and candidate.is_file():
        return candidate
    
    return None

def get_unique_filename(target_dir, filename):
    """Get a unique filename in target directory, adding _1 suffix if needed"""
    target = target_dir / filename
    if not target.exists():
        return filename
    
    # Check if it's the same file (by hash)
    stem = Path(filename).stem
    ext = Path(filename).suffix
    
    counter = 1
    while True:
        new_name = f"{stem}_{counter}{ext}"
        new_target = target_dir / new_name
        if not new_target.exists():
            return new_name
        counter += 1

def copy_images_with_conflict_handling(source_files, target_dir):
    """Copy images to target directory with conflict handling"""
    results = []
    for src_file in sorted(source_files):
        filename = src_file.name
        target_name = get_unique_filename(target_dir, filename)
        target_path = target_dir / target_name
        
        try:
            shutil.copy2(src_file, target_path)
            results.append({
                'source': str(src_file),
                'filename': filename,
                'target_filename': target_name,
                'target_path': str(target_path),
                'url': f"{BASE_URL}/{target_name}",
                'status': 'success'
            })
        except Exception as e:
            results.append({
                'source': str(src_file),
                'filename': filename,
                'target_filename': filename,
                'target_path': str(target_path),
                'url': f"{BASE_URL}/{filename}",
                'status': f'error: {str(e)}'
            })
    
    return results

def validate_urls(urls, sample_size=20):
    """Validate URLs by checking if they're accessible"""
    results = []
    # Sample a subset for validation
    import random
    sample = random.sample(urls, min(sample_size, len(urls)))
    
    for url in sample:
        try:
            req = urllib.request.Request(url, method='HEAD')
            with urllib.request.urlopen(req, timeout=10) as response:
                results.append({
                    'url': url,
                    'status': response.status,
                    'content_type': response.headers.get('Content-Type', 'unknown'),
                    'valid': 200 <= response.status < 400
                })
        except Exception as e:
            results.append({
                'url': url,
                'status': 'error',
                'content_type': 'unknown',
                'valid': False,
                'error': str(e)
            })
    
    return results

def generate_report(copied_files, validation_results, unreferenced_images, output_file):
    """Generate a markdown report"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# 图床迁移报告\n\n")
        f.write(f"**生成时间**: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # Summary
        total_copied = len([r for r in copied_files if r['status'] == 'success'])
        total_errors = len([r for r in copied_files if r['status'] != 'success'])
        total_unreferenced = len(unreferenced_images)
        
        f.write("## 总体统计\n\n")
        f.write(f"| 指标 | 数量 |\n")
        f.write(f"|------|------|\n")
        f.write(f"| 已上传图片 | {total_copied} |\n")
        f.write(f"| 上传失败 | {total_errors} |\n")
        f.write(f"| 未引用图片（未上传） | {total_unreferenced} |\n\n")
        
        # Copied files by article
        f.write("## 已上传图片列表\n\n")
        by_article = defaultdict(list)
        for r in copied_files:
            if r['status'] == 'success':
                # Extract article name from source path
                parts = Path(r['source']).parts
                for i, part in enumerate(parts):
                    if part == 'assets' and i + 1 < len(parts) and '.' not in parts[i+1]:
                        by_article[parts[i+1]].append(r)
                        break
                else:
                    by_article['根目录'].append(r)
        
        for article, files in sorted(by_article.items()):
            f.write(f"### {article}\n\n")
            for r in files:
                f.write(f"- `{r['filename']}` → `{r['target_filename']}`\n")
                f.write(f"  - URL: {r['url']}\n")
            f.write("\n")
        
        # Validation results
        f.write("## URL 验证结果\n\n")
        valid_count = sum(1 for r in validation_results if r['valid'])
        f.write(f"抽样验证 {len(validation_results)} 个 URL，其中 {valid_count} 个有效\n\n")
        
        if validation_results:
            f.write("| URL | 状态 | Content-Type | 有效 |\n")
            f.write("|-----|------|--------------|------|\n")
            for r in validation_results[:50]:  # Show first 50
                f.write(f"| {r['url'][:60]}... | {r['status']} | {r.get('content_type', 'N/A')} | {'✅' if r['valid'] else '❌'} |\n")
            f.write("\n")
        
        # Unreferenced images
        f.write("## 未引用图片（未上传）\n\n")
        f.write("以下图片存在于 `docs/ai/assets/` 但未被任何 markdown 文件引用，因此未上传：\n\n")
        for img in sorted(unreferenced_images):
            f.write(f"- `{img}`\n")
        f.write("\n")

def main():
    print("=" * 60)
    print("图床迁移脚本")
    print("=" * 60)
    
    # Step 1: Find source images
    print("\n[1/5] 扫描源图片...")
    source_images = find_source_images()
    print(f"  找到 {len(source_images)} 个源图片文件")
    
    # Step 2: Find markdown references
    print("\n[2/5] 扫描 markdown 引用...")
    refs = find_markdown_references()
    print(f"  找到 {len(refs)} 个图片引用")
    
    # Step 3: Resolve references to actual files
    print("\n[3/5] 解析引用路径...")
    files_to_copy = set()
    unresolved_refs = []
    
    for ref in refs:
        # Try to resolve from various base directories
        resolved = None
        
        # For ./assets/... references (relative to the markdown file)
        if ref.startswith('./assets/') or ref.startswith('assets/'):
            # These are relative to the markdown file's directory
            # We need to find which markdown file uses this reference
            for md_file in AI_DIR.rglob("*.md"):
                content = md_file.read_text(encoding='utf-8', errors='ignore')
                if ref in content:
                    resolved = resolve_reference_to_file(ref, md_file.parent)
                    if resolved:
                        break
        
        # For ../assets/... references
        elif ref.startswith('../assets/'):
            # Relative to parent directory
            clean_ref = ref[3:]  # Remove ../
            candidate = AI_DIR / clean_ref
            if candidate.exists():
                resolved = candidate
            else:
                candidate = DOCS_DIR / clean_ref
                if candidate.exists():
                    resolved = candidate
        
        # For other relative references
        else:
            # Try from AI directory
            candidate = AI_DIR / ref
            if candidate.exists():
                resolved = candidate
            else:
                candidate = DOCS_DIR / ref
                if candidate.exists():
                    resolved = candidate
        
        if resolved and resolved.exists() and resolved.suffix.lower() in IMAGE_EXTS:
            files_to_copy.add(resolved)
        else:
            unresolved_refs.append(ref)
    
    print(f"  解析成功: {len(files_to_copy)} 个文件")
    if unresolved_refs:
        print(f"  未解析引用: {len(unresolved_refs)} 个")
        for ref in unresolved_refs[:10]:
            print(f"    - {ref}")
    
    # Find unreferenced images
    referenced_filenames = {f.name for f in files_to_copy}
    unreferenced = [name for name, path in source_images.items() 
                   if path not in files_to_copy and name not in referenced_filenames]
    print(f"  未引用图片: {len(unreferenced)} 个")
    
    # Step 4: Copy files
    print("\n[4/5] 复制图片到目标目录...")
    print(f"  目标目录: {TARGET_DIR}")
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    copied_files = copy_images_with_conflict_handling(files_to_copy, TARGET_DIR)
    success_count = len([r for r in copied_files if r['status'] == 'success'])
    print(f"  成功复制: {success_count} 个文件")
    
    # Step 5: Validate URLs
    print("\n[5/5] 验证 URL 有效性...")
    urls_to_validate = [r['url'] for r in copied_files if r['status'] == 'success']
    validation_results = validate_urls(urls_to_validate, sample_size=30)
    valid_count = sum(1 for r in validation_results if r['valid'])
    print(f"  抽样验证 {len(validation_results)} 个 URL，{valid_count} 个有效")
    
    # Generate report
    report_file = PROJECT_ROOT / "scripts" / "imagebed_migration_report.md"
    generate_report(copied_files, validation_results, unreferenced, report_file)
    print(f"\n报告已生成: {report_file}")
    
    print("\n" + "=" * 60)
    print("迁移完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()
