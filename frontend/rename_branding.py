import os

file_path = 'lib/blog-data.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace('Reword', 'BuildInPublic')
new_content = new_content.replace('reword.entrext.com', 'buildinpublic.entrext.com')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated {file_path}")
