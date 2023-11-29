@echo off
cd /d "%~dp0"
cd %~dp0/build_helpers
node build_and_zip
timeout 5 >nul