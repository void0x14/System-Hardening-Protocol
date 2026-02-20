import os
import re
import json

src_dir = "./src/js"
excluded_dirs = ["locales", "config", "services", "db"]

# Regex to find anything between > and <
html_text_re = re.compile(r'>([^<]+)<')
# Regex to find quoted string content
string_re = re.compile(r'(["\'])(.*?)\1')
# Regex to find template strings
template_re = re.compile(r'`([^`]+)`')

turkish_chars = re.compile(r'[ıiöçşğIÖÇŞĞÜü]')

found_strings = set()

for root, dirs, files in os.walk(src_dir):
    # skip excluded directories
    for d in excluded_dirs:
        if d in dirs:
            dirs.remove(d)
    for file in files:
        if file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
                # Strip comments to prevent false positives (basic approach)
                content = re.sub(r'//.*', '', content)
                content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
                
                # HTML texts
                for match in html_text_re.findall(content):
                    text = match.strip()
                    if text and turkish_chars.search(text):
                        found_strings.add(text)
                
                # String literals
                for _, match in string_re.findall(content):
                    text = match.strip()
                    if text and turkish_chars.search(text) and not text.startswith('<'):
                        found_strings.add(text)
                        
                # Template literals
                for match in template_re.findall(content):
                    # We might have HTML in templates, search the HTML texts
                    for html_match in html_text_re.findall(match):
                        text = html_match.strip()
                        if text and turkish_chars.search(text):
                            found_strings.add(text)
                    # And check the whole literal if it looks like a flat string
                    if '<' not in match and '>' not in match and turkish_chars.search(match):
                        text = match.strip()
                        if text: found_strings.add(text)

# Sort the items
output = sorted(list(found_strings))
result = {
    # Generate clean keys based on alphanumeric text
    key.replace(' ', '_').lower(): key for key in output
}
with open("missing_i18n.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(output)} missing UI strings and saved to missing_i18n.json")
