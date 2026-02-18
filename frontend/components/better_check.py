
import re

def strip_comments_strings(text):
    # Regex for strings (single, double, backtick) and comments (single line, multi line)
    # Replaces them with spaces to keep indices correct
    pattern = r'(\'\'\'[\s\S]*?\'\'\'|\"\"\"[\s\S]*?\"\"\"|\'[^\'\\]*(?:\\.[^\'\\]*)*\'|\"[^\"\\]*(?:\\.[^\"\\]*)*\"|`[^`\\]*(?:\\.[^`\\]*)*`|//[^\n]*|/\*[\s\S]*?\*/)'
    return re.sub(pattern, lambda m: ' ' * len(m.group(0)), text)

path = 'e:/Hairscope/Work-Entrext/BUILDINPUBLIC/frontend/components/DashboardModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Only analyze up to line 1045
lines = text.split('\n')
text_chunk = '\n'.join(lines[:1045])

clean_text = strip_comments_strings(text_chunk)

print(f"Checking syntax up to line 1045 (char count {len(clean_text)})")

stack = []
for i, char in enumerate(clean_text):
    if char in '({[':
        stack.append((char, i))
    elif char in ')}]':
        if not stack:
            print(f"Unexpected closing {char} at index {i}")
            # print context around i
            start = max(0, i-20)
            end = min(len(clean_text), i+20)
            print(f"Context: {clean_text[start:end]}")
            continue
        
        last, idx = stack.pop()
        expected = {'(': ')', '{': '}', '[': ']'}[last]
        if char != expected:
            print(f"Mismatch: expected {expected} for {last} at {idx}, found {char} at {i}")
            
            # Find line number for open bracket
            curr_len = 0
            for line_idx, l in enumerate(lines):
                 prev_len = curr_len
                 curr_len += len(l) + 1
                 if curr_len > idx:
                     print(f"See Line {line_idx+1}: {l}")
                     print(f"Col: {idx - prev_len}")
                     break
            
            # Find line number for close bracket
            curr_len = 0
            for line_idx, l in enumerate(lines):
                 prev_len = curr_len
                 curr_len += len(l) + 1
                 if curr_len > i:
                     print(f"See Line {line_idx+1}: {l}")
                     print(f"Col: {i - prev_len}")
                     break
            break

if stack:
    print(f"After checking, still unclosed: {[item[0] for item in stack]}")
    last_item = stack[-1]
    print(f"Last unclosed item {last_item[0]} at index {last_item[1]}")
    curr_len = 0
    for line_idx, l in enumerate(lines):
         curr_len += len(l) + 1
         if curr_len > last_item[1]:
             print(f"Line {line_idx+1}: {l}")
             break
