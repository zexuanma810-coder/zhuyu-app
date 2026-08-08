@echo off
REM ============================================================
REM  竹语 App - Push to GitHub (one-click)
REM  用法：
REM   1) 在 GitHub 网页新建一个【空】仓库（不要勾 README）
REM   2) 双击本文件，按提示输入你的用户名和仓库名
REM   3) 第一次会弹出浏览器让你登录 GitHub，授权即可
REM  之后 GitHub 会自动编译 APK（见 README 第一步）
REM ============================================================
set /p USERNAME=Enter your GitHub username: 
set /p REPONAME=Enter your repo name (e.g. zhuyu-app): 

git remote remove origin 2>nul
git remote add origin https://github.com/%USERNAME%/%REPONAME%.git
git branch -M main
git push -u origin main

if %errorlevel%==0 (
  echo.
  echo SUCCESS - code pushed. Go to GitHub - Actions tab to download the APK.
) else (
  echo.
  echo FAILED - check your username/repo and GitHub login, then run again.
)
pause
