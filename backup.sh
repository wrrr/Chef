#!/bin/zsh

BACKUP_DIR="$HOME/Chef/backups"
SRC_DIR="$HOME/Chef/src"

mkdir -p "$BACKUP_DIR"

echo "Available backups:"
# List only directories in BACKUP_DIR
for d in "$BACKUP_DIR"/*(/); do
  echo "$(basename "$d")"
done

echo
echo "Enter the backup folder name to restore (or leave empty to restore latest):"
read BACKUP_NAME

if [ -z "$BACKUP_NAME" ]; then
  # Pick the latest backup automatically (by timestamp in name)
  BACKUP_NAME=$(ls -1d "$BACKUP_DIR"/*(/) | sort | tail -n1 | xargs -n1 basename)
fi

RESTORE_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -d "$RESTORE_PATH" ]; then
  echo "Backup '$BACKUP_NAME' does not exist!"
  exit 1
fi

echo "Restoring backup '$BACKUP_NAME'..."
cp -r "$RESTORE_PATH"/* "$SRC_DIR/"

echo "Backup restored successfully."
