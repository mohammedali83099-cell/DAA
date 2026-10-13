#!/bin/bash

echo "============================================================"
echo "    THRML Laboratory Installer for macOS                    "
echo "============================================================"

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_DIR"

echo "--> Verifying Python dependencies..."
python3 -c "import rich" 2>/dev/null || echo "Note: rich not installed. Standard terminal formatting will be used."

# Local launcher script
cat << EOF > "$PROJECT_DIR/thrml.sh"
#!/bin/bash
python3 "$PROJECT_DIR/main.py" "\$@"
EOF

chmod +x "$PROJECT_DIR/thrml.sh"

# Global launcher script if user home directory is writable
if mkdir -p "$HOME/bin" 2>/dev/null; then
    cat << EOF > "$HOME/bin/thrml"
#!/bin/bash
python3 "$PROJECT_DIR/main.py" "\$@"
EOF
    chmod +x "$HOME/bin/thrml" 2>/dev/null || true
    echo "--> Global executable installed at $HOME/bin/thrml"
fi

echo "============================================================"
echo "  INSTALLATION SUCCESSFUL!"
echo "============================================================"
echo "  You can launch THRML by typing:"
echo "    python3 main.py     (or ./thrml.sh)"
echo "    thrml               (from any terminal, if ~/bin is in PATH)"
echo "============================================================"
