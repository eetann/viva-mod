:: original author: debiedowner
REM �Q�l https://forum.vivaldi.net/topic/10592/patching-vivaldi-with-batch-scripts

REM @�ŃG�R�[���\���Aecho off�ňȍ~�̃G���[��}��
@echo off

REM make current directory work when run as administrator
REM ���̃t�@�C���̃f�B���N�g�����J�����g�f�B���N�g���Ƃ���
cd "%~dp0"

REM =�̑O��ɂ͋󔒂����Ȃ�����
REM �ϐ��̃Z�b�g��set�A�Q�Ƃ�%�Ŋ���
REM TODO: Change installPath
set installPath="C:\Program Files\Vivaldi\Application\"
if not exist "%installPath%" (
    set installPath="%USERPROFILE%\AppData\Local\Vivaldi\Application\"
)

echo Searching at: %installPath%
REM for /f <�I�v�V����> �p�[�Z���g2��<�ϐ�> in (<�t�@�C����>) do �R�}���h
REM dir �t�@�C����f�B���N�g����\��
REM /a:-d �������f�B���N�g���ȊO�Ɏw��
REM /b �t�@�C�����̂�
REM /s �T�u�f�B���N�g������
for /f "tokens=*" %%a in ('dir /a:-d /b /s %installPath%') do (
    REM �p�[�Z���g~nxa  �p�[�Z���ga ���t�@�C�����Ɗg���q����
    REM �p�[�Z���g~dpa  �p�[�Z���ga ���h���C�u�����ƃp�X����
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

REM type: �t�@�C�����e��\��
echo copying js files to custom.js
type *.js > "%latestVersionFolder%\custom.js"
echo copying js files to custom.js
type *.css > "%latestVersionFolder%\custom.css"

echo patching browser.html file
REM �Ō��2�s�ȊO���R�s�[
type "%latestVersionFolder%\browser.bak.html" | findstr /v "</body>" | findstr /v "</html>" > "%latestVersionFolder%\browser.html"
REM �X�N���v�g�̍�������
echo     ^<script src="custom.js"^>^</script^> >> "%latestVersionFolder%\browser.html"
echo   ^</body^> >> "%latestVersionFolder%\browser.html"
echo ^</html^> >> "%latestVersionFolder%\browser.html"

REM �I����ɃE�B���h�E����Ȃ��悤�ɂ���
pause