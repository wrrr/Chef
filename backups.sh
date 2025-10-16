#!/bin/zsh

PROJECT_DIR=~/Chef
BACKUP_DIR="$PROJECT_DIR/backups"

mkdir -p "$BACKUP_DIR"

echo "Available backups:"
ls -1 "$BACKUP_DIR" | grep chef_backup_ | sort

echo "\nEnter the timestamp of the backup you want to restore (e.g., 20251014_193153):"
read TIMESTAMP

RESTORE_PATH="$BACKUP_DIR/chef_backup_$TIMESTAMP"

if [ ! -d "$RESTORE_PATH" ]; then
  echo "Backup not found: $RESTORE_PATH"
  exit 1
fi

echo "Creating a safety backup of current project..."
SAFETY_BACKUP="$BACKUP_DIR/chef_backup_safety_$(date +%Y%m%d_%H%M%S)"
cp -r "$PROJECT_DIR/src" "$SAFETY_BACKUP/src"
cp -r "$PROJECT_DIR/public" "$SAFETY_BACKUP/public"
cp "$PROJECT_DIR/package.json" "$SAFETY_BACKUP/package.json"
cp "$PROJECT_DIR/package-lock.json" "$SAFETY_BACKUP/package-lock.json"

echo "Safety backup created at $SAFETY_BACKUP"

echo "Are you sure you want to restore backup $TIMESTAMP? This will overwrite current files. (yes/no)"
read CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

echo "Restoring backup..."
cp -r "$RESTORE_PATH/src" "$PROJECT_DIR/src"
cp -r "$RESTORE_PATH/public" "$PROJECT_DIR/public"
cp "$RESTORE_PATH/package.json" "$PROJECT_DIR/package.json"
cp "$RESTORE_PATH/package-lock.json" "$PROJECT_DIR/package-lock.json"

echo "Restore complete."
