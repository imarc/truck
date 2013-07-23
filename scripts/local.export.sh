echo "Exporting $(truck.localDirectories)..."
echo "from $(truck.localPath)..."

echo "Copying $(truck.localDirectories) from $(truck.localPath)..."

if [ ! -d $(truck.tempRoot) ]; then
	mkdir $(truck.tempRoot)
fi

for dir in $(truck.localDirectories); do
	assert cp -r $(truck.localPath)/$dir $(truck.tempRoot)/
done
