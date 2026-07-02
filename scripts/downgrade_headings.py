#!/usr/bin/env python3
"""
Downgrade headings in markdown files that have multiple H1.
- Keep the first # heading as-is
- Downgrade all other headings by one level (# -> ##, ## -> ###, etc.)
- Skip code blocks
"""

import re
from pathlib import Path

FILES = [
    "docs/ai/agent-principles-architecture-202606.md",
    "docs/ai/ai-coding-non-technical-guide-202606.md",
    "docs/ai/claude-code-architecture-governance-202606.md",
]


def downgrade_headings(content):
    lines = content.split('\n')
    result = []
    in_code_block = False
    first_h1_seen = False

    for line in lines:
        # Track code blocks
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if in_code_block:
            result.append(line)
            continue

        # Match heading lines: one or more # followed by space
        m = re.match(r'^(#{1,6})\s', line)
        if m:
            level = len(m.group(1))
            if level == 1:
                if first_h1_seen:
                    # Downgrade # -> ##
                    line = '#' + line
                else:
                    first_h1_seen = True
            else:
                # Downgrade ## -> ###, ### -> ####, etc. (max level 6)
                if level < 6:
                    line = '#' + line

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
