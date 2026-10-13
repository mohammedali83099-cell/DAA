@echo off
echo ============================================================
echo   Launching THRML Web Laboratory (Light Glassmorphic UI)
echo ============================================================
echo Starting API and UI server on http://localhost:5000...
start "" http://localhost:5000
python thrml\api_server.py
