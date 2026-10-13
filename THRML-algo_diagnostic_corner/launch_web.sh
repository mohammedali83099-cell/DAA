#!/bin/bash
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "============================================================"
echo "  Launching THRML Web Laboratory (Light Glassmorphic UI)   "
echo "============================================================"
echo "Starting API and UI server on http://localhost:5000..."
which open >/dev/null 2>&1 && open http://localhost:5000 || which xdg-open >/dev/null 2>&1 && xdg-open http://localhost:5000
python3 "$PROJECT_DIR/thrml/api_server.py"
