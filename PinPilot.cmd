@echo off
cd /d "%~dp0"
echo Starting PinPilot desktop app...
npm run desktop:build
pause
