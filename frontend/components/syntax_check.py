
import re

def strip_comments_strings(text):
    # Regex for strings (single, double, backtick) and comments (single line, multi line)
    # We must match them in order of appearance
    pattern = r'(\'\'\'[\s\S]*?\'\'\'|"""[\s\S]*?"""|\'[^\'\\]*(?:\\.[^\'\\]*)*\'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`|//[^\n]*|/\*[\s\S]*?\*/)'
    return re.sub(pattern, '', text)

path = 'e:/Hairscope/Work-Entrext/BUILDINPUBLIC/frontend/components/DashboardModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Only up to line 1045 to check if balance is broken BEFORE the error
lines = text.split('\n')
text_chunk = '\n'.join(lines[:1040])

clean_text = strip_comments_strings(text_chunk)

print(f"Parens: {clean_text.count('(')} open, {clean_text.count(')')} close")
print(f"Braces: {clean_text.count('{')} open, {clean_text.count('}')} close")
print(f"Brackets: {clean_text.count('[')} open, {clean_text.count(']')} close")

# Find the location of the mismatch
stack = []
for i, char in enumerate(clean_text):
    if char in '({[':
        stack.append((char, i))
    elif char in ')}]':
        if not stack:
            print(f"Unexpected closing {char} at index {i}")
            continue
        
        last, idx = stack.pop()
        expected = {'(': ')', '{': '}', '[': ']'}[last]
        if char != expected:
            print(f"Mismatch: expected {expected} for {last} at {idx}, found {char} at {i}")

if stack:
    print(f"Unclosed items: {stack}")
