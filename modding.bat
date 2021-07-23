:: original author: debiedowner
REM 参考 https://forum.vivaldi.net/topic/10592/patching-vivaldi-with-batch-scripts

REM @でエコーを非表示、echo offで以降のエラーを抑制
@echo off

REM make current directory work when run as administrator
REM このファイルのディレクトリをカレントディレクトリとする
cd "%~dp0"

REM =の前後には空白を入れないこと
REM 変数のセットはset、参照は%で括る
REM TODO: Change installPath
set installPath="C:\Program Files\Vivaldi\Application\"
if not exist "%installPath%" (
    set installPath="%USERPROFILE%\AppData\Local\Vivaldi\Application\"
)

echo Searching at: %installPath%
REM for /f <オプション> パーセント2個<変数> in (<ファイル名>) do コマンド
REM dir ファイルやディレクトリを表示
REM /a:-d 属性をディレクトリ以外に指定
REM /b ファイル名のみ
REM /s サブディレクトリあり
for /f "tokens=*" %%a in ('dir /a:-d /b /s %installPath%') do (
    REM パーセント~nxa  パーセントa をファイル名と拡張子だけ
    REM パーセント~dpa  パーセントa をドライブ文字とパスだけ
	if "%%~nxa"=="browser.html" set latestVersionFolder=%%~dpa
)

if "%latestVersionFolder%"=="" (
	pause & exit
) else (
	echo Found latest version folder: "%latestVersionFolder%"
)

if not exist "%latestVersionFolder%\browser.bak.html" (
	echo Creating a backup of your original browser.html file.
	copy "%latestVersionFolder%\browser.html" "%latestVersionFolder%\browser.bak.html"
)

REM type: ファイル内容を表示
echo copying js files to custom.js
type *.js > "%latestVersionFolder%\custom.js"
echo copying js files to custom.js
type *.css > "%latestVersionFolder%\custom.css"

echo patching browser.html file
REM 最後の2行以外をコピー
type "%latestVersionFolder%\browser.bak.html" | findstr /v "</body>" | findstr /v "</html>" > "%latestVersionFolder%\browser.html"
REM スクリプトの差し込み
echo     ^<script src="custom.js"^>^</script^> >> "%latestVersionFolder%\browser.html"
echo   ^</body^> >> "%latestVersionFolder%\browser.html"
echo ^</html^> >> "%latestVersionFolder%\browser.html"

REM 終了後にウィンドウを閉じないようにする
pause