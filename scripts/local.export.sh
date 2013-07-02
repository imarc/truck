echo "Exporting $(truck.local.directories)..."
echo "from $(truck.local.path)..."

echo "Copying $(truck.local.directories) from $(truck.local.path)..."

for dir in $(truck.local.directories); do
	cp -r $(truck.local.path)/$dir $(truck.tempRoot)/
done
