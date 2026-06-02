#!/bin/zsh
set -e

TOOL_DIR="$(cd "$(dirname "$0")" && pwd)"
LOGO_FILE="$TOOL_DIR/assets/logo-overlay.png"
SCRIPT_FILE="$TOOL_DIR/overlay_logo.jxa.js"

if [[ ! -f "$LOGO_FILE" ]]; then
  osascript -e 'display alert "找不到 logo 文件" message "请确认 assets/logo-overlay.png 还在这个工具文件夹里。"'
  exit 1
fi

INPUT_FOLDER="$(osascript -e 'POSIX path of (choose folder with prompt "请选择：放原始 YouTube 封面的文件夹")')"
OUTPUT_FOLDER="$(osascript -e 'POSIX path of (choose folder with prompt "请选择：贴好 logo 后保存到哪个文件夹")')"

COUNT=0
while IFS= read -r -d '' SOURCE_FILE; do
  FILE_NAME="$(basename "$SOURCE_FILE")"
  NAME_WITHOUT_EXT="${FILE_NAME%.*}"
  OUTPUT_FILE="$OUTPUT_FOLDER/${NAME_WITHOUT_EXT}_with_logo.png"
  osascript -l JavaScript "$SCRIPT_FILE" "$SOURCE_FILE" "$OUTPUT_FILE" "$LOGO_FILE" >/dev/null
  COUNT=$((COUNT + 1))
done < <(find "$INPUT_FOLDER" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.tif" -o -iname "*.tiff" \) -print0)

RESULT="完成：$COUNT 张封面已贴好 logo。输出文件夹：$OUTPUT_FOLDER"
osascript -e "display dialog \"$RESULT\" buttons {\"打开输出文件夹\", \"完成\"} default button \"打开输出文件夹\""

if [[ $? -eq 0 ]]; then
  open "$OUTPUT_FOLDER"
fi
