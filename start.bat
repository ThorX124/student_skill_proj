@echo off
echo Starting Student Skill Tracker...
echo.
echo The application will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
