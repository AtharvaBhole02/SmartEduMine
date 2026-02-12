@echo off
REM Dual Scaling Dropout Prediction Model - Startup Script (Windows)

echo ==========================================
echo Dual Scaling Dropout Prediction Model
echo ==========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if model exists
if not exist "models\dropout_model.pkl" (
    echo.
    echo Trained model not found!
    echo Training model now...
    python train_model.py
    echo.
)

REM Start API server
echo.
echo ==========================================
echo Starting ML API Server...
echo ==========================================
echo API will be available at: http://localhost:5001
echo Press Ctrl+C to stop
echo.

python api_server.py
