#!/usr/bin/env python3
"""
Fix files with multiple H1 headings.
- Keep the first # as-is
- Change all other # to ##
- Do NOT touch ##, ###, ####, etc.
- Skip code blocks
"""

import re
from pathlib import Path

FILES = [
    "docs/lectures/lesson2-cpp-2025-STL.md",
    "docs/lectures/lesson3-sort-2025.md",
    "docs/research/citespace-from-scratch.md",
    "docs/sre/git-basics.md",
]


def downgrade_headings(content):
    lines = content.split('\n')
    result = []
    in_code_block = False
    first_h1_seen = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if in_code_block:
            result.append(line)
            continue

        # Only touch H1 lines, leave ##/###/#### etc. untouched
        if re.match(r'^# ', line):
            if first_h1_seen:
                line = '#' + line  # # -> ##
            else:
                first_h1_seen = True

        result.append(line)

    return '\n'.join(result)


def main():
    for filepath in FILES:
        p = Path(filepath)
        if not p.exists():
            print(f"SKIP (not found): {filepath}")
            continue

        content = p.read_text(encoding='utf-8')
        new_content = downgrade_headings(content)

        if content == new_content:
            print(f"SKIP (no change): {filepath}")
            continue

        p.write_text(new_content, encoding='utf-8')

        # Count changes
        old_h1 = len(re.findall(r'^# ', content, re.MULTILINE))
        new_h1 = len(re.findall(r'^# ', new_content, re.MULTILINE))
        print(f"OK: {filepath}  (# {old_h1} -> {new_h1})")


if __name__ == "__main__":
    main()
