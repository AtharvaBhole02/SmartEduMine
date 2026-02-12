#!/bin/bash

# Dual Scaling Dropout Prediction Model - Startup Script

echo "=========================================="
echo "  DMSW Dropout Prediction Model"
echo "=========================================="
echo ""

# Change to script directory so relative paths work
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! ./venv/bin/python -c "import flask" 2>/dev/null; then
    echo "Installing dependencies..."
    ./venv/bin/pip install -r requirements.txt
    echo "✅ Dependencies installed"
fi

# Check if model exists; train if needed
if [ ! -f "dmsw_model.h5" ]; then
    echo ""
    echo "❌ Trained model not found!"

    # Check if dataset exists; generate if needed
    if [ ! -f "dmsw_student_data.csv" ]; then
        echo "Generating training dataset..."
        ./venv/bin/python generate_dmsw_dataset.py
        echo ""
    fi

    echo "Training model now (this may take a few minutes)..."
    ./venv/bin/python train_dmsw.py
    echo ""
fi

# Kill any existing process on port 5001
EXISTING_PID=$(lsof -t -i:5001 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo "⚠️  Killing existing process on port 5001 (PID: $EXISTING_PID)"
    kill -9 $EXISTING_PID 2>/dev/null
    sleep 1
fi

# Start API server
echo ""
echo "=========================================="
echo "  Starting ML API Server..."
echo "=========================================="
echo "  API:     http://localhost:5001"
echo "  Health:  http://localhost:5001/health"
echo "  Press Ctrl+C to stop"
echo ""

./venv/bin/python api_server.py
