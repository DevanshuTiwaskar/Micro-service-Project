import json
from pathlib import Path

def load_json(path):
    if not path.exists():
        return {'nodes':[], 'edges':[], 'hyperedges':[]}
    try:
        content = path.read_text(encoding='utf-8-sig')
        return json.loads(content)
    except Exception:
        content = path.read_text(encoding='utf-16')
        return json.loads(content)

ast = load_json(Path('graphify-out/.graphify_ast.json'))
cached = load_json(Path('graphify-out/.graphify_cached.json'))
new = load_json(Path('graphify-out/.graphify_semantic_new.json'))

# Merge: AST nodes first, then semantic nodes deduplicated by id
seen = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])

for n in cached.get('nodes', []):
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

for n in new.get('nodes', []):
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

merged_edges = ast['edges'] + cached.get('edges', []) + new.get('edges', [])
merged_hyperedges = cached.get('hyperedges', []) + new.get('hyperedges', [])

merged = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'input_tokens': new.get('input_tokens', 0) + cached.get('input_tokens', 0),
    'output_tokens': new.get('output_tokens', 0) + cached.get('output_tokens', 0),
}

Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged, indent=2))
print(f'Merged successfully: {len(merged_nodes)} nodes, {len(merged_edges)} edges')
