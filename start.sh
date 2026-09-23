#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export PATH="$DIR/tools/node-v20.18.0-darwin-x64/bin:$PATH"

echo "=================================================="
echo "🌟 Starting Custom Star Map Generator Web App"
echo "=================================================="

# Start FastAPI backend
echo "🚀 Starting FastAPI backend on http://127.0.0.1:8000..."
"$DIR/backend/.venv/bin/uvicorn" app.main:app --app-dir "$DIR/backend" --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Trap signals to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Give backend a moment to initialize
sleep 2

# Start Next.js frontend
echo "✨ Starting Next.js frontend on http://localhost:3000..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo "🎉 Star Map Generator is running!"
echo "🌐 Open frontend: http://localhost:3000"
echo "📡 Backend API:   http://127.0.0.1:8000/docs"
echo "=================================================="
echo "Press Ctrl+C to stop both servers."

wait
