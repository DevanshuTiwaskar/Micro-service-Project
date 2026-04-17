import json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

# Paths
extraction_path = Path('graphify-out/.graphify_extract.json')
detection_path = Path('graphify-out/.graphify_detect.json')
analysis_path = Path('graphify-out/.graphify_analysis.json')

# Load data
extraction = json.loads(extraction_path.read_text())
detection = json.loads(detection_path.read_text(encoding='utf-16'))
analysis = json.loads(analysis_path.read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# LABELS
labels = {
    16: "Auth API Controllers",
    18: "RabbitMQ Broker Integration",
    19: "Playlist View Component",
    20: "Dashboard View Component",
    21: "Library View Component",
    22: "User Playlists Component",
    23: "User Registration View",
    24: "Music API Controllers",
    25: "Security Middlewares",
    26: "Music API Client",
    27: "Navigation Sidebar",
    28: "System Design & Deployment",
    29: "Messaging Infrastructure",
    30: "Database Connection Logic",
    31: "App Entry & Routing",
    32: "Bottom Navigation",
    33: "Main Layout Structure",
    34: "Authentication Context",
    35: "Player Global State",
    36: "Artist Dashboard",
    37: "Login View Component",
    38: "Storage Service (AWS S3)",
    39: "Auth Service Entry",
    40: "Input Validation Service",
    41: "Playlist Creation Modal",
    42: "Guest Access Routing",
    43: "Mobile Responsive Sidebar",
    44: "Top Navigation Bar",
    45: "Main Music Player UI",
    46: "Playlist Card Component",
    47: "Protected Route Logic",
    48: "Server Wake-up Handling",
    49: "Sidebar Shell Component",
    50: "Song Card Component",
    51: "Google OAuth Callback",
    52: "Landing Page Component",
    53: "Music Event Subscriber",
    54: "Music Library Management",
    55: "Notification Service Entry",
    56: "Email Orchestration",
    57: "SMTP Email Utilities",
    58: "Auth App Configuration",
    59: "Auth Constants",
    60: "OTP Data Models",
    61: "User Identity Models",
    62: "Auth Route Definitions",
    66: "Auth API Client",
    68: "Global Modal Store",
    69: "Music Server Entry",
    70: "Music App Setup",
    72: "Music Metadata Models",
    73: "Playlist Data Models",
    74: "Music Route Definitions",
    75: "Notification App Setup",
    76: "Event Listener Patterns",
    78: "Notification Route Definitions",
    79: "AWS S3 Infrastructure",
    80: "Brand Logo & Assets"
}

# Fill in defaults for minified symbols (0-15) and others
for cid in communities:
    if cid not in labels:
        if cid <= 15:
            labels[cid] = f"Frontend Library Symbols ({cid})"
        else:
            labels[cid] = f"Internal Module {cid}"

# Regenerate questions with real labels
questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}))
print('Report updated with community labels')
