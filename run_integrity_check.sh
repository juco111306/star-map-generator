#!/usr/bin/env bash
set -e

# Change directory to the repository root
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Locate Python binary (prefer backend venv, fallback to python3)
if [ -f "./backend/.venv/bin/python" ]; then
    PYTHON_BIN="./backend/.venv/bin/python"
elif [ -f "./backend/.venv/bin/python3" ]; then
    PYTHON_BIN="./backend/.venv/bin/python3"
else
    PYTHON_BIN="python3"
fi

echo "============================================================"
echo " Starting Stellaire Automated End-to-End Integrity Checks..."
echo " Using Python environment: $PYTHON_BIN"
echo "============================================================"

$PYTHON_BIN backend/test_e2e_integrity.py
