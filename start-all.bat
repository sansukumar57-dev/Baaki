@echo off
title Baaki Khata Launcher
echo ===============================================================
echo     Baaki Kirana & Vyapar Khata - Full Stack Launcher
echo     Spring Boot 3 + MySQL 8.0 + React Vite
echo ===============================================================

echo [1/2] Starting Spring Boot Backend (Port 8080)...
if exist "%~dp0backend\target\baaki-backend-1.0.0.jar" (
    start "Baaki Spring Boot Backend (Port 8080)" cmd /k "title Baaki Backend && java -jar %~dp0backend\target\baaki-backend-1.0.0.jar"
) else (
    start "Baaki Spring Boot Backend (Port 8080)" cmd /k "title Baaki Backend && cd /d %~dp0backend && mvn spring-boot:run"
)

echo [2/2] Starting React Vite Frontend (Port 5173)...
start "Baaki React Vite Frontend (Port 5173)" cmd /k "title Baaki Frontend && cd /d %~dp0 && npm run dev"

echo.
echo ===============================================================
echo  Application is starting up!
echo  Frontend UI:    http://localhost:5173/
echo  Backend API:    http://localhost:8080/api
echo  MySQL Database: baaki_db (Port 3306)
echo ===============================================================
timeout /t 3 >nul
start http://localhost:5173/
