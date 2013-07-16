echo "Exporting $(truck.localDirectories)..."
echo "from $(truck.localPath)..."

echo "Copying $(truck.localDirectories) from $(truck.localPath)..."

for dir in $(truck.localDirectories); do
	cp -r $(truck.localPath)/$dir $(truck.tempRoot)/
done
