; Script de instalação para o aplicativo MITMYNID
; Este script requer a presença dos arquivos de instalação na pasta "setup"
; Para criar o instalador, execute o comando "makensis setup.nsi"

; Define o nome do instalador e a versão
Name "MIT3DVisit"
OutFile "MIT3DVisit-Setup.exe"
!define VERSION "1.0"

; Define os diretórios padrão de instalação
InstallDir "$PROGRAMFILES\MITMYNID"
InstallDirRegKey HKLM "Software\MITMYNID" "InstallDir"

; Define as páginas de opções do instalador
Page Components
Page Directory
Page InstFiles

; Define as seções do instalador
Section "MITMYNID Application" SecMITMYNID
  SetOutPath "$INSTDIR"

  ; Cria as pastas de dados
  CreateDirectory "$INSTDIR\data\config"
  CreateDirectory "$INSTDIR\data\projects"
  CreateDirectory "$INSTDIR\data\exports"

 ; Copia os arquivos gerados pelo Electron Packager para a pasta de instalação
SetOutPath "$INSTDIR"
File /r "C:\Users\Francisco\Desktop\app\MIT3DVisit-win32-x64\*.*"
  ; Cria o desinstalador
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Start Menu Shortcut" SecShortcuts
  ; Cria o atalho do aplicativo no menu Iniciar
  SetShellVarContext all
  CreateDirectory "$SMPROGRAMS\MITMYNID"
  CreateShortcut "$SMPROGRAMS\MITMYNID\MIT3DVisit.lnk" "$INSTDIR\MIT3DVisit.exe"
  CreateShortcut "$DESKTOP\MIT3DVisit.lnk" "$INSTDIR\MIT3DVisit.exe"
SectionEnd

Section "Uninstall" SecUninstall


 ; Remove o atalho do menu Iniciar
  Delete "$SMPROGRAMS\MITMYNID\MIT3DVisit.lnk"

  ; Remove o atalho do desktop do usuário atual
  SetShellVarContext all
  Delete "$DESKTOP\MIT3DVisit.lnk"


  ; Remove os arquivos de configuração do usuário
  Delete "$APPDATA\MITMYNID\*.*"
  Delete "$APPDATA\MITMYNID"



  ; Remove o aplicativo e seus arquivos
  Delete "$INSTDIR\MITMYNID.exe"
  Delete "$INSTDIR\data\config\*.*"
  Delete "$INSTDIR\data\config"
  Delete "$INSTDIR\data\projects\*.*"
  Delete "$INSTDIR\data\projects"
  Delete "$INSTDIR\data\exports\*.*"
  Delete "$INSTDIR\data\exports"
  Delete "$INSTDIR"

  ; Remove a chave do registro do aplicativo
  DeleteRegKey HKLM "Software\MITMYNID"

  ; Deleta todos os arquivos e pastas no diretório de instalação
  RMDir /r "$INSTDIR"

  ; Remove a chave do registro do aplicativo
  DeleteRegKey HKLM "Software\MITMYNID"


SectionEnd



!define /unicode true

Function .onInstSuccess
  ; Exibe mensagem de conclusão
  MessageBox MB_OK "A MIT3DVisit foi instalado com sucesso!"
FunctionEnd

