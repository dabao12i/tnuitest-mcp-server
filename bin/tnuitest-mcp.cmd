@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "NODE_BIN=%SCRIPT_DIR%..\..\..\node_modules\node\bin\node.exe"

if exist "%NODE_BIN%" (
    "%NODE_BIN%" "%SCRIPT_DIR%bin\cli.js" %*
) else (
    node "%SCRIPT_DIR%bin\cli.js" %*
)
