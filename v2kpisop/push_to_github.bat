@echo off
chcp 65001 >nul
title V2-KPI to GitHub - 24/7 Permanent Cloud Hosting
cd /d "c:\Users\user\OneDrive\V2 Education TK\v2kpisop"

echo ======================================================================
echo    ប្រព័ន្ធ V2-KPI SOP - បញ្ជូនទៅកាន់ Cloud (GitHub) ដំណើរការ ២៤/៧
echo ======================================================================
echo.
echo កំពុង Push ទិន្នន័យចុងក្រោយទៅកាន់ GitHub...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  [ជោគជ័យ] បាន Push ឡើងទៅ GitHub រួចរាល់ ១០០%%!
    echo.
    echo  ជំហានបន្ទាប់ដើម្បីបើកដំណើរការអចិន្ត្រៃយ៍ (២៤/៧ ទោះបិទកុំព្យូទ័រ):
    echo  1. បើក Link: https://github.com/udomkeo71-dev/SOPKPI/settings/pages
    echo  2. កន្លែង "Source": ជ្រើសរើស "GitHub Actions" ឬ "Deploy from a branch" (main)
    echo  3. ចុច "Save"
    echo.
    echo  Link ផ្លូវការប្រើប្រាស់រហូតគឺ:
    echo  👉 https://udomkeo71-dev.github.io/SOPKPI/
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo  [ចំណាំ] ប្រសិនបើប្រព័ន្ធទាមទារ Login សូមចុច Sign in តាម Browser
    echo  ឬដំណើរការម្តងទៀត។
    echo ======================================================================
)

echo.
pause
