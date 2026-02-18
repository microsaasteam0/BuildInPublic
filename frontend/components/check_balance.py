
import re

path = 'e:/Hairscope/Work-Entrext/BUILDINPUBLIC/frontend/components/DashboardModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')[:1039]
text = '\n'.join(lines)

# Remove comments
text = re.sub(r'//.*', '', text)
text = re.sub(r'/\*[\s\S]*?\*/', '', text)

# Remove strings
text = re.sub(r'`[\s\S]*?`', '', text)  # Template literals
text = re.sub(r"'.*?'", '', text)      # Single quotes
text = re.sub(r'".*?"', '', text)      # Double quotes

open_p = text.count('(')
close_p = text.count(')')
open_b = text.count('{')
close_b = text.count('}')
open_br = text.count('[')
close_br = text.count(']')

print(f"Parens: {open_p} open, {close_p} close. Diff: {open_p - close_p}")
print(f"Braces: {open_b} open, {close_b} close. Diff: {open_b - close_b}")
print(f"Brackets: {open_br} open, {close_br} close. Diff: {open_br - close_br}")

# Find line of unclosed paren
current_open = 0
for i, line in enumerate(lines):
    l = line
    l = re.sub(r'//.*', '', l)
    # Removing strings line by line is hard because multi-line strings.
    # But parens usually don't span lines inside strings (except template literals).
    # This is a rough check.
    op = l.count('(')
    cp = l.count(')')
    if op > cp:
        # print(f"Line {i+1} has {op-cp} extra open parens: {line}")
        pass
