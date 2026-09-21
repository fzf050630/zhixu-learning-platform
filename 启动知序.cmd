@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动知序（后端 + 前端）...
where node >nul 2>nul
if errorlevel 1 goto nonode
node --no-warnings scripts\launch.cjs
if errorlevel 1 goto failed
goto end

:nonode
echo.
echo 未检测到 Node.js，请先安装 Node.js 20 或更高版本：https://nodejs.org/
echo.
pause
goto end

:failed
echo.
echo 启动失败，请查看上方错误信息。
echo.
pause

:end
