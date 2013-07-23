echo "Switching $(truck.tempRoot) to $(truck.envRoot)..."
echo "Moving $(truck.envRoot) to $(truck.backupRoot)..."

if [ -d $(truck.backupRoot) ]; then
	echo "Removing old $(truck.backupRoot)..."
	rm -rf $(truck.backupRoot)
fi

assert mv $(truck.envRoot) $(truck.backupRoot)
assert mv $(truck.tempRoot) $(truck.envRoot)
