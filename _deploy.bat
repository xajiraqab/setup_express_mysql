@echo off
cd /d "%~dp0"
cd %~dp0/build_helpers
node deploy
timeout 5 >nul