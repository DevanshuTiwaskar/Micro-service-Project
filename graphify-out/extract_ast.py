import sys, json
from graphify.extract import collect_files, extract
from pathlib import Path

code_files = []
detect_path = Path('graphify-out/.graphify_detect.json')
if not detect_path.exists():
    print("Error: detect file missing")
    sys.exit(1)

# Handle potential UTF-16LE or UTF-8-SIG from PowerShell
try:
    content = detect_path.read_text(encoding='utf-8-sig')
    detect = json.loads(content)
except Exception:
    content = detect_path.read_text(encoding='utf-16')
    detect = json.loads(content)
for f in detect.get('files', {}).get('code', []):
    p = Path(f)
    if p.exists():
        code_files.extend(collect_files(p) if p.is_dir() else [p])

if code_files:
    print(f"Extracting {len(code_files)} code files...")
    result = extract(code_files)
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2))
    print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")
else:
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps({'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}))
    print('No code files - skipping AST extraction')
